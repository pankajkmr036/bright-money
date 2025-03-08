// app/components/Budget/MonthSelector.tsx - updated
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

  // Navigation handlers
  const handlePrevMonth = () => {
    let newMonth = month - 1
    let newYear = year

    if (newMonth < 1) {
      newMonth = 12
      newYear -= 1
    }

    onMonthChange(`${newYear}-${String(newMonth).padStart(2, "0")}`)
  }

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
      <View style={themed($controlsContainer)}>
        <TouchableOpacity onPress={handlePrevMonth} style={themed($arrowButton)}>
          <Icon icon="caretLeft" size={20} />
        </TouchableOpacity>

        <View style={themed($monthContainer)}>
          <Text text={displayMonth} style={themed($monthText)} />
        </View>

        <TouchableOpacity onPress={handleNextMonth} style={themed($arrowButton)}>
          <Icon icon="caretRight" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Updated styles
const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingVertical: spacing.md,
  backgroundColor: colors.background,
  alignItems: "center",
})

const $controlsContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
})

const $monthContainer: ThemedStyle<ViewStyle> = () => ({
  width: 180, // Fixed width to accommodate longest month name
  alignItems: "center",
})

const $monthText: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "600",
})

const $arrowButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
  width: 40, // Fixed width
  alignItems: "center",
})
