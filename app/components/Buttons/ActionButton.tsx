// app/components/Buttons/ActionButton.tsx
import React from "react"
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

type ButtonVariant = "primary" | "secondary" | "outline"

interface ActionButtonProps extends TouchableOpacityProps {
  text: string
  variant?: ButtonVariant
  textStyle?: StyleProp<TextStyle>
  fullWidth?: boolean
  height?: number
}

export const ActionButton = ({
  text,
  variant = "primary",
  style,
  textStyle,
  fullWidth = false,
  height = 48,
  ...rest
}: ActionButtonProps) => {
  const { themed } = useAppTheme()

  // Get style based on variant
  const getButtonStyle = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case "primary":
        return themed($primaryButton)
      case "secondary":
        return themed($secondaryButton)
      case "outline":
        return themed($outlineButton)
      default:
        return themed($primaryButton)
    }
  }

  // Get text style based on variant
  const getTextStyle = (): StyleProp<TextStyle> => {
    switch (variant) {
      case "primary":
        return themed($primaryButtonText)
      case "secondary":
        return themed($secondaryButtonText)
      case "outline":
        return themed($outlineButtonText)
      default:
        return themed($primaryButtonText)
    }
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), { height }, fullWidth && { flex: 1 }, style]}
      activeOpacity={0.8}
      {...rest}
    >
      <Text text={text} style={[getTextStyle(), textStyle]} />
    </TouchableOpacity>
  )
}

// Primary button (dark background, light text)
const $primaryButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral800,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  borderRadius: 8,
})

const $primaryButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  fontWeight: "500",
  color: colors.palette.neutral100,
})

// Secondary button (light background, dark text)
const $secondaryButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  borderRadius: 8,
})

const $secondaryButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  fontWeight: "500",
  color: colors.text,
})

// Outline button (transparent with border)
const $outlineButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: colors.border,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  borderRadius: 8,
})

const $outlineButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  fontWeight: "500",
  color: colors.text,
})
