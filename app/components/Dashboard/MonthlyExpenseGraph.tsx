// app/components/Dashboard/MonthlyExpenseGraph.tsx
import React, { useMemo } from "react"
import { View, ViewStyle, TextStyle, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { CardHeader, ContentCard } from "../AdvancedCard"

// Mock data for monthly expenses (in a real app, this would come from the store)
const MONTHLY_DATA = [
  { month: "Sep", amount: 32000 },
  { month: "Oct", amount: 38500 },
  { month: "Nov", amount: 26700 },
  { month: "Dec", amount: 85410 },
  { month: "Jan", amount: 100730 },
  { month: "Feb", amount: 59760 },
]

const screenWidth = Dimensions.get("window").width

export const MonthlyExpenseGraph = () => {
  const { themed } = useAppTheme()

  // Prepare data for the chart
  const chartData = useMemo(() => {
    return {
      labels: MONTHLY_DATA.map((item) => item.month),
      datasets: [
        {
          data: MONTHLY_DATA.map((item) => item.amount / 1000), // Convert to thousands for display
          color: (opacity = 1) => `rgba(126, 88, 148, ${opacity})`, // Purple color matching our theme
          strokeWidth: 2,
        },
      ],
    }
  }, [])

  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(126, 88, 148, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#7E5894",
    },
    formatYLabel: (value: any) => `${value}K`,
  }

  return (
    <ContentCard>
      <CardHeader title="Monthly Expenses" subtitle="Last 6 Months" />

      <LineChart
        data={chartData}
        width={screenWidth - 80}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={themed($chart)}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        yAxisSuffix="K"
        yAxisInterval={1}
      />

      <View style={themed($legendContainer)}>
        <View style={themed($legendItem)}>
          <View style={[themed($legendDot), { backgroundColor: "#7E5894" }]} />
          <Text text="Monthly spending (K)" style={themed($legendText)} />
        </View>
      </View>
    </ContentCard>
  )
}

// Styles
const $chart: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.md,
  borderRadius: 16,
})

const $legendContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "center",
  marginTop: spacing.sm,
})

const $legendItem: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $legendDot: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 10,
  height: 10,
  borderRadius: 5,
  marginRight: spacing.xs,
})

const $legendText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontSize: 14,
})
