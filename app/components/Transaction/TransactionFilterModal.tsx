// app/components/Transaction/TransactionFilterModal.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { View, TouchableOpacity, ScrollView, ViewStyle, TextStyle, BackHandler } from "react-native"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Checkbox, Radio, Text, TextField } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { SortOption, TransactionCategory, TransactionFilter, FilterTab } from "@/types/transaction"
import { FilterTabs } from "./FilterTabs"
import { ActionButton } from "../Buttons"

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
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Local state for filter changes
  const [localFilter, setLocalFilter] = useState<TransactionFilter>(filter)
  const [selectedTab, setSelectedTab] = useState<FilterTab>(activeTab)

  // Snap points
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

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose()
      }
    },
    [onClose],
  )

  // Custom backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  )

  // Render content based on selected tab
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

  // Render sort options using Toggle Radio components
  const renderSortOptions = () => {
    const sortOptions: { value: SortOption; label: string }[] = [
      { value: "new to old", label: "new to old" },
      { value: "old to new", label: "old to new" },
      { value: "high to low", label: "high to low value" },
      { value: "low to high", label: "low to high value" },
    ]

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={themed($scrollContent)}
      >
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={themed($optionRow)}
            onPress={() => updateLocalFilter({ sort: option.value })}
            activeOpacity={0.7}
          >
            <Text text={option.label} style={themed($optionText)} />
            <Radio
              value={localFilter.sort === option.value}
              onValueChange={() => updateLocalFilter({ sort: option.value })}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }

  // Render category options using Toggle Checkbox components
  const renderCategoryOptions = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={themed($scrollContent)}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={themed($optionRow)}
            onPress={() => toggleCategory(category)}
            activeOpacity={0.7}
          >
            <Text text={category} style={[themed($optionText), { textTransform: "capitalize" }]} />
            <Checkbox
              value={localFilter.categories.includes(category)}
              onValueChange={() => toggleCategory(category)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }

  // Render range options using TextField components
  const renderRangeOptions = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={themed($scrollContent)}
      >
        <Text text="amount" style={themed($sectionTitle)} />
        <Text text="move the sliders to choose an amount range" style={themed($rangeDescription)} />

        <View style={themed($rangeContainer)}>
          <View style={themed($rangeInputContainer)}>
            <TextField
              label="MINIMUM"
              value={localFilter.range.min.toString()}
              onChangeText={(text) => {
                const min = text ? parseInt(text) : 0
                updateLocalFilter({
                  range: { ...localFilter.range, min },
                })
              }}
              keyboardType="numeric"
              LeftAccessory={({ style }) => <Text text="₹" style={themed($currencySymbol)} />}
              containerStyle={themed($textFieldContainer)}
            />
          </View>

          <Text text="—" style={themed($rangeDivider)} />

          <View style={themed($rangeInputContainer)}>
            <TextField
              label="MAXIMUM"
              value={localFilter.range.max.toString()}
              onChangeText={(text) => {
                const max = text ? parseInt(text) : 0
                updateLocalFilter({
                  range: { ...localFilter.range, max },
                })
              }}
              keyboardType="numeric"
              LeftAccessory={({ style }) => <Text text="₹" style={themed($currencySymbol)} />}
              containerStyle={themed($textFieldContainer)}
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
      </ScrollView>
    )
  }

  // Render type options using Toggle Radio components
  const renderTypeOptions = () => {
    const typeOptions = ["income", "expense"]

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={themed($scrollContent)}
      >
        {typeOptions.map((type) => (
          <TouchableOpacity
            key={type}
            style={themed($optionRow)}
            onPress={() => updateLocalFilter({ type: type as any })}
            activeOpacity={0.7}
          >
            <Text text={type} style={[themed($optionText), { textTransform: "capitalize" }]} />
            <Radio
              value={localFilter.type === type}
              onValueChange={() => updateLocalFilter({ type: type as any })}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }

  // Render month options using Toggle Checkbox components
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

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={themed($scrollContent)}
      >
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
            <Checkbox
              value={false} // Update this when month selection is implemented
              onValueChange={() => {
                /* Handle month selection */
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }

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
        {/* Fixed Header */}
        <View style={themed($modalHeader)}>
          <Text text="filters" style={themed($modalTitle)} />
          <TouchableOpacity onPress={onClose} style={themed($closeButton)}>
            <Text text="✕" style={themed($closeButtonText)} />
          </TouchableOpacity>
        </View>

        {/* Fixed Filter Tabs */}
        <FilterTabs
          tabs={["NEW TO OLD", "AMOUNT", "TYPE", "MONTH", "CATEGORY"]}
          activeTab={selectedTab}
          onTabPress={handleTabChange}
          variant="modal"
        />

        {/* Scrollable Content Area */}
        <View style={themed($scrollableContent)}>{renderFilterContent()}</View>

        {/* Fixed Action Buttons */}
        <View style={themed($actionButtonsContainer)}>
          <ActionButton text="Clear" variant="outline" onPress={handleClearFilter} />
          <ActionButton text="Apply" variant="primary" onPress={handleApplyFilter} />
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
  fontWeight: "500",
})

const $closeButton: ThemedStyle<ViewStyle> = () => ({
  padding: 4,
})

const $closeButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 24,
})

const $scrollableContent: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  marginVertical: 16,
})

const $scrollContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.md,
})

const $optionRow: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral300,
})

const $optionText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
})

// Range styles
const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 24,
  fontWeight: "normal",
  marginBottom: spacing.md,
  textTransform: "lowercase",
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

const $textFieldContainer: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 0, // Override default margin
})

const $currencySymbol: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  marginRight: 4,
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
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: colors.palette.neutral800,
  position: "absolute",
  top: "50%",
  marginTop: -10,
  marginLeft: -10,
})

// Action buttons container
const $actionButtonsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-around",
  paddingVertical: spacing.sm,
})
