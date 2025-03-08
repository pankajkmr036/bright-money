// app/components/Dashboard/BudgetOverview.tsx
import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { useNavigation } from "@react-navigation/native"

// Mock budget data - in a real app, this would come from Redux
const BUDGET_DATA = [
  { category: "Food & Drinks", allocated: 15000, spent: 12300, color: "#00C928" },
  { category: "Shopping", allocated: 8000, spent: 7200, color: "#FFC107" },
  { category: "Entertainment", allocated: 5000, spent: 5500, color: "#E94B77" },
  { category: "Transportation", allocated: 3000, spent: 1800, color: "#37AF80" },
]

export const BudgetOverview = () => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()

  // Format currency with comma separators
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Helper function to determine the status color based on percentage used
  const getStatusColor = (allocated: number, spent: number) => {
    const percentUsed = (spent / allocated) * 100
    if (percentUsed > 100) return "#E94B77" // Red for over budget
    if (percentUsed > 85) return "#FFC107" // Yellow for approaching limit
    return "#00C928" // Green for good standing
  }

  // Calculate budget usage percentage
  const calculatePercentage = (allocated: number, spent: number) => {
    return Math.min((spent / allocated) * 100, 100) // Cap at 100% for display
  }

  // Handle navigation to Budget screen
  const handleViewAllBudgets = () => {
    navigation.navigate("Budget" as never)
  }

  return (
    <View style={themed($container)}>
      <Text preset="subheading" text="Budget Overview" style={themed($title)} />
      <Text style={themed($subtitle)}>This Month's Spending</Text>

      {/* Budget progress bars */}
      <View style={themed($budgetList)}>
        {BUDGET_DATA.map((budget, index) => {
          const percentage = calculatePercentage(budget.allocated, budget.spent)
          const statusColor = getStatusColor(budget.allocated, budget.spent)

          return (
            <View key={index} style={themed($budgetItem)}>
              <View style={themed($budgetHeader)}>
                <Text style={themed($categoryName)}>{budget.category}</Text>
                <Text style={themed($amountText)}>
                  ₹{formatCurrency(budget.spent)}{" "}
                  <Text style={themed($allocatedText)}>/ ₹{formatCurrency(budget.allocated)}</Text>
                </Text>
              </View>

              {/* Progress bar background */}
              <View style={themed($progressBarBackground)}>
                {/* Progress bar fill */}
                <View
                  style={[
                    themed($progressBarFill),
                    {
                      width: `${percentage}%`,
                      backgroundColor: statusColor,
                    },
                  ]}
                />
              </View>

              {/* Status indicator */}
              <View style={themed($statusContainer)}>
                <View style={[themed($statusIndicator), { backgroundColor: statusColor }]} />
                <Text style={themed($statusText)}>
                  {percentage > 100
                    ? "Over budget"
                    : percentage > 85
                      ? "Approaching limit"
                      : "On track"}
                </Text>
              </View>
            </View>
          )
        })}
      </View>

      {/* View all budgets button */}
      <TouchableOpacity
        style={themed($viewAllButton)}
        onPress={handleViewAllBudgets}
        activeOpacity={0.7}
      >
        <Text style={themed($viewAllText)}>View all budgets</Text>
      </TouchableOpacity>
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
  backgroundColor: "white",
  borderRadius: 12,
  marginHorizontal: spacing.md,
  marginTop: spacing.lg,
})

const $title: ThemedStyle<TextStyle> = () => ({
  marginBottom: 4,
})

const $subtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
  marginBottom: 16,
})

const $budgetList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $budgetItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $budgetHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
})

const $categoryName: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "500",
})

const $amountText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "500",
})

const $allocatedText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontWeight: "normal",
})

const $progressBarBackground: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 8,
  backgroundColor: colors.palette.neutral300,
  borderRadius: 4,
  overflow: "hidden",
})

const $progressBarFill: ThemedStyle<ViewStyle> = () => ({
  height: "100%",
  borderRadius: 4,
})

const $statusContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  marginTop: spacing.xs,
})

const $statusIndicator: ThemedStyle<ViewStyle> = () => ({
  width: 8,
  height: 8,
  borderRadius: 4,
  marginRight: 6,
})

const $statusText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
})

const $viewAllButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.md,
  paddingVertical: spacing.sm,
})

const $viewAllText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
  fontSize: 16,
  fontWeight: "500",
})
