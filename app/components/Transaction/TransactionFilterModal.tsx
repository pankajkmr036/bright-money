// app/components/Transaction/TransactionFilterModal.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ViewStyle,
  TextStyle,
  BackHandler,
} from "react-native"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text, Icon } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { SortOption, TransactionCategory, TransactionFilter, FilterTab } from "@/types/transaction"
import { FilterTabs } from "./FilterTabs"

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
  const insets = useSafeAreaInsets()

  // Local state for filter changes
  const [localFilter, setLocalFilter] = useState<TransactionFilter>(filter)
  const [selectedTab, setSelectedTab] = useState<FilterTab>(activeTab)

  // Bottom sheet reference
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Snap points for bottom sheet (percentage of screen height)
  const snapPoints = useMemo(() => ["70%"], [])

  // Reset local filter when modal is opened and handle visibility
  useEffect(() => {
    if (visible) {
      setLocalFilter(filter)
      setSelectedTab(activeTab)
      bottomSheetRef.current?.expand()
    } else {
      bottomSheetRef.current?.close()
    }
  }, [visible, filter, activeTab])

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose()
        return true
      }
      return false
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
    return () => backHandler.remove()
  }, [visible, onClose])

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
    setLocalFilter(initialFilter)
  }

  // Handle tab change
  const handleTabChange = (tab: FilterTab) => {
    setSelectedTab(tab)
  }

  // Called when bottom sheet is closed
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose()
      }
    },
    [onClose],
  )

  // Custom backdrop component
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  )

  // Render sort options for MOST RECENT tab
  const renderSortOptions = () => {
    const sortOptions: { value: SortOption; label: string }[] = [
      { value: "new to old", label: "new to old" },
      { value: "old to new", label: "old to new" },
      { value: "high to low", label: "high to low value" },
      { value: "low to high", label: "low to high value" },
    ]

    return (
      <View style={themed($optionsContainer)}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={themed($optionRow)}
            onPress={() => updateLocalFilter({ sort: option.value })}
            activeOpacity={0.7}
          >
            <Text text={option.label} style={themed($optionText)} />
            <View
              style={[
                themed($radioButton),
                localFilter.sort === option.value && themed($radioButtonSelected),
              ]}
            >
              {localFilter.sort === option.value && <View style={themed($radioButtonInner)} />}
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

  // Render range options for RANGE and AMOUNT tab
  const renderRangeOptions = () => {
    return (
      <View style={themed($optionsContainer)}>
        <Text text="amount" style={themed($sectionTitle)} />
        <Text text="move the sliders to choose an amount range" style={themed($rangeDescription)} />

        <View style={themed($rangeContainer)}>
          <View style={themed($rangeInputContainer)}>
            <Text text="MINIMUM" style={themed($rangeLabel)} />
            <View style={themed($currencyInput)}>
              <Text text="₹" style={themed($currencySymbol)} />
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
          </View>

          <Text text="—" style={themed($rangeDivider)} />

          <View style={themed($rangeInputContainer)}>
            <Text text="MAXIMUM" style={themed($rangeLabel)} />
            <View style={themed($currencyInput)}>
              <Text text="₹" style={themed($currencySymbol)} />
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

  // Render type options for TYPE tab
  const renderTypeOptions = () => {
    const typeOptions = ["income", "expense"]

    return (
      <View style={themed($optionsContainer)}>
        <ScrollView style={themed($scrollView)} showsVerticalScrollIndicator={false}>
          {typeOptions.map((type) => (
            <TouchableOpacity
              key={type}
              style={themed($optionRow)}
              onPress={() => updateLocalFilter({ type: type as any })}
              activeOpacity={0.7}
            >
              <Text text={type} style={themed($optionText)} />
              <View
                style={[
                  themed($radioButton),
                  localFilter.type === type && themed($radioButtonSelected),
                ]}
              >
                {localFilter.type === type && <View style={themed($radioButtonInner)} />}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

  // Render month options
  const renderMonthOptions = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    // TODO: Implement month selection logic as needed
    return (
      <View style={themed($optionsContainer)}>
        <ScrollView style={themed($scrollView)} showsVerticalScrollIndicator={false}>
          {months.map((month) => (
            <TouchableOpacity
              key={month}
              style={themed($optionRow)}
              onPress={() => {
                /* Handle month selection */
              }}
              activeOpacity={0.7}
            >
              <Text text={month} style={themed($optionText)} />
              <View style={themed($checkbox)}>{/* Add selected state when implemented */}</View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

  // Render different content based on activeTab
  const renderFilterContent = () => {
    switch (selectedTab) {
      case "NEW TO OLD":
        return renderSortOptions()
      case "CATEGORY":
        return renderCategoryOptions()
      case "AMOUNT":
        return renderRangeOptions()
      case "TYPE":
        return renderTypeOptions()
      case "MONTH":
        return renderMonthOptions()
      default:
        return null
    }
  }

  // Don't render the bottom sheet if not needed
  if (!visible && !bottomSheetRef.current) return null

  return (
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
      <BottomSheetView style={[themed($contentContainer), { paddingBottom: insets.bottom }]}>
        <View style={themed($modalHeader)}>
          <Text text="filters" style={themed($modalTitle)} />
          <TouchableOpacity onPress={onClose} style={themed($closeButton)}>
            <Icon icon="x" size={24} />
          </TouchableOpacity>
        </View>

        {/* Filter tabs */}
        <FilterTabs
          tabs={["NEW TO OLD", "AMOUNT", "TYPE", "MONTH", "CATEGORY"]}
          activeTab={selectedTab}
          onTabPress={handleTabChange}
          variant="modal"
        />

        <View style={themed($filterContentContainer)}>{renderFilterContent()}</View>

        <View style={themed($buttonContainer)}>
          <TouchableOpacity onPress={handleClearFilter} style={themed($clearButton)}>
            <Text text="Clear" style={themed($clearButtonText)} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleApplyFilter} style={themed($applyButton)}>
            <Text text="Apply" style={themed($applyButtonText)} />
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
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
  fontSize: 24,
  fontWeight: "bold",
})

const $closeButton: ThemedStyle<ViewStyle> = () => ({
  padding: 8,
})

const $filterContentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  paddingVertical: 20,
})

const $optionsContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 24,
  fontWeight: "normal",
  marginBottom: spacing.lg,
  textTransform: "lowercase",
})

const $optionRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.md,
})

const $optionText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "normal",
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
  borderColor: colors.palette.neutral800,
})

const $radioButtonInner: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: colors.palette.neutral800,
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
  backgroundColor: colors.palette.neutral800,
  borderColor: colors.palette.neutral800,
})

const $checkmark: ThemedStyle<TextStyle> = () => ({
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "bold",
})

const $scrollView: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 0,
})

const $rangeDescription: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontSize: 16,
  marginBottom: 20,
})

const $rangeContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: spacing.md,
  marginBottom: spacing.xl,
})

const $rangeInputContainer: ThemedStyle<ViewStyle> = () => ({
  width: "45%",
})

const $rangeLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
  marginBottom: 8,
})

const $currencyInput: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 4,
  paddingHorizontal: 10,
})

const $currencySymbol: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  marginRight: 4,
})

const $rangeInput: ThemedStyle<TextStyle> = () => ({
  flex: 1,
  padding: 10,
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
  backgroundColor: colors.palette.neutral800,
  borderRadius: 2,
  position: "absolute",
})

const $sliderThumb: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: colors.palette.neutral800,
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

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginVertical: spacing.md,
})

const $clearButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  height: 56,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: colors.border,
  justifyContent: "center",
  alignItems: "center",
  marginRight: spacing.sm,
})

const $clearButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
})

const $applyButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  height: 56,
  borderRadius: 4,
  backgroundColor: colors.palette.neutral800,
  justifyContent: "center",
  alignItems: "center",
  marginLeft: spacing.sm,
})

const $applyButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  fontWeight: "600",
  color: colors.palette.neutral100,
})
