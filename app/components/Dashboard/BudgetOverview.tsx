// app/components/Dashboard/BudgetOverview.tsx
import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"

import { useNavigation } from "@react-navigation/native"
import { CardHeader, ContentCard } from "@/components/AdvancedCard"
import { LinkButton } from "../Buttons"
import { useAppSelector } from "@/store/store"
import { BudgetList } from "../Budget/BudgetList"
import { ThemedStyle } from "@/theme"

export const BudgetOverview = () => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()

  const { budgets } = useAppSelector((state) => state.budget)
  const dashboardBudgets = budgets.slice(0, 4)

  const handleViewAllBudgets = () => {
    navigation.navigate("Budget" as never)
  }

  return (
    <ContentCard>
      <CardHeader title="Budget Overview" subtitle="This Month's Spending" />
      <BudgetList budgets={dashboardBudgets} title="" compact={true} showEmptyState={true} />
      <LinkButton text="View all budgets" onPress={handleViewAllBudgets} />
    </ContentCard>
  )
}

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
