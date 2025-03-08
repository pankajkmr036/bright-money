// app/components/Budget/BudgetItem.tsx
import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Text, ProgressBar } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { Budget } from "@/services/api/mockApi/budgetService"
import { useBudgetCalculations } from "@/hooks/useBudgetCalculations"

interface BudgetItemProps {
  budget: Budget
  onPress?: (budget: Budget) => void
  compact?: boolean // For dashboard vs full view
}

export const BudgetItem = ({ budget, onPress, compact = false }: BudgetItemProps) => {
  const { themed } = useAppTheme()
  const { calculatePercentage, getStatusColor, formatCurrency, getStatusText } =
    useBudgetCalculations()

  const percentage = calculatePercentage(budget.allocated, budget.spent)
  const statusColor = getStatusColor(budget.allocated, budget.spent)
  const statusText = getStatusText(budget.allocated, budget.spent)

  const handlePress = () => {
    if (onPress) onPress(budget)
  }

  return (
    <TouchableOpacity
      style={[themed($container), compact && themed($compactContainer)]}
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={themed($header)}>
        <Text style={themed($categoryName)}>{budget.category}</Text>
        <Text style={themed($amountText)}>
          ₹{formatCurrency(budget.spent)}{" "}
          <Text style={themed($allocatedText)}>/ ₹{formatCurrency(budget.allocated)}</Text>
        </Text>
      </View>

      <ProgressBar progress={percentage} height={8} fillColor={statusColor} />

      <View style={themed($statusContainer)}>
        <Text style={themed($statusText)}>{statusText}</Text>
        {!compact && (
          <Text
            style={themed($remainingText)}
            text={`₹${formatCurrency(Math.max(budget.allocated - budget.spent, 0))} remaining`}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
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

const $compactContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.sm,
  marginBottom: spacing.sm,
})

const $header: ThemedStyle<ViewStyle> = () => ({
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

const $amountText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "500",
})

const $allocatedText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontWeight: "normal",
})

const $statusContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: spacing.xs,
})

const $statusText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $remainingText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
  textAlign: "right",
})
