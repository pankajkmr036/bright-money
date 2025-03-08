// app/components/Budget/AddEditBudgetModal.tsx
import React, { useEffect, useState } from "react"
import {
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native"
import { Text, Button } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { addBudget, updateBudget, deleteBudget } from "@/store/budget/budgetSlice"
import { CategorySelector } from "./CategorySelector"

interface AddEditBudgetModalProps {
  visible: boolean
  onClose: () => void
}

export const AddEditBudgetModal = ({ visible, onClose }: AddEditBudgetModalProps) => {
  const { themed } = useAppTheme()
  const dispatch = useAppDispatch()
  const { currentEditBudget, currentMonth } = useAppSelector((state) => state.budget)

  // Local state for form fields
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [isCategorySelectorVisible, setIsCategorySelectorVisible] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      if (currentEditBudget) {
        setCategory(currentEditBudget.category)
        setAmount(currentEditBudget.allocated.toString())
      } else {
        setCategory("")
        setAmount("")
      }
    }
  }, [visible, currentEditBudget])

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!category || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return // Show error message
    }

    const budgetData = {
      category,
      allocated: Number(amount),
      spent: currentEditBudget?.spent || 0,
      month: currentMonth,
      year: parseInt(currentMonth.split("-")[0], 10),
    }

    if (currentEditBudget) {
      dispatch(
        updateBudget({
          ...budgetData,
          id: currentEditBudget.id,
        }),
      )
    } else {
      dispatch(addBudget(budgetData))
    }

    onClose()
  }

  // Handle budget deletion
  const handleDelete = () => {
    if (currentEditBudget) {
      dispatch(deleteBudget(currentEditBudget.id))
      onClose()
    }
  }

  // Select category
  const handleSelectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory)
    setIsCategorySelectorVisible(false)
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={themed($modalOverlay)}>
          <View style={themed($modalContainer)}>
            <View style={themed($modalHeader)}>
              <Text
                text={currentEditBudget ? "Edit Budget" : "Add New Budget"}
                style={themed($modalTitle)}
              />
              <TouchableOpacity onPress={onClose} style={themed($closeButton)}>
                <Text text="✕" style={themed($closeButtonText)} />
              </TouchableOpacity>
            </View>

            <View style={themed($formContainer)}>
              {/* Category Selector */}
              <View style={themed($inputContainer)}>
                <Text text="Category" style={themed($inputLabel)} />
                <TouchableOpacity
                  style={themed($categoryInput)}
                  onPress={() => setIsCategorySelectorVisible(true)}
                >
                  <Text
                    text={category || "Select a category"}
                    style={[themed($categoryText), !category && themed($placeholderText)]}
                  />
                </TouchableOpacity>
              </View>

              {/* Amount Input */}
              <View style={themed($inputContainer)}>
                <Text text="Budget Amount (₹)" style={themed($inputLabel)} />
                <View style={themed($amountInputContainer)}>
                  <Text text="₹" style={themed($currencySymbol)} />
                  <TextInput
                    style={themed($amountInput)}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              {/* Buttons */}
              <View style={themed($buttonContainer)}>
                {currentEditBudget && (
                  <Button
                    text="Delete"
                    onPress={handleDelete}
                    style={themed($deleteButton)}
                    textStyle={themed($deleteButtonText)}
                  />
                )}

                <Button
                  text={currentEditBudget ? "Update" : "Add"}
                  onPress={handleSubmit}
                  style={themed($submitButton)}
                  textStyle={themed($submitButtonText)}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Category Selector Modal */}
      <CategorySelector
        visible={isCategorySelectorVisible}
        onClose={() => setIsCategorySelectorVisible(false)}
        onSelectCategory={handleSelectCategory}
        selectedCategory={category}
      />
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
  paddingTop: 20,
  paddingBottom: Platform.OS === "ios" ? 40 : 20,
})

const $modalHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  marginBottom: spacing.md,
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

const $formContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
})

const $inputContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $inputLabel: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 16,
  fontWeight: "500",
  marginBottom: spacing.xs,
})

const $categoryInput: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 8,
  padding: spacing.sm,
  backgroundColor: colors.palette.neutral200,
})

const $categoryText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
})

const $placeholderText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $amountInputContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 8,
  backgroundColor: colors.palette.neutral200,
  paddingHorizontal: spacing.sm,
})

const $currencySymbol: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "500",
  marginRight: 4,
})

const $amountInput: ThemedStyle<TextStyle> = () => ({
  flex: 1,
  fontSize: 16,
  paddingVertical: 12,
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: spacing.lg,
})

const $deleteButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: colors.error,
  marginRight: spacing.sm,
})

const $deleteButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
})

const $submitButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.tint,
  marginLeft: spacing.sm,
})

const $submitButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})
