import React, { useCallback, useEffect, useRef, ReactNode } from "react"
import { View, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text, Icon } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

interface GenericBottomSheetModalProps {
  visible: boolean
  onClose: () => void
  title: string
  children: ReactNode
  snapPoints?: string[] // Default will be provided
  headerRight?: ReactNode
}

export const GenericBottomSheetModal = ({
  visible,
  onClose,
  title,
  children,
  snapPoints = ["70%"],
  headerRight,
}: GenericBottomSheetModalProps) => {
  const { themed } = useAppTheme()
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand()
    } else {
      bottomSheetRef.current?.close()
    }
  }, [visible])

  // Handle sheet changes
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
          <Text text={title} style={themed($modalTitle)} />
          {headerRight}
          <TouchableOpacity onPress={onClose} style={themed($closeButton)}>
            <Icon icon="x" size={24} />
          </TouchableOpacity>
        </View>

        {children}
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
