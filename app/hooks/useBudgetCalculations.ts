// app/hooks/useBudgetCalculations.ts

export const useBudgetCalculations = () => {
  // Calculate budget usage percentage
  const calculatePercentage = (allocated: number, spent: number) => {
    return Math.min((spent / allocated) * 100, 100) // Cap at 100% for display
  }

  // Status color based on percentage
  const getStatusColor = (allocated: number, spent: number) => {
    const percentUsed = (spent / allocated) * 100
    if (percentUsed > 100) return "red" // Red for over budget
    if (percentUsed > 85) return "#FFC107" // Yellow for approaching limit
    return "#00C928" // Green for good standing
  }

  // Format currency with comma separators
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get status text based on percentage
  const getStatusText = (allocated: number, spent: number) => {
    const percentUsed = (spent / allocated) * 100
    if (percentUsed > 100) return "Over budget"
    if (percentUsed > 85) return "Approaching limit"
    return "On track"
  }

  return {
    calculatePercentage,
    getStatusColor,
    formatCurrency,
    getStatusText,
  }
}
