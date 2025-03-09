// Updated ScrollableCards.tsx
import React, { useRef, useState } from "react"
import { View, ViewStyle, TextStyle, FlatList, Animated, Dimensions } from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { ExpenseInsights } from "./ExpenseInsights"
import { useAppSelector } from "@/store/store"
import { Text } from "@/components"

const { width } = Dimensions.get("window")

export const ScrollableCards = () => {
  const { themed } = useAppTheme()
  const scrollX = useRef(new Animated.Value(0)).current
  const [activeIndex, setActiveIndex] = useState(0)

  // Get data and loading state from Redux
  const { data } = useAppSelector((state) => state.dashboard)
  const cardData = data?.monthlyInsights || []

  // Show empty state when no insights are available
  if (!cardData.length) {
    return <></>
  }

  // Rest of the component remains the same
  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
    useNativeDriver: false,
    listener: (event: any) => {
      const offsetX = event.nativeEvent.contentOffset.x
      const index = Math.round(offsetX / width)
      setActiveIndex(index)
    },
  })

  return (
    <View>
      <FlatList
        data={cardData}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        snapToInterval={width - 40} // Account for padding
        decelerationRate="fast"
        contentContainerStyle={themed($listContainer)}
        renderItem={({ item }) => (
          <View style={{ width: width - 40 }}>
            <ExpenseInsights
              currentMonth={item.currentMonth}
              currentSpend={item.currentSpend}
              compareAmount={item.comparisonAmount}
              prevMonth={item.previousMonth}
            />
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={themed($paginationContainer)}>
        {cardData.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          })

          return (
            <Animated.View
              key={index}
              style={[
                themed($paginationDot),
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor:
                    index === activeIndex
                      ? themed($activeDot).backgroundColor
                      : themed($inactiveDot).backgroundColor,
                },
              ]}
            />
          )
        })}
      </View>
    </View>
  )
}

const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xl,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  borderRadius: 20,
  marginHorizontal: spacing.lg,
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.textDim,
  textAlign: "center",
})
const $listContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
})

const $paginationContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginVertical: spacing.lg,
})

const $paginationDot: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: 8,
  width: 8,
  borderRadius: 4,
  marginHorizontal: spacing.xxs,
})

const $activeDot: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral800,
})

const $inactiveDot: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral500,
})
