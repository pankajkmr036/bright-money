// app/components/TransactionItem.tsx
import React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Text, Icon } from "@/components"
import { Transaction } from "@/models/transaction"
import { formatDate } from "@/utils/formatDate"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { ViewStyle, TextStyle } from "react-native"

interface TransactionItemProps {
  transaction: Transaction
  onPress?: (transaction: Transaction) => void
}

export const TransactionItem = ({ transaction, onPress }: TransactionItemProps) => {
  const { themed } = useAppTheme()

  // Format the date (e.g., "12 Feb")
  const displayDate = formatDate(transaction.date, "d MMM")

  // Determine display amount and color
  const isIncome = transaction.type === "income"
  const displayAmount = `${isIncome ? "+₹" : "₹"}${Math.abs(transaction.amount).toFixed(2)}`

  // Handle foreign currency display
  const foreignCurrencyInfo =
    transaction.originalCurrency && transaction.originalAmount
      ? `${transaction.originalCurrency} ${transaction.originalAmount.toFixed(2)}`
      : null

  const handlePress = () => {
    if (onPress) {
      onPress(transaction)
    }
  }

  return (
    <TouchableOpacity style={themed($container)} onPress={handlePress} activeOpacity={0.7}>
      <View style={$iconContainer}>
        {/* This would be replaced with proper icons based on category */}
        <Icon
          icon={getCategoryIcon(transaction.category)}
          size={24}
          containerStyle={themed($icon)}
        />
      </View>

      <View style={$contentContainer}>
        <View style={$mainContent}>
          <Text weight="medium" size="md" text={transaction.merchantName} />
          <Text
            weight="medium"
            text={displayAmount}
            style={[isIncome ? themed($positiveAmount) : themed($negativeAmount)]}
          />
        </View>

        <View style={$subContent}>
          <Text size="xs" text={transaction.category} style={themed($categoryText)} />
          <Text size="xs" text={displayDate} style={themed($dateText)} />
        </View>

        {foreignCurrencyInfo && (
          <View style={$foreignCurrencyContainer}>
            <Text size="xs" text={foreignCurrencyInfo} style={themed($foreignCurrencyText)} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

// Helper function to map category to icon
const getCategoryIcon = (category: string): "lock" | "bell" | "menu" | "settings" => {
  // This would be expanded with proper category-to-icon mapping
  switch (category) {
    case "medical":
      return "lock"
    case "food and drinks":
      return "bell"
    case "wallet and digital payment":
      return "menu"
    default:
      return "settings"
  }
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  paddingVertical: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: "#E6E6E6",
})

const $iconContainer: ViewStyle = {
  marginRight: 12,
}

const $icon: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: colors.palette.neutral300,
  justifyContent: "center",
  alignItems: "center",
  marginTop: spacing.xs,
})

const $contentContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}

const $mainContent: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 4,
}

const $subContent: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}

const $foreignCurrencyContainer: ViewStyle = {
  marginTop: 4,
}

const $positiveAmount: ThemedStyle<TextStyle> = () => ({
  color: "#00C928", // Green color
})

const $negativeAmount: ThemedStyle<TextStyle> = () => ({
  color: "#000000", // Default text color
})

const $categoryText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $dateText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $foreignCurrencyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontStyle: "italic",
})
