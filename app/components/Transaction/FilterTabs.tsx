// app/components/Transaction/FilterTabs.tsx
import React from "react"
import { View, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { FilterTab } from "@/types/transaction"

interface FilterTabsProps {
  activeTab: FilterTab
  onTabPress: (tab: FilterTab) => void
}

export const FilterTabs = ({ activeTab, onTabPress }: FilterTabsProps) => {
  const { themed } = useAppTheme()

  const tabs: FilterTab[] = ["MOST RECENT", "CATEGORY", "RANGE"]

  return (
    <View style={themed($container)}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[themed($tab), activeTab === tab && themed($activeTab)]}
          onPress={() => onTabPress(tab)}
        >
          <Text
            text={tab}
            size="xs"
            style={[themed($tabText), activeTab === tab && themed($activeTabText)]}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  paddingHorizontal: spacing.lg,
  marginVertical: spacing.sm,
})

const $tab: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  marginRight: spacing.sm,
})

const $activeTab: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.palette.neutral800,
  backgroundColor: colors.palette.neutral100,
})

const $tabText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $activeTabText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "600",
})
