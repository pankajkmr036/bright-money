import React, { FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import type { ThemedStyle } from "@/theme"
import { MainTabScreenProps } from "@/navigators/MainNavigator"

export const DashboardScreen: FC<MainTabScreenProps<"Dashboard">> = () => {
  const { themed } = useAppTheme()
  const $topInset = useSafeAreaInsetsStyle(["top"])

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["bottom"]}
    >
      <View style={[themed($headerContainer), $topInset]}>
        <Text preset="heading" text="Dashboard" style={themed($headerText)} />
      </View>
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
