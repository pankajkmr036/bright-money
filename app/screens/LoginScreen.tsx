import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { ThemedStyle } from "@/theme"
// import { useNavigation } from "@react-navigation/native"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()

  const { theme, themed } = useAppTheme()
  return (
    <Screen
      preset="scroll"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={themed($container)}></View>
    </Screen>
  )
}

// Styles
const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.background,
  paddingHorizontal: spacing.lg,
})
