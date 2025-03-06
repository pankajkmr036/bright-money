import React, { useState, useEffect } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Keyboard,
  Alert,
  Image,
  ImageStyle,
} from "react-native"
import { useDispatch } from "react-redux"
import { Screen, Text, TextField, Button, Icon } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { useAppTheme } from "@/utils/useAppTheme"
import { login } from "@/store/auth/authSlice"
import { AppDispatch } from "@/store/store"
import { colors, type ThemedStyle } from "@/theme"
import type { LoginCredentials } from "@/services/api/mockApi/authTypes"

export interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme, themed } = useAppTheme()
  const dispatch = useDispatch<AppDispatch>()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Clear username error when username is modified
    if (username && usernameError) {
      setUsernameError("")
    }
  }, [username])

  useEffect(() => {
    // Clear password error when password is modified
    if (password && passwordError) {
      setPasswordError("")
    }
  }, [password])

  const validateForm = (): boolean => {
    let isValid = true

    // Validate username
    if (!username.trim()) {
      setUsernameError("Username is required")
      isValid = false
    } else if (username.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters")
      isValid = false
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required")
      isValid = false
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      isValid = false
    }

    return isValid
  }

  const handleLogin = async () => {
    Keyboard.dismiss()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create credentials object
      const credentials: LoginCredentials = {
        username,
        password,
      }

      // Dispatch login action to Redux
      await dispatch(login(credentials)).unwrap()

      // If login is successful, navigate to Dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      })
    } catch (error) {
      Alert.alert("Login Failed", "Invalid username or password. Please try again.", [
        { text: "OK" },
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  // Password visibility toggle icon
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
          <Image
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
            preset="filled"
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
      <ActivityIndicator size="small" color={colors.background} />
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

const $loginButtonText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  color: colors.palette.neutral100,
  fontSize: 16,
  fontFamily: typography.primary.bold,
})

const $iconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xxs,
})
