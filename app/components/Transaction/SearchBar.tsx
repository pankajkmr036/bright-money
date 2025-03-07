import { View, TextInput, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Icon } from "@/components"
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
  placeholder = "Search...",
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
          <Text text="Cancel" style={themed($cancelText)} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const Text = ({ text, style }: { text: string; style?: StyleProp<TextStyle> }) => {
  const { themed } = useAppTheme()
  return <Text style={[themed($defaultText), style]} text={text} />
}

const $defaultText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  color: colors.text,
  fontFamily: typography.primary.normal,
  fontSize: 16,
})

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  padding: spacing.sm,
  backgroundColor: "#F5F5F5",
})

const $searchContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
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
