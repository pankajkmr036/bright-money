// app/components/Transaction/FilterTabs.tsx
import React from "react"
import { ScrollView, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { FilterTab } from "@/types/transaction"

interface FilterTabsProps {
  tabs: FilterTab[]
  activeTab: FilterTab
  onTabPress: (tab: FilterTab) => void
  variant?: "default" | "modal" // Added variant to support different styles
}

export const FilterTabs = ({
  tabs,
  activeTab,
  onTabPress,
  variant = "default",
}: FilterTabsProps) => {
  const { themed } = useAppTheme()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[themed($container), variant === "modal" && themed($modalContainer)]}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            themed($tab),
            activeTab === tab && themed($activeTab),
            variant === "modal" && themed($modalTab),
            activeTab === tab && variant === "modal" && themed($activeModalTab),
          ]}
          onPress={() => onTabPress(tab)}
        >
          <Text
            text={tab}
            size="xs"
            style={[
              themed($tabText),
              activeTab === tab && themed($activeTabText),
              variant === "modal" && themed($modalTabText),
              activeTab === tab && variant === "modal" && themed($activeModalTabText),
            ]}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  paddingHorizontal: spacing.lg,
  marginVertical: spacing.sm,
  alignItems: "center",
  gap: spacing.sm, // Space between tabs
})

const $modalContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: 0,
  marginVertical: spacing.sm,
  gap: spacing.xs, // Smaller gap for modal
})

const $tab: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  alignItems: "center",
  justifyContent: "center",
})

const $modalTab: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  alignItems: "center",
  justifyContent: "center",
})

const $activeTab: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.palette.neutral800,
  backgroundColor: colors.palette.neutral100,
})

const $activeModalTab: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.palette.neutral800,
  backgroundColor: colors.palette.neutral200,
})

const $tabText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $modalTabText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontSize: 14,
})

const $activeTabText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "600",
})

const $activeModalTabText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "600",
})
