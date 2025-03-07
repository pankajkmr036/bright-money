// app/screens/TransactionScreen.tsx
import React, { FC, useState } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Screen, Text, Icon } from "@/components"
import { MainTabScreenProps } from "@/navigators/MainNavigator"
import { useAppTheme } from "@/utils/useAppTheme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import type { ThemedStyle } from "@/theme"

export const TransactionScreen: FC<MainTabScreenProps<"Transactions">> = () => {
  const { themed } = useAppTheme()
  const $topInset = useSafeAreaInsetsStyle(["top"])

  // State will go here

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["bottom"]}
    >
      <View style={[themed($headerContainer), $topInset]}>
        <Text preset="heading" text="Transactions" style={themed($headerText)} />
      </View>

      {/* Filter tabs will go here */}

      {/* Transaction list will go here */}

      {/* Filter modal will go here */}
    </Screen>
  )
}

// Styles
const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
})

const $headerText: ThemedStyle<TextStyle> = () => ({
  textAlign: "center",
})
