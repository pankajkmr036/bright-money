// app/screens/TransactionScreen.tsx
import React, { FC, useCallback, useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  Platform,
  Pressable,
} from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { Screen, Text, Icon, ListView, EmptyState } from "@/components"
import { MainTabScreenProps } from "@/navigators/MainNavigator"
import { useAppTheme } from "@/utils/useAppTheme"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import type { ThemedStyle } from "@/theme"
import { Transaction, TransactionCategory, FilterTab } from "@/models/transaction"
import {
  fetchTransactions,
  fetchCategories,
  toggleFilterModal,
  updateFilter,
  applyFilters,
  searchTransactions,
} from "@/store/transactions/transactionsSlice"
import { $styles } from "../theme"
import { delay } from "../utils/delay"

// Import our custom components
import { TransactionFilterModal, SearchBar } from "../components/Transaction"

export const TransactionScreen: FC<MainTabScreenProps<"Transactions">> = () => {
  const { themed } = useAppTheme()
  const $topInset = useSafeAreaInsetsStyle(["top"])
  const dispatch = useAppDispatch()

  // Get data from Redux store
  const { filteredTransactions, categories, filter, isFilterModalVisible, isLoading } =
    useAppSelector((state) => state.transactions)

  // Local state
  const [activeTab, setActiveTab] = useState<FilterTab>("MOST RECENT")
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  // Fetch transactions and categories on component mount
  useEffect(() => {
    ;(async function load() {
      await dispatch(fetchTransactions())
      await dispatch(fetchCategories())
    })()
  }, [dispatch])

  // Handle manual refresh with a minimum delay for better UX
  const manualRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([dispatch(fetchTransactions()), delay(750)])
    setRefreshing(false)
  }, [dispatch])

  // Handle search
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      dispatch(searchTransactions(searchQuery))
    }
  }, [dispatch, searchQuery])

  // Cancel search
  const cancelSearch = useCallback(() => {
    setIsSearchMode(false)
    setSearchQuery("")
    dispatch(fetchTransactions()) // Reset to all transactions
  }, [dispatch])

  // Handle tab change
  const handleTabPress = useCallback(
    (tab: FilterTab) => {
      setActiveTab(tab)
      dispatch(toggleFilterModal(true))
    },
    [dispatch],
  )

  // Apply filter
  const handleApplyFilter = useCallback(
    (updatedFilter) => {
      dispatch(updateFilter(updatedFilter))
      dispatch(applyFilters(updatedFilter))
    },
    [dispatch],
  )

  // List header with filters
  const ListHeaderComponent = useMemo(() => {
    return (
      <>
        <View style={[themed($headerContainer), $topInset]}>
          {isSearchMode ? (
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              onCancel={cancelSearch}
              placeholder="Search transactions..."
              autoFocus={true}
            />
          ) : (
            <View style={themed($headerContent)}>
              <Text preset="heading" text="transactions" style={themed($headerText)} />
              <TouchableOpacity
                style={themed($searchButton)}
                onPress={() => setIsSearchMode(true)}
                accessibilityLabel="Search transactions"
              >
                <Icon icon="search" size={22} color={themed($iconColor).color} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!isSearchMode && <FilterTabs activeTab={activeTab} onTabPress={handleTabPress} />}
      </>
    )
  }, [
    $topInset,
    activeTab,
    cancelSearch,
    handleSearch,
    handleTabPress,
    isSearchMode,
    searchQuery,
    themed,
  ])

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1} safeAreaEdges={["bottom"]}>
      <ListView<Transaction>
       
        data={filteredTransactions}
        extraData={filteredTransactions.length}
        refreshing={refreshing}
        estimatedItemSize={88}
        onRefresh={manualRefresh}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          isLoading ? (
            <View style={themed($loadingContainer)}>
              <ActivityIndicator size="large" color={themed($loaderColor).color} />
            </View>
          ) : (
            <EmptyState
              preset="generic"
              style={themed($emptyState)}
              heading={searchQuery ? "No matching transactions" : "No transactions yet"}
              content={
                searchQuery
                  ? "Try adjusting your search or filters"
                  : "Your transactions will appear here"
              }
              buttonOnPress={manualRefresh}
              ImageProps={{ resizeMode: "contain" }}
            />
          )
        }
        renderItem={({ item }) => <TransactionCard transaction={item} />}
      />

      {/* Filter Modal */}
      <TransactionFilterModal
        visible={isFilterModalVisible}
        activeTab={activeTab}
        filter={filter}
        categories={categories}
        onClose={() => dispatch(toggleFilterModal(false))}
        onApplyFilter={handleApplyFilter}
      />
    </Screen>
  )
}

