// app/components/Budget/BudgetProgressBar.tsx
import React from "react"
import { View, ViewStyle } from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface BudgetProgressBarProps {
  allocated: number
  spent: number
}

export const BudgetProgressBar = ({ allocated, spent }: BudgetProgressBarProps) => {
  const { themed } = useAppTheme()

  // Calculate percentage used
  const percentUsed = Math.min((spent / allocated) * 100, 100)

  // Determine color based on percentage
  const getProgressColor = () => {
    if (percentUsed > 100) return "#E94B77" // Red for over budget
    if (percentUsed > 85) return "#FFC107" // Yellow for approaching limit
    return "#00C928" // Green for good standing
  }

  const progressColor = getProgressColor()

  return (
    <View style={themed($container)}>
      <View
        style={[
          themed($progressFill),
          {
            width: `${percentUsed}%`,
            backgroundColor: progressColor,
          },
        ]}
      />
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 10,
  backgroundColor: colors.palette.neutral300,
  borderRadius: 5,
  overflow: "hidden",
})

const $progressFill: ThemedStyle<ViewStyle> = () => ({
  height: "100%",
  borderRadius: 5,
})
