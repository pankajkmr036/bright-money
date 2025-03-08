// app/components/Budget/MonthSelector.tsx
import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Text, Icon } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface MonthSelectorProps {
  currentMonth: string // Format: 'YYYY-MM'
  onMonthChange: (month: string) => void
}

export const MonthSelector = ({ currentMonth, onMonthChange }: MonthSelectorProps) => {
  const { themed } = useAppTheme()

  // Parse current month and year
  const [year, month] = currentMonth.split("-").map(Number)

  // Format for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const displayMonth = `${monthNames[month - 1]} ${year}`

  // Navigate to previous month
  const handlePrevMonth = () => {
    let newMonth = month - 1
    let newYear = year

    if (newMonth < 1) {
      newMonth = 12
      newYear -= 1
    }

    onMonthChange(`${newYear}-${String(newMonth).padStart(2, "0")}`)
  }

  // Navigate to next month
  const handleNextMonth = () => {
    let newMonth = month + 1
    let newYear = year

    if (newMonth > 12) {
      newMonth = 1
      newYear += 1
    }

    onMonthChange(`${newYear}-${String(newMonth).padStart(2, "0")}`)
  }

  return (
    <View style={themed($container)}>
      <TouchableOpacity onPress={handlePrevMonth} style={themed($arrowButton)}>
        <Icon icon="caretLeft" size={20} />
      </TouchableOpacity>

      <Text text={displayMonth} style={themed($monthText)} />

      <TouchableOpacity onPress={handleNextMonth} style={themed($arrowButton)}>
        <Icon icon="caretRight" size={20} />
      </TouchableOpacity>
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.md,
  backgroundColor: colors.background,
})

const $monthText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 18,
  fontWeight: "600",
  marginHorizontal: spacing.md,
})

const $arrowButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
})
