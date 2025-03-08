// app/components/Buttons/LinkButton.tsx
import React from "react"
import { TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface LinkButtonProps {
  text: string
  onPress: () => void
  expanded?: boolean
}

export const LinkButton = ({ 
  text, 
  onPress, 
  expanded 
}: LinkButtonProps) => {
  const { themed } = useAppTheme()
  
  // Handle view more/less toggle if expanded prop is provided
  const buttonText = expanded !== undefined ? (expanded ? "View less" : "View more") : text
  
  return (
    <TouchableOpacity 
      style={themed($container)} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={themed($text)}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: spacing.md,
  paddingVertical: spacing.sm,
})

const $text: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
  fontSize: 16,
  fontWeight: '500',
})