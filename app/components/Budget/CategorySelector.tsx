// app/components/Budget/CategorySelector.tsx
import React, { useCallback, useEffect, useRef, useMemo } from "react"
import { View, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { useAppSelector } from "@/store/store"

interface CategorySelectorProps {
  visible: boolean
  onClose: () => void
  onSelectCategory: (category: string) => void
  selectedCategory: string
}

export const CategorySelector = ({
  visible,
  onClose,
  onSelectCategory,
  selectedCategory,
}: CategorySelectorProps) => {
  const { themed } = useAppTheme()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { categories } = useAppSelector((state) => state.transactions)

  // Snap points
  const snapPoints = useMemo(() => ["70%"], [])

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        bottomSheetRef.current?.expand()
      }, 100)
    } else {
      bottomSheetRef.current?.close()
    }
  }, [visible])

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose()
    },
    [onClose],
  )

  // Customize backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  )

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
      <View style={themed($header)}>
        <Text text="Select Category" style={themed($title)} />
        <TouchableOpacity onPress={onClose} style={themed($closeButton)}>
          <Text text="✕" style={themed($closeButtonText)} />
        </TouchableOpacity>
      </View>

      <View style={{ maxHeight: 400 }}>
        <ScrollView>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                themed($categoryItem),
                selectedCategory === category && themed($selectedCategory),
              ]}
              onPress={() => {
                onSelectCategory(category)
                onClose()
              }}
            >
              <Text
                text={category}
                style={[
                  themed($categoryText),
                  selectedCategory === category && themed($selectedCategoryText),
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  flex: 1,
})

const $title: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
  fontWeight: "bold",
})

const $closeButton: ThemedStyle<ViewStyle> = () => ({
  padding: 5,
})

const $closeButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 24,
})

const $categoryItem: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.sm,
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
