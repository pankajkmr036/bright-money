import { FC } from "react"
import { ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { AutoImage, Screen, Text } from "@/components"
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
      <View style={themed($container)}>
        <View style={themed($logoContainer)}>
          <AutoImage
            style={themed($logoImage)}
            source={require("../../assets/images/logo.jpeg")}
            resizeMode="contain"
          />
          <Text preset="heading" text="Bright Money" style={themed($logoText)} />
        </View>
      </View>
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

const $logoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginTop: spacing.xxxl,
  marginBottom: spacing.xxxl,
})

const $logoImage: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: 80,
  height: 80,
  marginBottom: spacing.md,
})

const $logoText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
})
