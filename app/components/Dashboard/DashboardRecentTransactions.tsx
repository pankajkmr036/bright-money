// Updated DashboardRecentTransactions.tsx
import React from "react"
import { View, ViewStyle, ActivityIndicator, TextStyle } from "react-native"
import { Text, ListView } from "@/components"
import { TransactionItem } from "@/components/Transaction"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useNavigation } from "@react-navigation/native"
import { useAppSelector } from "@/store/store"
import { CardHeader, ContentCard } from "../AdvancedCard"
import { LinkButton } from "../Buttons"

export const DashboardRecentTransactions = () => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()

  // Get data from Redux store
  const { transactions, isLoading } = useAppSelector((state) => state.transactions)
  // Select first 5 transactions from the store
  const recentTransactions = transactions.slice(0, 5)

  const handleViewAllTransactions = () => {
    navigation.navigate("Transactions")
  }

  return (
    <ContentCard>
      <CardHeader title="Recent Transactions" />

      {isLoading ? (
        <View style={themed($loadingContainer)}>
          <ActivityIndicator size="large" color={themed($loaderColor).color} />
        </View>
      ) : !recentTransactions.length ? (
        <View style={themed($emptyContainer)}>
          <Text text="No recent transactions" style={themed($emptyText)} />
        </View>
      ) : (
        <>
          <ListView
            data={recentTransactions}
            renderItem={({ item }) => <TransactionItem transaction={item} />}
            estimatedItemSize={70}
          />

          <LinkButton text="View All Transactions" onPress={handleViewAllTransactions} />
        </>
      )}
    </ContentCard>
  )
}

// New styles
const $loadingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xl,
  justifyContent: "center",
  alignItems: "center",
  minHeight: 150,
})

const $loaderColor: ThemedStyle<{ color: string }> = ({ colors }) => ({
  color: colors.tint,
})

const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xl,
  justifyContent: "center",
  alignItems: "center",
  minHeight: 150,
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.textDim,
  textAlign: "center",
})
