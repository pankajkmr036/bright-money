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

export const BudgetOverview = () => {
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
