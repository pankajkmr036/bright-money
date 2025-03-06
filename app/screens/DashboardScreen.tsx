import React, { FC, useCallback, useState } from "react"
import { View, ViewStyle, TextStyle, Platform } from "react-native"
import { Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { $styles, type ThemedStyle } from "@/theme"
import { MainTabScreenProps } from "@/navigators/MainNavigator"
import { Drawer } from "react-native-drawer-layout"
import { DrawerIconButton } from "./DrawerIconButton"
import { isRTL } from "@/i18n"

const isAndroid = Platform.OS === "android"

export const DashboardScreen: FC<MainTabScreenProps<"Dashboard">> = () => {
  const { themed } = useAppTheme()
  const $topInset = useSafeAreaInsetsStyle(["top"])

  const [open, setOpen] = useState(false)

  const toggleDrawer = useCallback(() => {
    if (!open) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [open])

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="back"
      drawerPosition={isRTL ? "right" : "left"}
      renderDrawerContent={() => <View style={themed([$drawer, $topInset])}></View>}
    >
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$styles.flex1}
        {...(isAndroid ? { KeyboardAvoidingViewProps: { behavior: undefined } } : {})}
      >
        <DrawerIconButton onPress={toggleDrawer} />
        <View style={[themed($headerContainer), $topInset]}>
          <Text preset="heading" text="Dashboard" style={themed($headerText)} />
        </View>
      </Screen>
    </Drawer>
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

const $drawer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
})
