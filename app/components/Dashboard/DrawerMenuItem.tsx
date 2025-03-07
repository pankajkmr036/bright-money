import { FC } from "react"
import { ViewStyle, TextStyle } from "react-native"
import { Button, Icon, IconTypes } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"

import { type ThemedStyle } from "@/theme"

interface DrawerMenuItemProps {
  icon: IconTypes
  label: string
  onPress: () => void
}

const ICON_SIZE = 18
export const DrawerMenuItem: FC<DrawerMenuItemProps> = ({ icon, label, onPress }) => {
  const { themed } = useAppTheme()

  return (
    <Button
      preset="default"
      text={label}
      onPress={onPress}
      style={themed($menuItem)}
      textStyle={themed($menuItemText)}
      LeftAccessory={({ style }) => <Icon icon={icon} size={ICON_SIZE} containerStyle={style} />}
    />
  )
}

const $menuItem: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.transparent,
  borderRadius: 0,
  borderBottomWidth: 1,
  borderBottomColor: "#e0e0e0",
  paddingVertical: spacing.sm,
  marginVertical: spacing.xxs,
})

const $menuItemText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 16,
  color: colors.text,
  marginLeft: spacing.xs,
})
