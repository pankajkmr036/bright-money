// app/components/Card/ContentCard.tsx
import React, { ReactNode } from "react"
import { View, ViewStyle } from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface ContentCardProps {
  children: ReactNode
  style?: ViewStyle
}

export const ContentCard = ({ children, style }: ContentCardProps) => {
  const { themed } = useAppTheme()

  return <View style={[themed($container), style]}>{children}</View>
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
  backgroundColor: "white",
  borderRadius: 12,
  marginHorizontal: spacing.md,
  marginTop: spacing.lg,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2,
})
