// app/components/Transaction/AppliedFilters.tsx
import React from "react"
import { View, TouchableOpacity, ScrollView, ViewStyle, TextStyle } from "react-native"
import { Text, Icon } from "@/components"
import { TransactionFilter, FilterTab } from "@/types/transaction"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface AppliedFiltersProps {
  filter: TransactionFilter
  activeFilters: string[]
  onClearFilters: () => void
  onTabPress: (tab: FilterTab) => void
}

export const AppliedFilters = ({
  filter,
  activeFilters,
  onClearFilters,
  onTabPress,
}: AppliedFiltersProps) => {
  const { themed } = useAppTheme()

  // Don't render if there are no active filters
  if (activeFilters.length === 0) return null

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={themed($container)}
    >
      {/* Clear Filters Button */}
      {activeFilters.length > 0 && (
        <TouchableOpacity style={themed($clearFiltersButton)} onPress={onClearFilters}>
          <Icon icon="x" size={16} containerStyle={themed($clearIcon)} />
          <Text text="CLEAR FILTERS" style={themed($clearText)} />
          <View style={themed($countBadge)}>
            <Text text={activeFilters.length.toString()} style={themed($countText)} />
          </View>
        </TouchableOpacity>
      )}

      {/* Filter Pills */}
      {filter.sort !== "new to old" && (
        <TouchableOpacity style={themed($filterPill)} onPress={() => onTabPress("NEW TO OLD")}>
          <Text text={filter.sort.toUpperCase()} style={themed($filterPillText)} />
        </TouchableOpacity>
      )}

      {filter.type && (
        <TouchableOpacity style={themed($filterPill)} onPress={() => onTabPress("TYPE")}>
          <Text text={filter.type.toUpperCase()} style={themed($filterPillText)} />
        </TouchableOpacity>
      )}

      {filter.categories.length > 0 && (
        <TouchableOpacity style={themed($filterPill)} onPress={() => onTabPress("CATEGORY")}>
          <Text
            text={
              filter.categories.length === 1
                ? filter.categories[0].toUpperCase()
                : `${filter.categories.length} CATEGORIES`
            }
            style={themed($filterPillText)}
          />
        </TouchableOpacity>
      )}

      {(filter.range.min > 0 || filter.range.max < 500000) && (
        <TouchableOpacity style={themed($filterPill)} onPress={() => onTabPress("AMOUNT")}>
          <Text
            text={`₹${filter.range.min} - ₹${filter.range.max}`}
            style={themed($filterPillText)}
          />
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xs,
})

const $clearFiltersButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral100,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  marginRight: spacing.sm,
})

const $clearIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.xxs,
})

const $clearText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.text,
  fontWeight: "500",
})

const $countBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral800,
  borderRadius: 10,
  width: 20,
  height: 20,
  justifyContent: "center",
  alignItems: "center",
  marginLeft: spacing.xs,
})

const $countText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.palette.neutral100,
  fontWeight: "bold",
})

const $filterPill: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  marginRight: spacing.sm,
})

const $filterPillText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.text,
})
