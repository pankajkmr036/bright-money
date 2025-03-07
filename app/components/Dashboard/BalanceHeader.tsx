// app/components/Dashboard/BalanceHeader.tsx
import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { useAppSelector } from "@/store/store"

export const BalanceHeader = () => {
  const { themed } = useAppTheme()
  const user = useAppSelector((state) => state.auth.user)

  // For demo purposes, hardcoded balance
  const balance = "9,896.55"
  const firstName = user?.name?.split(" ")[0] || "User"

  return (
    <View style={themed($container)}>
      <View style={themed($avatarContainer)}>
        <Text text={firstName.charAt(0)} style={themed($avatarText)} />
      </View>

      <View style={themed($balanceContainer)}>
        <Text text={`hey ${firstName},`} style={themed($greeting)} />
        <Text text="here is your total balance" style={themed($balanceLabel)} />
        <Text text={`₹${balance}`} style={themed($balanceAmount)} />
      </View>
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.xl,
})

const $avatarContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 48,
  height: 48,
  borderRadius: 35,
  backgroundColor: "#E94B77", // Pink color from the design
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 20,
  alignContent: "center",
})

const $avatarText: ThemedStyle<TextStyle> = () => ({
  fontSize: 28,
  fontWeight: "bold",
  color: "white",
})

const $balanceContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
})

const $greeting: ThemedStyle<TextStyle> = () => ({
  fontSize: 24,
  fontWeight: "500",
})

const $balanceLabel: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "400",
  marginBottom: 10,
})

const $balanceAmount: ThemedStyle<TextStyle> = () => ({
  fontSize: 32,
  fontWeight: "bold",
  lineHeight: 36,
})
