// app/screens/TransactionScreen.tsx
import React, { FC, useCallback, useMemo, useState } from "react"
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
import { Transaction, FilterTab, TransactionFilter } from "@/types"
import {
  fetchTransactions,
  toggleFilterModal,
  setActiveFilterTab,
  toggleSearchMode,
  updateFilter,
  applyFilters,
  searchTransactions,
  resetFilters,
} from "@/store/transactions/transactionsSlice"
import {
  TransactionItem,
  FilterTabs,
  SearchBar,
  TransactionFilterModal,
  AppliedFilters,
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

  // Get active filters for the UI
  const activeFilters = useMemo(() => {
    const filters = []

    if (filter.sort !== "new to old") filters.push("sort")
    if (filter.type) filters.push("type")
    if (filter.categories.length > 0) filters.push("categories")
    if (filter.range.min > 0 || filter.range.max < 500000) filters.push("range")

    return filters
  }, [filter])

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

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    dispatch(resetFilters())
    dispatch(fetchTransactions())
  }, [dispatch])

  // Apply filter from modal
  const handleApplyFilter = useCallback(
    (updatedFilter: TransactionFilter) => {
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

  // Group transactions by month for section list
  const sectionedTransactions = useMemo(() => {
    if (!filteredTransactions.length) return []

    // Group by month/year
    const grouped = filteredTransactions.reduce(
      (acc, transaction) => {
        const date = new Date(transaction.date)
        const monthYear = `${date.toLocaleString("default", { month: "long" }).toUpperCase()} ${date.getFullYear()}`

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

  // Render each section header
  const renderSectionHeader = useCallback(
    ({ section }: { section: TransactionSection }) => (
      <View style={themed($sectionHeader)}>
        <Text text={section.title} style={themed($sectionTitle)} />
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
            <View style={themed($titleContainer)}>
              <Text preset="heading" text="transactions" style={themed($headerText)} />
            </View>
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

      {/* Applied filters */}
      <AppliedFilters
        filter={filter}
        activeFilters={activeFilters}
        onClearFilters={handleClearFilters}
        onTabPress={handleTabPress}
      />

      {/* Filter tabs */}
      {!isSearchMode && (
        <View>
          <FilterTabs
            tabs={["NEW TO OLD", "AMOUNT", "TYPE", "MONTH", "CATEGORY"]}
            activeTab={activeFilterTab}
            onTabPress={handleTabPress}
          />
        </View>
      )}

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

const $titleContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
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
  paddingHorizontal: spacing.lg,
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
