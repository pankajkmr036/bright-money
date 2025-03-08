// app/components/Budget/CategorySelector.tsx
import React from "react"
import { 
  View, 
  Modal, 
  ScrollView,
  TouchableOpacity, 
  ViewStyle, 
  TextStyle 
} from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { TransactionCategory } from "@/types"

interface CategorySelectorProps {
  visible: boolean
  onClose: () => void
  onSelectCategory: (category: string) => void
  selectedCategory: string
}

// Available categories
const AVAILABLE_CATEGORIES: TransactionCategory[] = [
  "food and drinks",
  "shopping",
  "entertainment",
  "banking and finance",
  "medical",
  "apps and software",
  "automobile and fuel",
  "card and finance charges",
  "education",
  "emi",
  "bills and utilities",
  "travel",
  "investment",
  "other"
]

export const CategorySelector = ({ 
  visible, 
  onClose, 
  onSelectCategory,
  selectedCategory 
}: CategorySelectorProps) => {
  const { themed } = useAppTheme()
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={themed($modalOverlay)}>
        <View style={themed($modalContainer)}>
          <View style={themed($modalHeader)}>
            <Text text="Select Category" style={themed($modalTitle)} />
            <TouchableOpacity onPress={onClose} style={themed($closeButton)}>
              <Text text="✕" style={themed($closeButtonText)} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={themed($categoryList)}>
            {AVAILABLE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  themed($categoryItem),
                  selectedCategory === category && themed($selectedCategory)
                ]}
                onPress={() => onSelectCategory(category)}
              >
                <Text 
                  text={category} 
                  style={[
                    themed($categoryText),
                    selectedCategory === category && themed($selectedCategoryText)
                  ]} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

// Styles
const $modalOverlay: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "flex-end",
})

const $modalContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  maxHeight: "80%",
})

const $modalHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: spacing.lg,
  borderBottomWidth: 1,
  borderBottomColor: "rgba(0, 0, 0, 0.1)",
})

const $modalTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
  fontWeight: "bold",
})

const $closeButton: ThemedStyle<ViewStyle> = () => ({
  padding: 5,
})

const $closeButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 24,
})

const $categoryList: ThemedStyle<ViewStyle> = () => ({
  paddingBottom: 30,
})

const $categoryItem: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral300,
})

const $selectedCategory: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
})

const $categoryText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  textTransform: "capitalize",
})

const $selectedCategoryText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontWeight: "600",
  color: colors.tint,
})