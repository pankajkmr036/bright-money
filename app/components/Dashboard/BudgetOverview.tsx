// Updated BudgetOverview.tsx
import { useNavigation } from "@react-navigation/native"
import { CardHeader, ContentCard } from "@/components/AdvancedCard"
import { LinkButton } from "../Buttons"
import { useAppSelector } from "@/store/store"
import { BudgetList } from "../Budget/BudgetList"
import { ActivityIndicator, View, ViewStyle } from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

export const BudgetOverview = () => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()

  const { budgets, isLoading } = useAppSelector((state) => state.budget)

  const dashboardBudgets = budgets.slice(0, 4)

  const handleViewAllBudgets = () => {
    navigation.navigate("Budget" as never)
  }

  return (
    <ContentCard>
      <CardHeader title="Budget Overview" subtitle="This Month's Spending" />

      {isLoading ? (
        <View style={themed($loaderContainer)}>
          <ActivityIndicator size="large" color={themed($loaderColor).color} />
        </View>
      ) : (
        <>
          <BudgetList budgets={dashboardBudgets} title="" compact={true} showEmptyState={true} />
          <LinkButton text="View all budgets" onPress={handleViewAllBudgets} />
        </>
      )}
    </ContentCard>
  )
}

// New styles
const $loaderContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xl,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 120,
})

const $loaderColor: ThemedStyle<{ color: string }> = ({ colors }) => ({
  color: colors.tint,
})
