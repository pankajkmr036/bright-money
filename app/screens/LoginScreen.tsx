import { FC, useState } from "react"
import { ActivityIndicator, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { AutoImage, Button, Icon, Screen, Text, TextField } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { ThemedStyle } from "@/theme"
// import { useNavigation } from "@react-navigation/native"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = () => {
  const { theme, themed } = useAppTheme()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = () => {}

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const PasswordVisibilityIcon = () => (
    <Icon
      icon={passwordVisible ? "view" : "hidden"}
      color={theme.colors.text}
      onPress={togglePasswordVisibility}
      containerStyle={themed($iconContainer)}
    />
  )

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

        <View style={themed($formContainer)}>
          <Text preset="subheading" text="Welcome" style={themed($welcomeText)} />
          <Text text="Sign in to your account" style={themed($subtitleText)} />

          <TextField
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            helper={usernameError}
            status={usernameError ? "error" : undefined}
            containerStyle={themed($textField)}
          />

          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            autoCorrect={false}
            helper={passwordError}
            status={passwordError ? "error" : undefined}
            containerStyle={themed($textField)}
            RightAccessory={PasswordVisibilityIcon}
          />

          <Button
            text="Sign In"
            style={[themed($loginButton), isSubmitting && themed($disabledButton)]}
            textStyle={themed($loginButtonText)}
            disabled={isSubmitting}
            onPress={handleLogin}
            LeftAccessory={isSubmitting ? LoadingIndicator : undefined}
          />
        </View>
      </View>
    </Screen>
  )
}

const LoadingIndicator = () => {
  return (
    <View>
      <ActivityIndicator size="small" color="white" />
    </View>
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

const $formContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $welcomeText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
  textAlign: "center",
})

const $subtitleText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  marginBottom: spacing.xl,
  textAlign: "center",
  color: colors.textDim,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $loginButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.tint,
  borderWidth: 0,
  marginVertical: spacing.lg,
  height: 50,
})

const $disabledButton: ThemedStyle<ViewStyle> = () => ({
  opacity: 0.7,
})

const $loginButtonText: ThemedStyle<TextStyle> = () => ({
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
})

const $iconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xxs,
})
