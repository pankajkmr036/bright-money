// app/screens/TransactionScreen.tsx
import React, { FC, useCallback, useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  SectionList,
} from "react-native"
import { Screen, Text, Icon, EmptyState } from "@/components"
import { MainTabScreenProps } from "@/navigators/MainNavigator"
import { useAppTheme } from "@/utils/useAppTheme"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import type { ThemedStyle } from "@/theme"
import { Transaction, FilterTab } from "@/types"
import {
  fetchTransactions,
  fetchCategories,
  toggleFilterModal,
  setActiveFilterTab,
  toggleSearchMode,
  updateFilter,
  applyFilters,
  searchTransactions,
} from "@/store/transactions/transactionsSlice"
import {
  TransactionItem,
  FilterTabs,
  SearchBar,
  TransactionFilterModal,
} from "@/components/Transaction"

// Helper type for the section data
interface TransactionSection {
  title: string
  data: Transaction[]
}

export const TransactionScreen: FC<MainTabScreenProps<"Transactions">> = () => {
  const { themed } = useAppTheme()
  const $topInset = useSafeAreaInsetsStyle(["top"])
  const dispatch = useAppDispatch()

  // Get data from Redux store
  const {
    filteredTransactions,
    categories,
    filter,
    isFilterModalVisible,
    activeFilterTab,
    isSearchMode,
    isLoading,
  } = useAppSelector((state) => state.transactions)

  // Local state
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  // Fetch transactions and categories on component mount
  useEffect(() => {
    dispatch(fetchTransactions())
    dispatch(fetchCategories())
  }, [dispatch])

  // Handle tab press
  const handleTabPress = useCallback(
    (tab: FilterTab) => {
      dispatch(setActiveFilterTab(tab))
      dispatch(toggleFilterModal(true))
    },
    [dispatch],
  )

  // Toggle search mode
  const handleSearchToggle = useCallback(() => {
    dispatch(toggleSearchMode(true))
  }, [dispatch])

  // Cancel search
  const handleCancelSearch = useCallback(() => {
    setSearchQuery("")
    dispatch(toggleSearchMode(false))
    dispatch(fetchTransactions()) // Reset to all transactions
  }, [dispatch])

  // Handle search
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      dispatch(searchTransactions(searchQuery))
    }
  }, [dispatch, searchQuery])

  // Group transactions by month for section list
  const sectionedTransactions = useMemo(() => {
    if (!filteredTransactions.length) return []

    // Group by month/year
    const grouped = filteredTransactions.reduce(
      (acc, transaction) => {
        const date = new Date(transaction.date)
        const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`

        if (!acc[monthYear]) {
          acc[monthYear] = []
        }
        acc[monthYear].push(transaction)
        return acc
      },
      {} as Record<string, Transaction[]>,
    )

    // Convert to sections format
    return Object.entries(grouped).map(([title, data]) => ({
      title,
      data,
    })) as TransactionSection[]
  }, [filteredTransactions])

  // Apply filter from modal
  const handleApplyFilter = useCallback(
    (updatedFilter) => {
      dispatch(updateFilter(updatedFilter))
      dispatch(applyFilters(updatedFilter))
    },
    [dispatch],
  )

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await dispatch(fetchTransactions())
    setRefreshing(false)
  }, [dispatch])

  // Render each section header
  const renderSectionHeader = useCallback(
    ({ section }: { section: TransactionSection }) => (
      <View style={themed($sectionHeader)}>
        <Text text={section.title.toUpperCase()} style={themed($sectionTitle)} />
      </View>
    ),
    [themed],
  )

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["bottom"]}
    >
      <View style={[themed($headerContainer), $topInset]}>
        {isSearchMode ? (
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            onCancel={handleCancelSearch}
            placeholder="Search transactions..."
          />
        ) : (
          <View style={themed($headerContent)}>
            <Text preset="heading" text="transactions" style={themed($headerText)} />
            <TouchableOpacity
              style={themed($searchButton)}
              onPress={handleSearchToggle}
              accessibilityLabel="Search transactions"
            >
              <Icon icon="search" size={22} color={themed($iconColor).color} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!isSearchMode && <FilterTabs activeTab={activeFilterTab} onTabPress={handleTabPress} />}

      {isLoading && !refreshing ? (
        <View style={themed($loadingContainer)}>
          <ActivityIndicator size="large" color={themed($loaderColor).color} />
        </View>
      ) : (
        <SectionList
          sections={sectionedTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          contentContainerStyle={themed($listContent)}
          ListEmptyComponent={
            <EmptyState
              preset="generic"
              style={themed($emptyState)}
              heading={searchQuery ? "No matching transactions" : "No transactions yet"}
              content={
                searchQuery
                  ? "Try adjusting your search or filters"
                  : "Your transactions will appear here"
              }
              buttonOnPress={handleRefresh}
              ImageProps={{ resizeMode: "contain" }}
            />
          }
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}

      {/* Filter Modal */}
      <TransactionFilterModal
        visible={isFilterModalVisible}
        activeTab={activeFilterTab}
        filter={filter}
        categories={categories}
        onClose={() => dispatch(toggleFilterModal(false))}
        onApplyFilter={handleApplyFilter}
      />
    </Screen>
  )
}

// Styles
const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
})

const $headerContent: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
})

const $headerText: ThemedStyle<TextStyle> = () => ({
  fontSize: 32,
  letterSpacing: -1,
})

const $searchButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
  borderRadius: 20,
})

const $iconColor: ThemedStyle<{ color: string }> = ({ colors }) => ({
  color: colors.text,
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $loaderColor: ThemedStyle<{ color: string }> = ({ colors }) => ({
  color: colors.tint,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexGrow: 1,
  paddingBottom: spacing.lg,
})

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl,
})

const $sectionHeader: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  backgroundColor: colors.background,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral300,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  fontWeight: "600",
  color: colors.text,
})
