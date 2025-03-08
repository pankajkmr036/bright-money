// app/components/Dashboard/BudgetOverview.tsx
import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

// Mock budget data - in a real app, this would come from Redux
const BUDGET_DATA = [
  { category: "Food & Drinks", allocated: 15000, spent: 12300, color: "#00C928" },
  { category: "Shopping", allocated: 8000, spent: 7200, color: "#FFC107" },
  { category: "Entertainment", allocated: 5000, spent: 5500, color: "#E94B77" },
  { category: "Transportation", allocated: 3000, spent: 1800, color: "#37AF80" },
]

export const BudgetOverview = () => {
  const { themed } = useAppTheme()

  // Helper function to determine the status color based on percentage used
  const getStatusColor = (allocated: number, spent: number) => {
    const percentUsed = (spent / allocated) * 100
    if (percentUsed > 100) return "#E94B77" // Red for over budget
    if (percentUsed > 85) return "#FFC107" // Yellow for approaching limit
    return "#00C928" // Green for good standing
  }

  return (
    <View style={themed($container)}>
      <Text preset="subheading" text="Budget Overview" style={themed($title)} />
      <Text style={themed($subtitle)}>This Month's Spending</Text>

      {/* Budget progress bars will go here */}
      <View style={themed($budgetList)}>
        {BUDGET_DATA.map((budget, index) => (
          <View key={index} style={themed($budgetItem)}>
            {/* Budget item UI with progress bar will go here */}
          </View>
        ))}
      </View>
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

const $budgetItem: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.md,
})


