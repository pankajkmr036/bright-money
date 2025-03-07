// app/components/Transaction/TransactionItem.tsx
import React from "react"
import { View, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import { Transaction, TransactionCategory } from "@/types/transaction"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface TransactionItemProps {
  transaction: Transaction
  onPress?: (transaction: Transaction) => void
}

export const TransactionItem = ({ transaction, onPress }: TransactionItemProps) => {
  const { themed } = useAppTheme()

  // Format the date (e.g., "02 Mar '25")
  const dateObj = new Date(transaction.date)
  const displayDate = `${String(dateObj.getDate()).padStart(2, "0")} ${dateObj.toLocaleString("default", { month: "short" })} '${dateObj.getFullYear().toString().slice(2)}`

  // Determine if transaction is income or expense
  const isIncome = transaction.type === "income"
  const displayAmount = isIncome
    ? `+₹${Math.abs(transaction.amount).toFixed(2)}`
    : `₹${Math.abs(transaction.amount).toFixed(2)}`

  // Get initials for avatar
  const getInitials = (name: string) => {
    const nameParts = name.split(" ")
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return nameParts[0].slice(0, 2).toUpperCase()
  }

  // Helper functions for merchant info display
  const getCategoryIcon = (category: TransactionCategory) => {
    // Replace with appropriate icons for each category
    switch (category) {
      case "medical":
        return "bell"
      case "food and drinks":
        return "menu"
      case "investment":
        return "settings"
      case "banking and finance":
        return "lock"
      default:
        return "settings"
    }
  }

  const handlePress = () => {
    if (onPress) onPress(transaction)
  }

  return (
    <TouchableOpacity style={themed($container)} onPress={handlePress} activeOpacity={0.7}>
      <View style={themed($avatarContainer)}>
        <Text text={getInitials(transaction.merchantName)} style={themed($avatarText)} />
      </View>

      <View style={$contentContainer}>
        <View style={$topRow}>
          <Text text={transaction.merchantName} style={themed($merchantName)} />
          <Text text={displayAmount} style={[themed($amount), isIncome && themed($incomeAmount)]} />
        </View>

        <View style={$bottomRow}>
          <Text text={transaction.category} style={themed($categoryText)} />
          <Text text={displayDate} style={themed($dateText)} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  paddingVertical: spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral300,
  paddingHorizontal: spacing.lg,
})

const $avatarContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: colors.palette.neutral200,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 16,
})

const $avatarText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 18,
  fontWeight: "bold",
  color: colors.text,
})

const $contentContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}

const $topRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 6,
}

const $bottomRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

const $merchantName: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontSize: 16,
  fontWeight: "500",
  fontFamily: typography.primary.medium,
})

const $amount: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "500",
})

const $incomeAmount: ThemedStyle<TextStyle> = () => ({
  color: "#00C928", // Green color for income
})

const $categoryText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $dateText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})
