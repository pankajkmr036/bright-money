import React, { useState, useEffect, useRef, useMemo, ComponentType } from "react"
import { View, ViewStyle, TextStyle, ActivityIndicator, Keyboard, TextInput } from "react-native"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { Screen, Text, TextField, Button, Icon } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { useAppTheme } from "@/utils/useAppTheme"
import { login, clearError } from "@/store/auth/authSlice"
import { colors, type ThemedStyle } from "@/theme"
import type { TextFieldAccessoryProps } from "@/components/TextField"
import { ActionButton } from "@/components/Buttons"

export interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: React.FC<LoginScreenProps> = ({}) => {
  const { theme, themed } = useAppTheme()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [attemptsCount, setAttemptsCount] = useState(0)

  const passwordInput = useRef<TextInput>(null)

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

  // Clear any Redux error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

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
    setAttemptsCount(attemptsCount + 1)

    if (!validateForm()) {
      return
    }

    try {
      await dispatch(login({ username, password })).unwrap()
      // If we reach here, login was successful and the navigation will be handled by AppNavigator
    } catch (error) {
      // Error is handled by the Redux slice and will be available in the error state
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  // Password visibility toggle icon component
  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isPasswordVisible ? "view" : "hidden"}
            color={theme.colors.text}
            containerStyle={props.style}
            onPress={togglePasswordVisibility}
          />
        )
      },
    [isPasswordVisible, theme.colors.text],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={themed($container)}>
        <View style={themed($formContainer)}>
          <Text preset="subheading" text="Welcome" style={themed($welcomeText)} />
          <Text text="Sign in to your account" style={themed($subtitleText)} />

          {attemptsCount > 2 && (
            <Text text="Hint: Try 'demo' and 'password123'" size="xs" style={themed($hint)} />
          )}

          <TextField
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            helper={usernameError}
            status={usernameError ? "error" : undefined}
            containerStyle={themed($textField)}
            onSubmitEditing={() => passwordInput.current?.focus()}
          />

          <TextField
            ref={passwordInput}
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoCorrect={false}
            helper={passwordError}
            status={passwordError ? "error" : undefined}
            containerStyle={themed($textField)}
            RightAccessory={PasswordRightAccessory}
            onSubmitEditing={handleLogin}
          />

          {error && <Text text={error} style={themed($errorText)} />}

          <ActionButton text="Sign In" variant="primary" onPress={handleLogin} />
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

const $formContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.xl,
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

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.md,
  textAlign: "center",
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $errorText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.error,
  textAlign: "center",
  marginBottom: spacing.md,
})
