import React, { useMemo } from "react"
import { View, ViewStyle, TextStyle, Dimensions, ActivityIndicator } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { CardHeader, ContentCard } from "../AdvancedCard"
import { useAppSelector } from "@/store/store"

const screenWidth = Dimensions.get("window").width

export const MonthlyExpenseGraph = () => {
  const { themed } = useAppTheme()

  // Get data and loading state from Redux
  const { data, isLoading } = useAppSelector((state) => state.dashboard)
  const monthlyExpenses = data?.monthlyExpenses || []

  // Prepare data for the chart
  const chartData = useMemo(() => {
    return {
      labels: monthlyExpenses.map((item) => item.month),
      datasets: [
        {
          data: monthlyExpenses.map((item) => item.amount / 1000), // Convert to thousands for display
          color: (opacity = 1) => `rgba(126, 88, 148, ${opacity})`, // Purple color matching our theme
          strokeWidth: 2,
        },
      ],
    }
  }, [monthlyExpenses])

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

      {isLoading ? (
        <View style={themed($loaderContainer)}>
          <ActivityIndicator size="large" color={themed($loaderColor).color} />
        </View>
      ) : !monthlyExpenses.length ? (
        <View style={themed($emptyContainer)}>
          <Text text="No monthly expense data available" style={themed($emptyText)} />
        </View>
      ) : (
        <>
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
        </>
      )}
    </ContentCard>
  )
}

// New styles
const $loaderContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xl,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 220,
})

const $loaderColor: ThemedStyle<{ color: string }> = ({ colors }) => ({
  color: colors.tint,
})

const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xl,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 220,
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.textDim,
  textAlign: "center",
})

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
