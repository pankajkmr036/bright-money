// app/components/Budget/BudgetList.tsx - updated version
import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { Budget } from "@/services/api/mockApi/budgetService"
import { useAppDispatch } from "@/store/store"
import { setCurrentEditBudget, toggleAddEditModal } from "@/store/budget/budgetSlice"
import { BudgetProgressBar } from "./BudgetProgressBar"

interface BudgetListProps {
  budgets: Budget[]
}

export const BudgetList = ({ budgets }: BudgetListProps) => {
  const { themed } = useAppTheme()
  const dispatch = useAppDispatch()

  // Handle edit budget
  const handleEditBudget = (budget: Budget) => {
    dispatch(setCurrentEditBudget(budget))
    dispatch(toggleAddEditModal(true))
  }

  // If no budgets, show empty state
  if (budgets.length === 0) {
    return (
      <View style={themed($emptyContainer)}>
        <Text text="No budgets found for this month" style={themed($emptyText)} />
        <Text text="Add a budget to start tracking your spending" style={themed($emptySubText)} />
      </View>
    )
  }

  return (
    <View style={themed($container)}>
      <Text text="Your Budgets" style={themed($sectionTitle)} />

      {budgets.map((budget) => (
        <TouchableOpacity
          key={budget.id}
          style={themed($budgetItem)}
          onPress={() => handleEditBudget(budget)}
          activeOpacity={0.7}
        >
          <View style={themed($budgetHeader)}>
            <Text text={budget.category} style={themed($categoryName)} numberOfLines={1} />
            <Text style={themed($budgetAmount)}>
              ₹{budget.spent.toLocaleString()} / ₹{budget.allocated.toLocaleString()}
            </Text>
          </View>

          <BudgetProgressBar allocated={budget.allocated} spent={budget.spent} />

          <View style={themed($statusContainer)}>
            <Text
              text={`${Math.min(Math.round((budget.spent / budget.allocated) * 100), 100)}% used`}
              style={themed($statusText)}
            />
            <Text
              text={`₹${Math.max(budget.allocated - budget.spent, 0).toLocaleString()} remaining`}
              style={themed($remainingText)}
            />
          </View>
        </TouchableOpacity>
      ))}
      {/* Add padding at bottom to ensure fab button doesn't cover last item */}
      <View style={themed($bottomPadding)} />
    </View>
  )
}

// Updated styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.md,
  flex: 1, // Take up all available space
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 18,
  fontWeight: "600",
  marginBottom: spacing.md,
})

const $budgetItem: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  padding: spacing.md,
  marginBottom: spacing.md,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2,
})

// Add padding at the bottom to avoid fab button overlap
const $bottomPadding: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: spacing.xxl,
})

// Rest of the styles remain the same...
const $budgetHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
})

const $categoryName: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  textTransform: "capitalize",
})

const $budgetAmount: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "500",
})

const $statusContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: spacing.xs,
})

const $statusText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $remainingText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
})

const $emptyText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 18,
  fontWeight: "600",
  textAlign: "center",
  marginBottom: spacing.sm,
})

const $emptySubText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.textDim,
  textAlign: "center",
})
