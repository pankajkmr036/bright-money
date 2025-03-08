// app/components/Budget/AddEditBudgetModal.tsx
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { View, TextInput, TouchableOpacity, ViewStyle, TextStyle, Keyboard } from "react-native"
import { Text, Button } from "@/components"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { useAppDispatch, useAppSelector } from "@/store/store"
import {
  addBudget,
  updateBudget,
  deleteBudget,
  toggleAddEditModal,
} from "@/store/budget/budgetSlice"
import { CategorySelector } from "./CategorySelector"

interface AddEditBudgetModalProps {
  visible: boolean
  onClose: () => void
}

export const AddEditBudgetModal = ({ visible, onClose }: AddEditBudgetModalProps) => {
  const { themed } = useAppTheme()
  const dispatch = useAppDispatch()
  const { currentEditBudget, currentMonth } = useAppSelector((state) => state.budget)
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Local state
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [isCategorySelectorVisible, setIsCategorySelectorVisible] = useState(false)

  // Snap points
  const snapPoints = useMemo(() => ["50%"], [])

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      // Reset form fields when opening
      if (currentEditBudget) {
        setCategory(currentEditBudget.category)
        setAmount(currentEditBudget.allocated.toString())
      } else {
        setCategory("")
        setAmount("")
      }

      // Need setTimeout to ensure component is mounted
      setTimeout(() => {
        bottomSheetRef.current?.expand()
      }, 100)
    } else {
      bottomSheetRef.current?.close()
    }
  }, [visible, currentEditBudget])

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        dispatch(toggleAddEditModal(false))
      }
    },
    [dispatch],
  )

  // Customize backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  )

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!category || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return // In a real app, you'd show validation errors
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

    dispatch(toggleAddEditModal(false))
  }

  // Handle budget deletion
  const handleDelete = () => {
    if (currentEditBudget) {
      dispatch(deleteBudget(currentEditBudget.id))
      dispatch(toggleAddEditModal(false))
    }
  }

  // Select category
  const handleSelectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory)
    setIsCategorySelectorVisible(false)
  }

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={visible ? 0 : -1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={themed($handleIndicator)}
        backgroundStyle={themed($sheetBackground)}
      >
        <BottomSheetView style={themed($contentContainer)}>
          <View style={themed($modalHeader)}>
            <Text
              text={currentEditBudget ? "Edit Budget" : "Add New Budget"}
              style={themed($modalTitle)}
            />
            <TouchableOpacity
              onPress={() => dispatch(toggleAddEditModal(false))}
              style={themed($closeButton)}
            >
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
                style={[
                  themed($submitButton),
                  { marginLeft: currentEditBudget ? themed($submitButton).marginLeft : 0 },
                ]}
                textStyle={themed($submitButtonText)}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Category Selector Modal */}
      <CategorySelector
        visible={isCategorySelectorVisible}
        onClose={() => setIsCategorySelectorVisible(false)}
        onSelectCategory={handleSelectCategory}
        selectedCategory={category}
      />
    </>
  )
}

// Styles
const $sheetBackground: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})

const $handleIndicator: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral400,
  width: 40,
  height: 5,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
})

const $modalHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.md,
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

const $formContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
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
  marginBottom: spacing.xl,
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
