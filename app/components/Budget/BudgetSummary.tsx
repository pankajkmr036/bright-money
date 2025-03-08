// app/components/Budget/BudgetSummary.tsx
import React, { useMemo } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { Budget } from "@/services/api/mockApi/budgetService"

interface BudgetSummaryProps {
  budgets: Budget[]
}

export const BudgetSummary = ({ budgets }: BudgetSummaryProps) => {
  const { themed } = useAppTheme()

  // Calculate summary values
  const summary = useMemo(() => {
    const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0)
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
    const remaining = Math.max(totalAllocated - totalSpent, 0)
    const percentUsed = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0

    return {
      totalAllocated,
      totalSpent,
      remaining,
      percentUsed: Math.min(percentUsed, 100),
    }
  }, [budgets])

  // Format number with locale
  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-IN")
  }

  return (
    <View style={themed($container)}>
      <View style={themed($summaryCards)}>
        <View style={themed($card)}>
          <Text text="Total Budget" style={themed($cardTitle)} />
          <Text text={`₹${formatAmount(summary.totalAllocated)}`} style={themed($cardValue)} />
        </View>

        <View style={themed($card)}>
          <Text text="Total Spent" style={themed($cardTitle)} />
          <Text text={`₹${formatAmount(summary.totalSpent)}`} style={themed($cardValue)} />
        </View>

        <View style={themed($card)}>
          <Text text="Remaining" style={themed($cardTitle)} />
          <Text text={`₹${formatAmount(summary.remaining)}`} style={themed($cardValue)} />
        </View>
      </View>

      {/* Overall progress bar */}
      <View style={themed($overallProgressContainer)}>
        <View style={themed($progressLabelContainer)}>
          <Text text="Overall Budget" style={themed($progressLabel)} />
          <Text text={`${Math.round(summary.percentUsed)}%`} style={themed($percentageText)} />
        </View>

        <View style={themed($progressBar)}>
          <View
            style={[
              themed($progressFill),
              {
                width: `${summary.percentUsed}%`,
                backgroundColor: summary.percentUsed > 85 ? "#FFC107" : "#00C928",
              },
            ]}
          />
        </View>
      </View>
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  marginBottom: spacing.sm,
})

const $summaryCards: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: spacing.md,
})

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.palette.neutral100,
  borderRadius: 10,
  padding: spacing.sm,
  marginHorizontal: spacing.xxs,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2,
})

const $cardTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
  marginBottom: 4,
})

const $cardValue: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "bold",
})

const $overallProgressContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
})

const $progressLabelContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 6,
})

const $progressLabel: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "500",
})

const $percentageText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "500",
})

const $progressBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 8,
  backgroundColor: colors.palette.neutral300,
  borderRadius: 4,
  overflow: "hidden",
})

const $progressFill: ThemedStyle<ViewStyle> = () => ({
  height: "100%",
  borderRadius: 4,
})
