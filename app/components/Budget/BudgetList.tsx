// app/components/Budget/BudgetList.tsx
import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { Budget } from "@/services/api/mockApi/budgetService"
import { useAppDispatch } from "@/store/store"
import { setCurrentEditBudget, toggleAddEditModal } from "@/store/budget/budgetSlice"
import { BudgetItem } from "./BudgetItem"

interface BudgetListProps {
  budgets: Budget[]
  title?: string
  compact?: boolean
  showEmptyState?: boolean
}

export const BudgetList = ({
  budgets,
  title = "Your Budgets",
  compact = false,
  showEmptyState = true,
}: BudgetListProps) => {
  const { themed } = useAppTheme()
  const dispatch = useAppDispatch()

  const handleEditBudget = (budget: Budget) => {
    dispatch(setCurrentEditBudget(budget))
    dispatch(toggleAddEditModal(true))
  }

  if (budgets.length === 0 && showEmptyState) {
    return (
      <View style={themed($emptyContainer)}>
        <Text text="No budgets found for this month" style={themed($emptyText)} />
        <Text text="Add a budget to start tracking your spending" style={themed($emptySubText)} />
      </View>
    )
  }

  return (
    <View style={themed($container)}>
      {title && <Text text={title} style={themed($sectionTitle)} />}

      {budgets.map((budget) => (
        <BudgetItem key={budget.id} budget={budget} onPress={handleEditBudget} compact={compact} />
      ))}

      {!compact && <View style={themed($bottomPadding)} />}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
  flex: 1, // Take up all available space
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 18,
  fontWeight: "600",
  marginBottom: spacing.md,
})

// Add padding at the bottom to avoid fab button overlap
const $bottomPadding: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: spacing.xxl,
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
