// app/components/TransactionFilterModal.tsx
import React, { useState, useEffect } from "react"
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ViewStyle,
  TextStyle,
  Animated as RNAnimated,
} from "react-native"
import { Text, Button, Switch } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { SortOption, TransactionCategory, TransactionFilter } from "@/models/transaction"
import { FilterTab } from "@/types"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated"

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

  // Animation values
  const modalAnimation = useSharedValue(0)

  // Update animation when modal visibility changes
  useEffect(() => {
    modalAnimation.value = withTiming(visible ? 1 : 0, { duration: 300 })
  }, [visible, modalAnimation])

  // Reset local filter when modal is opened
  useEffect(() => {
    if (visible) {
      setLocalFilter(filter)
    }
  }, [visible, filter])

  // Animated styles for modal container
  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(modalAnimation.value, [0, 1], [300, 0], Extrapolation.CLAMP),
        },
      ],
      opacity: modalAnimation.value,
    }
  })

  // Animated styles for backdrop
  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: modalAnimation.value * 0.5,
    }
  })

  // Update local filter
  const updateLocalFilter = (updates: Partial<TransactionFilter>) => {
    setLocalFilter((prev) => ({ ...prev, ...updates }))
  }

  // Toggle category selection
  const toggleCategory = (category: TransactionCategory) => {
    const updatedCategories = localFilter.categories.includes(category)
      ? localFilter.categories.filter((c) => c !== category)
      : [...localFilter.categories, category]

    updateLocalFilter({ categories: updatedCategories })
  }

  // Apply filter and close modal
  const handleApplyFilter = () => {
    onApplyFilter(localFilter)
    onClose()
  }

  // Render sort options for MOST RECENT tab
  const renderSortOptions = () => {
    const sortOptions: SortOption[] = ["new to old", "old to new", "high to low", "low to high"]

    return (
      <View style={themed($optionsContainer)}>
        <Text text="filter by" style={themed($sectionTitle)} />

        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={themed($optionRow)}
            onPress={() => updateLocalFilter({ sort: option })}
            activeOpacity={0.7}
          >
            <Text text={option} style={themed($optionText)} />
            <View
              style={[
                themed($radioButton),
                localFilter.sort === option && themed($radioButtonSelected),
              ]}
            >
              {localFilter.sort === option && <View style={themed($radioButtonInner)} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  // Render category options for CATEGORY tab
  const renderCategoryOptions = () => {
    return (
      <View style={themed($optionsContainer)}>
        <Text text="filter by" style={themed($sectionTitle)} />

        <ScrollView style={themed($scrollView)} showsVerticalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={themed($optionRow)}
              onPress={() => toggleCategory(category)}
              activeOpacity={0.7}
            >
              <Text text={category} style={themed($optionText)} />
              <View
                style={[
                  themed($checkbox),
                  localFilter.categories.includes(category) && themed($checkboxSelected),
                ]}
              >
                {localFilter.categories.includes(category) && (
                  <Text text="✓" style={themed($checkmark)} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

  // Render range options for RANGE tab
  const renderRangeOptions = () => {
    return (
      <View style={themed($optionsContainer)}>
        <Text text="filter by" style={themed($sectionTitle)} />

        <View style={themed($rangeContainer)}>
          <View style={themed($rangeInputContainer)}>
            <Text text="MINIMUM" style={themed($rangeLabel)} />
            <TextInput
              style={themed($rangeInput)}
              value={localFilter.range.min.toString()}
              onChangeText={(text) => {
                const min = text ? parseInt(text) : 0
                updateLocalFilter({
                  range: { ...localFilter.range, min },
                })
              }}
              keyboardType="number-pad"
            />
          </View>

          <Text text="—" style={themed($rangeDivider)} />

          <View style={themed($rangeInputContainer)}>
            <Text text="MAXIMUM" style={themed($rangeLabel)} />
            <TextInput
              style={themed($rangeInput)}
              value={localFilter.range.max.toString()}
              onChangeText={(text) => {
                const max = text ? parseInt(text) : 0
                updateLocalFilter({
                  range: { ...localFilter.range, max },
                })
              }}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* Simple range slider visualization */}
        <View style={themed($sliderContainer)}>
          <View style={themed($sliderTrack)} />
          <View
            style={[
              themed($sliderFill),
              {
                left: `${(localFilter.range.min / 500000) * 100}%`,
                right: `${100 - (localFilter.range.max / 500000) * 100}%`,
              },
            ]}
          />
          <View
            style={[themed($sliderThumb), { left: `${(localFilter.range.min / 500000) * 100}%` }]}
          />
          <View
            style={[themed($sliderThumb), { left: `${(localFilter.range.max / 500000) * 100}%` }]}
          />
        </View>
      </View>
    )
  }

  if (!visible) return null

  return (
    <Modal visible={visible} animationType="none" transparent={true} onRequestClose={onClose}>
      <View style={themed($modalContainer)}>
        <Animated.View
          style={[themed($backdrop), animatedBackdropStyle]}
          pointerEvents="box-none"
        />

        <TouchableOpacity style={themed($touchableArea)} activeOpacity={1} onPress={onClose}>
          <Animated.View
            style={[themed($modalContent), animatedModalStyle]}
            pointerEvents="box-none"
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={{ flex: 1 }}
            >
              {/* Render different content based on active tab */}
              {activeTab === "MOST RECENT" && renderSortOptions()}
              {activeTab === "CATEGORY" && renderCategoryOptions()}
              {activeTab === "RANGE" && renderRangeOptions()}

              {/* Apply filter button */}
              <Button
                text="Apply filter"
                onPress={handleApplyFilter}
                style={themed($applyButton)}
                textStyle={themed($applyButtonText)}
              />
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

// Styles
const $modalContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "flex-end",
})

const $backdrop: ThemedStyle<ViewStyle> = () => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "#000000",
})

const $touchableArea: ViewStyle = {
  flex: 1,
  justifyContent: "flex-end",
}

const $modalContent: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 24,
  minHeight: "60%",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 10,
})

const $optionsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 28,
  fontWeight: "bold",
  marginBottom: spacing.xl,
})

