// app/components/Transaction/SearchBar.tsx
import React from "react"
import { View, TextInput, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Icon, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onSubmitEditing?: () => void
  onCancel?: () => void
  placeholder?: string
  autoFocus?: boolean
}

export const SearchBar = ({
  value,
  onChangeText,
  onSubmitEditing,
  onCancel,
  placeholder = "Search transactions...",
  autoFocus = true,
}: SearchBarProps) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <View style={themed($searchContainer)}>
        <Icon icon="search" size={20} containerStyle={themed($searchIcon)} />
        <TextInput
          style={themed($input)}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor="#999"
          autoFocus={autoFocus}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")} style={themed($clearButton)}>
            <Icon icon="x" size={16} />
          </TouchableOpacity>
        )}
      </View>

      {onCancel && (
        <TouchableOpacity onPress={onCancel} style={themed($cancelButton)}>
          <Text style={themed($cancelText)} text="cancel" />
        </TouchableOpacity>
      )}
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  padding: spacing.sm,
})

const $searchContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
  borderRadius: 8,
  paddingHorizontal: 10,
})

const $searchIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.xs,
})

const $input: ThemedStyle<TextStyle> = () => ({
  flex: 1,
  height: 40,
  fontSize: 16,
})

const $clearButton: ThemedStyle<ViewStyle> = () => ({
  padding: 6,
})

const $cancelButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginLeft: spacing.sm,
  padding: spacing.xs,
})

const $cancelText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
})
