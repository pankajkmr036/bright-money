// app/components/Transaction/TransactionFilterModal.tsx
import React, { useState, useEffect } from "react"
import { View, Modal, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { TransactionCategory, TransactionFilter, FilterTab } from "@/types/transaction"

interface TransactionFilterModalProps {
  visible: boolean
  activeTab: FilterTab
  filter: TransactionFilter
  categories: TransactionCategory[]
  onClose: () => void
  onApplyFilter: (filter: TransactionFilter) => void
}

export const TransactionFilterModal = ({
  visible,
  activeTab,
  filter,
  categories,
  onClose,
  onApplyFilter,
}: TransactionFilterModalProps) => {
  const { themed } = useAppTheme()

  // Local state for filter changes
  const [localFilter, setLocalFilter] = useState<TransactionFilter>(filter)

  // Reset local filter when modal is opened
  useEffect(() => {
    if (visible) {
      setLocalFilter(filter)
    }
  }, [visible, filter])

  // Update local filter
  const updateLocalFilter = (updates: Partial<TransactionFilter>) => {
    setLocalFilter((prev) => ({ ...prev, ...updates }))
  }

  // Apply filter and close modal
  const handleApplyFilter = () => {
    onApplyFilter(localFilter)
    onClose()
  }

  // Clear filters
  const handleClearFilter = () => {
    // Reset to initial filter state
    const initialFilter: TransactionFilter = {
      sort: "new to old",
      categories: [],
      range: {
        min: 0,
        max: 500000,
      },
    }
    onApplyFilter(initialFilter)
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={themed($modalContainer)}>
        <View style={themed($modalContent)}>
          <View style={themed($modalHeader)}>
            <Text text="filters" preset="heading" style={themed($modalTitle)} />
            <TouchableOpacity onPress={onClose} style={themed($closeButton)}>
              <Text text="×" style={themed($closeButtonText)} />
            </TouchableOpacity>
          </View>

          {/* Content will vary based on activeTab */}
          {/* This is just a placeholder structure */}
          <View style={themed($modalBody)}>{/* Different content based on activeTab */}</View>

          <View style={themed($buttonContainer)}>
            <TouchableOpacity onPress={handleClearFilter} style={themed($clearButton)}>
              <Text text="Clear" style={themed($clearButtonText)} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleApplyFilter} style={themed($applyButton)}>
              <Text text="Apply" style={themed($applyButtonText)} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// Styles
const $modalContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "flex-end",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
})

const $modalContent: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: 24,
  paddingVertical: 20,
  minHeight: "60%",
})

const $modalHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
})

const $modalTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 28,
})

const $closeButton: ThemedStyle<ViewStyle> = () => ({
  padding: 8,
})

const $closeButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 30,
  lineHeight: 30,
})

const $modalBody: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: spacing.xl,
})

const $clearButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  padding: spacing.md,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: colors.palette.neutral400,
  marginRight: spacing.sm,
  alignItems: "center",
})

const $clearButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
})

const $applyButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  padding: spacing.md,
  borderRadius: 4,
  backgroundColor: colors.palette.neutral800,
  marginLeft: spacing.sm,
  alignItems: "center",
})

const $applyButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  fontWeight: "600",
  color: colors.palette.neutral100,
})
