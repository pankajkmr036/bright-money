// app/components/Dashboard/ScrollableCards.tsx
import React, { useRef, useState } from "react"
import { View, ViewStyle, FlatList, Animated, Dimensions } from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { BudgetOverviewCard } from "./BudgetOverviewCard"

interface CardData {
  id: string
  title: string
  amount: string
  compareAmount: string
  compareMonth: string
  currentMonth: string
}

export const ScrollableCards = () => {
  const { themed } = useAppTheme()
  const scrollX = useRef(new Animated.Value(0)).current
  const [activeIndex, setActiveIndex] = useState(0)
  const { width } = Dimensions.get("window")

  // Demo card data
  const cardData: CardData[] = [
    {
      id: "1",
      title: "FEB'25",
      amount: "59.76K",
      compareAmount: "40.97K",
      compareMonth: "Jan'25",
      currentMonth: "FEB'25",
    },
    {
      id: "2",
      title: "JAN'25",
      amount: "100.73K",
      compareAmount: "15.32K",
      compareMonth: "Dec'24",
      currentMonth: "JAN'25",
    },
    {
      id: "3",
      title: "DEC'24",
      amount: "85.41K",
      compareAmount: "5.12K",
      compareMonth: "Nov'24",
      currentMonth: "DEC'24",
    },
  ]

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
            <BudgetOverviewCard
              currentMonth={item.currentMonth}
              currentSpend={item.amount}
              compareAmount={item.compareAmount}
              prevMonth={item.compareMonth}
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

// Styles
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
