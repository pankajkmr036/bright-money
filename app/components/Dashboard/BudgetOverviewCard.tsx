// Updated BudgetOverviewCard.tsx
import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface BudgetOverviewCardProps {
  currentMonth: string
  currentSpend: string
  compareAmount: string
  prevMonth: string
}

export const BudgetOverviewCard = ({
  currentMonth = "FEB'25",
  currentSpend = "59.76K",
  compareAmount = "40.97K",
  prevMonth = "Jan'25",
}: BudgetOverviewCardProps) => {
  const { themed } = useAppTheme()

  return (
    <TouchableOpacity style={themed($container)}>
      <View style={themed($headerContainer)}>
        <Text text={`RECAP - SPENDS IN ${currentMonth}`} style={themed($headerText)} />
      </View>

      <View style={themed($contentContainer)}>
        <View style={themed($dataContainer)}>
          <Text text={`₹${compareAmount} lower than ${prevMonth}`} style={themed($compareText)} />
          <Text
            text={`Total spends: ₹${currentSpend}. Tap for insights`}
            style={themed($spendText)}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

// Styles remain the same

// Styles
const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 20,
  padding: spacing.md,
  marginHorizontal: spacing.lg,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxs,
})

const $headerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: "#00C928", // Green color from design
  fontSize: 16,
  fontWeight: "bold",
})

const $contentContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $dataContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $compareText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.text,
  fontWeight: "400",
})

const $spendText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})
