// app/components/ProgressBar.tsx
import React from "react"
import { View, ViewStyle } from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface ProgressBarProps {
  progress: number // 0-100
  height?: number
  backgroundColor?: string
  fillColor?: string
  style?: ViewStyle
}

export const ProgressBar = ({
  progress,
  height = 8,
  backgroundColor,
  fillColor,
  style,
}: ProgressBarProps) => {
  const { themed } = useAppTheme()

  // Ensure progress is between 0-100
  const safeProgress = Math.min(Math.max(0, progress), 100)

  // Get status-based color if fillColor not provided
  const getFillColor = () => {
    if (fillColor) return fillColor

    if (safeProgress > 100) return "#E94B77" // Red
    if (safeProgress > 85) return "#FFC107" // Yellow
    return "#00C928" // Green
  }

  return (
    <View
      style={[
        themed($container),
        {
          height,
          backgroundColor: backgroundColor || themed($container).backgroundColor,
        },
        style,
      ]}
    >
      <View
        style={[
          themed($progressFill),
          {
            width: `${safeProgress}%`,
            backgroundColor: getFillColor(),
            height,
          },
        ]}
      />
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral300,
  borderRadius: 4,
  overflow: "hidden",
  width: "100%",
})

const $progressFill: ThemedStyle<ViewStyle> = () => ({
  height: "100%",
  borderRadius: 4,
})
