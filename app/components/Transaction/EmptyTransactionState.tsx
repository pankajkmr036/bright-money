// app/components/EmptyTransactionState.tsx
import React from "react"
import { View, ViewStyle, TextStyle, Image } from "react-native"
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
      <Image source={require("../../../assets/icons/more.png")} style={$image} />
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

const $image: ViewStyle = {
  width: 80,
  height: 80,
  marginBottom: 20,
}

const $text: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  textAlign: "center",
  marginTop: spacing.sm,
})
