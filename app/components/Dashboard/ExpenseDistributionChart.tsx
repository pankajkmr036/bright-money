import React, { useState } from "react"
import { View, ViewStyle, TextStyle, Dimensions, ActivityIndicator } from "react-native"
import { PieChart } from "react-native-chart-kit"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { CardHeader, ContentCard } from "../AdvancedCard"
import { LinkButton } from "../Buttons"
import { useAppSelector } from "@/store/store"

const screenWidth = Dimensions.get("window").width

export const ExpenseDistributionChart = () => {
  const { themed } = useAppTheme()
  const [expanded, setExpanded] = useState(false)

  // Get data and loading state from Redux
  const { data, isLoading } = useAppSelector((state) => state.dashboard)
  const expenseDistribution = data?.expenseDistribution || []

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 0,
    barPercentage: 0.5,
  }

  // Calculate total expense
  const totalExpense = expenseDistribution.reduce((sum, item) => sum + item.amount, 0)
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(totalExpense)

  // Format data for the chart
  const chartData = expenseDistribution.map((item) => ({
    category: item.category,
    population: item.amount,
    color: item.color,
    legendFontColor: "#7F7F7F",
    legendFontSize: 0, // Setting to 0 to hide the legend
  }))

  // Format amount with commas and decimal points
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    })
      .format(amount)
      .replace("₹", "₹")
  }

  return (
    <ContentCard>
      <CardHeader title="Top Spends Category" />

      {isLoading ? (
        <View style={themed($loaderContainer)}>
          <ActivityIndicator size="large" color={themed($loaderColor).color} />
        </View>
      ) : !expenseDistribution.length ? (
        <View style={themed($emptyContainer)}>
          <Text text="No expense data available" style={themed($emptyText)} />
        </View>
      ) : (
        <>
          {expenseDistribution?.[0] && (
            <Text style={themed($mainCategory)}>
              {expenseDistribution[0].percentage}% on {expenseDistribution[0].category}
            </Text>
          )}

          {/* Pie chart */}
          <View style={themed($chartContainer)}>
            <PieChart
              data={chartData}
              width={screenWidth}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="100"
              absolute={false}
              hasLegend={false}
            />
          </View>

          {/* Total amount below chart */}
          <View style={themed($totalContainer)}>
            <Text style={themed($totalLabel)}>Total</Text>
            <Text style={themed($totalAmount)}>₹{formattedTotal}</Text>
          </View>

          {/* Category list */}
          <View style={themed($categoryList)}>
            {expenseDistribution
              .slice(0, expanded ? expenseDistribution.length : 2)
              .map((item, index) => (
                <View key={index} style={themed($categoryItem)}>
                  <View style={themed($categoryLeftSection)}>
                    <View style={[themed($categoryColorBox), { backgroundColor: item.color }]} />
                    <View>
                      <Text style={themed($categoryName)}>{item.category}</Text>
                      <Text style={themed($transactionCount)}>
                        {item.transactions} transaction{item.transactions > 1 ? "s" : ""}
                      </Text>
                    </View>
                  </View>

                  <View style={themed($categoryRightSection)}>
                    <Text style={themed($categoryAmount)}>{formatAmount(item.amount)}</Text>
                    <Text style={themed($categoryPercentage)}>{item.percentage}%</Text>
                  </View>
                </View>
              ))}
          </View>

          <LinkButton text={expanded ? "View less" : "View more"} onPress={toggleExpand} />
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
  minHeight: 200,
})

const $loaderColor: ThemedStyle<{ color: string }> = ({ colors }) => ({
  color: colors.tint,
})

const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xl,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 200,
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.textDim,
  textAlign: "center",
})

const $mainCategory: ThemedStyle<TextStyle> = () => ({
  fontSize: 28,
  fontWeight: "bold",
  marginBottom: 8,
  lineHeight: 28,
})

const $chartContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  justifyContent: "center",
})

const $totalContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.md,
})

const $totalLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $totalAmount: ThemedStyle<TextStyle> = () => ({
  fontSize: 24,
  fontWeight: "bold",
})

const $categoryList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $categoryItem: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral300,
})

const $categoryLeftSection: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $categoryColorBox: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 16,
  height: 16,
  marginRight: spacing.sm,
  borderRadius: 4,
})

const $categoryName: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "500",
})

const $transactionCount: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $categoryRightSection: ThemedStyle<ViewStyle> = () => ({
  alignItems: "flex-end",
})

const $categoryAmount: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "500",
})

const $categoryPercentage: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})