const $optionRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.md,
})

const $optionText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
})

const $radioButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 24,
  height: 24,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: colors.palette.neutral400,
  justifyContent: "center",
  alignItems: "center",
})

const $radioButtonSelected: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.tint,
})

const $radioButtonInner: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: colors.tint,
})

const $checkbox: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 24,
  height: 24,
  borderWidth: 2,
  borderColor: colors.palette.neutral400,
  borderRadius: 4,
  justifyContent: "center",
  alignItems: "center",
})

const $checkboxSelected: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.tint,
  borderColor: colors.tint,
})

const $checkmark: ThemedStyle<TextStyle> = () => ({
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "bold",
})

const $scrollView: ThemedStyle<ViewStyle> = () => ({
  maxHeight: 300,
})

const $rangeContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: spacing.md,
  marginBottom: spacing.lg,
})

const $rangeInputContainer: ThemedStyle<ViewStyle> = () => ({
  width: "45%",
})

const $rangeLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
  marginBottom: 8,
})

const $rangeInput: ThemedStyle<TextStyle> = ({ colors }) => ({
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
})

const $rangeDivider: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
})

const $sliderContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: 40,
  marginTop: spacing.md,
  marginBottom: spacing.lg,
  position: "relative",
  justifyContent: "center",
})

const $sliderTrack: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 4,
  backgroundColor: colors.palette.neutral300,
  borderRadius: 2,
  position: "absolute",
  left: 0,
  right: 0,
})

const $sliderFill: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 4,
  backgroundColor: colors.tint,
  borderRadius: 2,
  position: "absolute",
})

const $sliderThumb: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: colors.tint,
  position: "absolute",
  top: "50%",
  marginTop: -12,
  marginLeft: -12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 2,
})

const $applyButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral600,
  borderRadius: 8,
  paddingVertical: spacing.md,
  marginTop: "auto",
})

const $applyButtonText: ThemedStyle<TextStyle> = () => ({
  color: "#FFFFFF",
  textAlign: "center",
  fontSize: 16,
  fontWeight: "600",
})

const StyleSheet = RNAnimated.createAnimatedComponent
