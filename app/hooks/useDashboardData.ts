// app/hooks/useDashboardData.ts
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { fetchDashboardData } from "@/store/dashboard/dashboardSlice"

export const useDashboardData = () => {
  const dispatch = useAppDispatch()
  const { data, isLoading, error } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    if (!data) {
      dispatch(fetchDashboardData())
    }
  }, [dispatch, data])

  const refreshDashboardData = () => {
    dispatch(fetchDashboardData())
  }

  // Get budgets and transactions from their own slices
  const { budgets } = useAppSelector((state) => state.budget)
  const { transactions } = useAppSelector((state) => state.transactions)

  return {
    dashboardData: data,

    isLoading,
    error,
    refreshDashboardData,

    // Convenience getters for specific data sections
    balance: data?.balance,
    insights: data?.monthlyInsights,
    expenseDistribution: data?.expenseDistribution,
    monthlyExpenses: data?.monthlyExpenses,

    // These come from their respective slices now
    budgetOverview: budgets.slice(0, 4),
    recentTransactions: transactions.slice(0, 5),
  }
}
