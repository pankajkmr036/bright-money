import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, ActivityIndicator } from "react-native"
import { Text, ListView } from "@/components"
import { TransactionItem } from "@/components/Transaction"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useNavigation } from "@react-navigation/native"
import { useAppSelector } from "@/store/store"

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
    <View style={themed($container)}>
      <View style={themed($headerContainer)}>
        <Text preset="subheading" text="Recent Transactions" />
        <TouchableOpacity onPress={handleViewAllTransactions}>
          <Text text="View All" style={themed($viewAllText)} />
        </TouchableOpacity>
      </View>

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
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.sm,
})

const $viewAllText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $loaderColor: ThemedStyle<{ color: string }> = ({ colors }) => ({
  color: colors.tint,
})
