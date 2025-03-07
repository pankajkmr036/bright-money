// app/components/Transaction/EmptyTransactionState.tsx
import React from "react"
import { View, ViewStyle, TextStyle, Image, ImageStyle } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface EmptyTransactionStateProps {
  message?: string
  isSearchResult?: boolean
}

export const EmptyTransactionState = ({
  message = "No transactions found",
  isSearchResult = false,
}: EmptyTransactionStateProps) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <Image source={require("../../../assets/icons/x.png")} style={themed($image)} />
      <Text text={message} style={themed($text)} />
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: spacing.xxl,
})

const $image: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: 60,
  height: 60,
  marginBottom: 20,
})

const $text: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  fontSize: 18,
  fontWeight: "500",
  textAlign: "center",
  marginTop: spacing.sm,
})
