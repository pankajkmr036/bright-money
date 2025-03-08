import React from "react"
import { View, ViewStyle, ActivityIndicator } from "react-native"
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
    // Navigate to Transactions screen
    navigation.navigate("Transactions")
  }

  return (
    <ContentCard>
      <CardHeader title="Recent Transactions" />

      {isLoading ? (
        <View style={themed($loadingContainer)}>
          <ActivityIndicator size="large" color={themed($loaderColor).color} />
        </View>
      ) : (
        <ListView
          data={recentTransactions}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          estimatedItemSize={70}
        />
      )}

      <LinkButton text="View All Transactions" onPress={handleViewAllTransactions} />
    </ContentCard>
  )
}

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $loaderColor: ThemedStyle<{ color: string }> = ({ colors }) => ({
  color: colors.tint,
})
