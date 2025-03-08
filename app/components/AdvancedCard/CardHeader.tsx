// app/components/Card/CardHeader.tsx
import React, { ReactNode } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface CardHeaderProps {
  title: string
  subtitle?: string
  rightComponent?: ReactNode
}

export const CardHeader = ({ title, subtitle, rightComponent }: CardHeaderProps) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <View style={themed($textContainer)}>
        <Text preset="subheading" text={title} style={themed($title)} />
        {subtitle && <Text text={subtitle} style={themed($subtitle)} />}
      </View>

      {rightComponent && <View style={themed($rightComponentContainer)}>{rightComponent}</View>}
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: spacing.md,
})

const $textContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $title: ThemedStyle<TextStyle> = () => ({
  marginBottom: 4,
})

const $subtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $rightComponentContainer: ThemedStyle<ViewStyle> = () => ({
  marginLeft: 8,
})
