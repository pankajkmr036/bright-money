// app/components/Dashboard/ExpenseDistributionChart.tsx
import React, { useState } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, Dimensions } from "react-native"
import { PieChart } from "react-native-chart-kit"
import { Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"

// Chart data
const expenseData = [
  {
    name: "banking and finance",
    amount: 23433,
    transactions: 1,
    color: "#7E5894",
    percentage: 76.9,
  },
  { name: "food and drinks", amount: 3143, transactions: 2, color: "#9D73B3", percentage: 10.3 },
  { name: "apps and software", amount: 1968, transactions: 1, color: "#BDA0CF", percentage: 6.5 },
  { name: "medical", amount: 1942.39, transactions: 2, color: "#D7C2E0", percentage: 6.4 },
]

const screenWidth = Dimensions.get("window").width

export const ExpenseDistributionChart = () => {
  const { themed } = useAppTheme()
  const [expanded, setExpanded] = useState(true)

  // Calculate total expense
  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0)
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(totalExpense)

  // Format data for the chart
  const chartData = expenseData.map((item) => ({
    name: item.name,
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

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 0,
    barPercentage: 0.5,
  }

  return (
    <View style={themed($container)}>
      <Text style={themed($title)}>TOP SPENDS CATEGORY</Text>

      <Text style={themed($mainCategory)}>
        {expenseData[0].percentage}% on {expenseData[0].name}
      </Text>

      <Text style={themed($description)}>
        covering all bases! Your card handles those miscellaneous expenses with ease and flexibility
      </Text>

      {/* Centered pie chart */}
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
        {expenseData.slice(0, expanded ? expenseData.length : 2).map((item, index) => (
          <View key={index} style={themed($categoryItem)}>
            <View style={themed($categoryLeftSection)}>
              <View style={[themed($categoryColorBox), { backgroundColor: item.color }]} />
              <View>
                <Text style={themed($categoryName)}>{item.name}</Text>
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

      <TouchableOpacity onPress={toggleExpand} style={themed($viewMoreButton)}>
        <Text style={themed($viewMoreText)}>{expanded ? "View less" : "View more"}</Text>
      </TouchableOpacity>
    </View>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
  backgroundColor: "white",
  borderRadius: 12,
  marginHorizontal: spacing.md,
  marginTop: spacing.lg,
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
  marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: 0.5,
})

const $mainCategory: ThemedStyle<TextStyle> = () => ({
  fontSize: 28,
  fontWeight: "bold",
  marginBottom: 8,
  lineHeight: 28,
})

const $description: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.textDim,
  marginBottom: 20,
  lineHeight: 22,
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

const $viewMoreButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.md,
  marginTop: spacing.sm,
})

const $viewMoreText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.tint,
  fontWeight: "500",
  textDecorationLine: "underline",
})
