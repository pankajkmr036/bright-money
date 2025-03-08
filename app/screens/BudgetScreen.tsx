// app/screens/BudgetScreen.tsx - updated version
import React, { FC, useEffect } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { Screen, Text, Icon } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import type { ThemedStyle } from "@/theme"
import { MainTabScreenProps } from "@/navigators/MainNavigator"
import { useAppDispatch, useAppSelector } from "@/store/store"
import {
  fetchBudgetsByMonth,
  setCurrentMonth,
  toggleAddEditModal,
} from "@/store/budget/budgetSlice"
import { BudgetList } from "@/components/Budget/BudgetList"
import { BudgetSummary } from "@/components/Budget/BudgetSummary"
import { MonthSelector } from "@/components/Budget/MonthSelector"
import { AddEditBudgetModal } from "@/components/Budget/AddEditBudgetModal"

export const BudgetScreen: FC<MainTabScreenProps<"Budget">> = () => {
  const { themed } = useAppTheme()
  const $topInset = useSafeAreaInsetsStyle(["top"])
  const dispatch = useAppDispatch()

  const { budgets, currentMonth, isLoading, isAddEditModalVisible } = useAppSelector(
    (state) => state.budget,
  )

  // Fetch budgets when component mounts or month changes
  useEffect(() => {
    dispatch(fetchBudgetsByMonth(currentMonth))
  }, [dispatch, currentMonth])

  // Handle month change
  const handleMonthChange = (month: string) => {
    dispatch(setCurrentMonth(month))
  }

  // Open add budget modal
  const handleAddBudget = () => {
    dispatch(toggleAddEditModal(true))
  }

  return (
    <Screen
      preset="fixed" // Changed from scroll to fixed
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["bottom"]}
    >
      <View style={[themed($headerContainer), $topInset]}>
        <Text preset="heading" text="Budgets" style={themed($headerText)} />
      </View>

      {/* Month Selector */}
      <MonthSelector currentMonth={currentMonth} onMonthChange={handleMonthChange} />

      {/* Budget List (Scrollable) */}
      <View style={themed($budgetListContainer)}>
        {isLoading ? (
          <View style={themed($loadingContainer)}>
            <ActivityIndicator size="large" color={themed($loaderColor).color} />
          </View>
        ) : (
          <>
            {/* Budget Summary */}
            <BudgetSummary budgets={budgets} />
            <BudgetList budgets={budgets} />
          </>
        )}
      </View>

      {/* Floating Action Button to add new budget */}
      <TouchableOpacity style={themed($fabButton)} onPress={handleAddBudget} activeOpacity={0.8}>
        <Icon icon="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Add/Edit Budget Modal */}
      <AddEditBudgetModal
        visible={isAddEditModalVisible}
        onClose={() => dispatch(toggleAddEditModal(false))}
      />
    </Screen>
  )
}

// Styles - updated
const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
})

const $headerText: ThemedStyle<TextStyle> = () => ({
  textAlign: "left",
})

// New style for budget list container that takes remaining space
const $budgetListContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1, // Take remaining space
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $loaderColor: ThemedStyle<{ color: string }> = ({ colors }) => ({
  color: colors.tint,
})

const $fabButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: "absolute",
  bottom: spacing.xxxs,
  right: spacing.lg,
  width: 42,
  height: 42,
  borderRadius: 28,
  backgroundColor: colors.tint,
  justifyContent: "center",
  alignItems: "center",
  elevation: 5,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
})
