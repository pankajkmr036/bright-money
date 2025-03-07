import React from "react"
import { View, ViewStyle } from "react-native"
import { Card } from "@/components"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

export const DashboardOverviewCards = () => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($cardsContainer)}>
      {/* Total Balance Card */}
      <Card heading="Total Balance" content="₹50,000" />

      {/* Budget Overview Card */}
      <Card heading="Budget" content="Spent ₹20,000 of ₹30,000" />

      {/* TODO: Add Pie Chart for Expense Distribution */}
      <Card heading="Expense Distribution" content="Pie Chart Placeholder" />

      {/* TODO: Add Line Chart for Monthly Expenditure */}
      <Card heading="Monthly Expenditure" content="Line Chart Placeholder" />
    </View>
  )
}

// Styles
const $cardsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexWrap: "wrap",
  justifyContent: "space-between",
  padding: spacing.md,
})
