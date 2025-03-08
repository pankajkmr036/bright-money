import React, { FC, useCallback, useState } from "react"
import { View, ViewStyle, TextStyle, Platform, ScrollView } from "react-native"
import { Screen, Text, Button, Icon } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { $styles, colors, type ThemedStyle } from "@/theme"
import { MainTabScreenProps } from "@/navigators/MainNavigator"
import { Drawer } from "react-native-drawer-layout"
import { isRTL } from "@/i18n"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { logout } from "@/store/auth/authSlice"
import {
  BalanceHeader,
  DashboardRecentTransactions,
  DrawerIconButton,
  DrawerMenuItem,
  ExpenseDistributionChart,
  ScrollableCards,
} from "@/components/Dashboard"

const isAndroid = Platform.OS === "android"

export const DashboardScreen: FC<MainTabScreenProps<"Dashboard">> = () => {
  const { themed } = useAppTheme()
  const $topInset = useSafeAreaInsetsStyle(["top"])
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const [open, setOpen] = useState(false)

  const toggleDrawer = useCallback(() => {
    setOpen((prev) => !prev)
  }, [open])

  const handleLogout = () => {
    dispatch(logout())
  }

  // Drawer content component
  const renderDrawerContent = () => (
    <View style={themed([$drawer, $topInset])}>
      {/* User Profile Section */}
      <View style={themed($profileSection)}>
        <View style={themed($avatarContainer)}>
          <Icon icon="ladybug" size={60} color={colors.tint} />
        </View>
        <Text preset="bold" text={user?.name || "User"} style={themed($userName)} />
        <Text text={user?.email || ""} style={themed($userEmail)} />
      </View>

      {/* Drawer Menu Items */}
      <View style={themed($menuContainer)}>
        <DrawerMenuItem icon="settings" label="Settings" onPress={() => {}} />
        <DrawerMenuItem icon="bell" label="Notifications" onPress={() => {}} />
        <DrawerMenuItem icon="lock" label="Privacy" onPress={() => {}} />
      </View>

      {/* Logout Button */}
      <View style={themed($logoutContainer)}>
        <Button
          preset="reversed"
          text="Logout"
          style={themed($logoutButton)}
          textStyle={themed($logoutButtonText)}
          LeftAccessory={({ style }) => (
            <Icon icon="back" color="white" size={20} containerStyle={style} />
          )}
          onPress={handleLogout}
        />
      </View>
    </View>
  )

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerPosition={isRTL ? "right" : "left"}
      renderDrawerContent={renderDrawerContent}
    >
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        style={$styles.flex1}
        {...(isAndroid ? { KeyboardAvoidingViewProps: { behavior: undefined } } : {})}
      >
        <DrawerIconButton onPress={toggleDrawer} />

        <ScrollView>
          <BalanceHeader />
          <ScrollableCards />
          <ExpenseDistributionChart />
          <DashboardRecentTransactions />
        </ScrollView>
      </Screen>
    </Drawer>
  )
}

const $drawer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
  paddingHorizontal: 16,
})

const $profileSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.xl,
  borderBottomWidth: 1,
  borderBottomColor: "#e0e0e0",
})

const $avatarContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: colors.palette.neutral300,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 12,
})

const $userName: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  fontSize: 18,
  marginBottom: spacing.xs,
})

const $userEmail: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontSize: 14,
})

const $menuContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
  flex: 1,
})

const $logoutContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.lg,
  marginBottom: spacing.lg,
})

const $logoutButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.tint,
})

const $logoutButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
})