// Rendering the filter tabs
const FilterTabs = ({
  activeTab,
  onTabPress,
}: {
  activeTab: FilterTab
  onTabPress: (tab: FilterTab) => void
}) => {
  const { themed } = useAppTheme()

  const tabs: FilterTab[] = ["MOST RECENT", "CATEGORY", "RANGE"]

  return (
    <View style={themed($tabsContainer)}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[themed($tab), activeTab === tab && themed($activeTab)]}
          onPress={() => onTabPress(tab)}
          activeOpacity={0.7}
        >
          <Text
            text={tab}
            size="xs"
            style={[themed($tabText), activeTab === tab && themed($activeTabText)]}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}

// Transaction Card Component
const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()

  // Animation value for card press
  const pressed = useSharedValue(0)

  // Format date (e.g., "12 Feb")
  const displayDate = new Date(transaction.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  })

  // Determine if transaction is income or expense
  const isIncome = transaction.type === "income"
  const displayAmount = `${isIncome ? "+₹" : "₹"}${Math.abs(transaction.amount).toFixed(2)}`

  // Foreign currency information
  const foreignCurrencyInfo =
    transaction.originalCurrency && transaction.originalAmount
      ? `${transaction.originalCurrency} ${transaction.originalAmount.toFixed(2)}`
      : null

  // Animated style for card press effect
  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.98], Extrapolation.CLAMP) }],
      backgroundColor: interpolate(
        pressed.value,
        [0, 1],
        [colors.palette.neutral100, colors.palette.neutral200],
        Extrapolation.CLAMP,
      ),
    }
  })

  const onPressIn = () => {
    pressed.value = withSpring(1, { damping: 50, stiffness: 300 })
  }

  const onPressOut = () => {
    pressed.value = withSpring(0, { damping: 50, stiffness: 300 })
  }

  // Get icon based on category
  const getIconForCategory = (category: TransactionCategory) => {
    switch (category) {
      case "medical":
        return "lock"
      case "food and drinks":
        return "bell"
      case "wallet and digital payment":
        return "menu"
      default:
        return "settings"
    }
  }

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{ marginBottom: 2 }} // Add small margin to prevent flickering between cards
    >
      <Animated.View style={[themed($cardContainer), animatedCardStyle]}>
        <View style={$iconContainer}>
          <Icon
            icon={getIconForCategory(transaction.category)}
            size={20}
            containerStyle={themed($categoryIcon)}
            color={colors.text}
          />
        </View>

        <View style={$contentContainer}>
          <View style={$mainContent}>
            <Text
              weight="medium"
              size="md"
              text={transaction.merchantName}
              style={themed($merchantText)}
            />
            <Text
              weight="medium"
              text={displayAmount}
              style={[isIncome ? themed($positiveAmount) : themed($negativeAmount)]}
            />
          </View>

          <View style={$subContent}>
            <Text size="xs" text={transaction.category} style={themed($categoryText)} />
            <Text size="xs" text={displayDate} style={themed($dateText)} />
          </View>

          {foreignCurrencyInfo && (
            <View style={$foreignCurrencyContainer}>
              <Text size="xs" text={foreignCurrencyInfo} style={themed($foreignCurrencyText)} />
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  )
}

// Styles
const $listContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.lg,
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

const $loadingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingTop: spacing.xxl,
})

const $loaderColor: ThemedStyle<{ color: string }> = ({ colors }) => ({
  color: colors.tint,
})

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl,
})

// Filter Tabs Styles
const $tabsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  paddingHorizontal: spacing.lg,
  marginBottom: spacing.md,
})

const $tab: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  marginRight: spacing.sm,
  backgroundColor: colors.palette.neutral200,
})

const $activeTab: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.palette.neutral700,
  backgroundColor: colors.palette.neutral100,
})

const $tabText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontWeight: "500",
})

const $activeTabText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "600",
})

// Transaction Card Styles
const $cardContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  padding: spacing.md,
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  marginVertical: spacing.xs,
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: Platform.OS === "android" ? 2 : 0,
})

const $iconContainer: ViewStyle = {
  marginRight: 16,
}

const $categoryIcon: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: colors.palette.neutral200,
  justifyContent: "center",
  alignItems: "center",
  marginTop: spacing.xs,
})

const $contentContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}

const $mainContent: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 4,
}

const $subContent: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}

const $foreignCurrencyContainer: ViewStyle = {
  marginTop: 4,
}

const $merchantText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
})

const $positiveAmount: ThemedStyle<TextStyle> = () => ({
  color: "#00C928", // Green color
  fontSize: 16,
})

const $negativeAmount: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
})

const $categoryText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $dateText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $foreignCurrencyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontStyle: "italic",
})
