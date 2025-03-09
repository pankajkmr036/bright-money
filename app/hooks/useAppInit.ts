import { fetchBudgetsByMonth } from "@/store/budget/budgetSlice"
import { fetchDashboardData } from "@/store/dashboard/dashboardSlice"
import { useAppDispatch } from "@/store/store"
import { fetchCategories, fetchTransactions } from "@/store/transactions/transactionsSlice"
import { getCurrentMonth } from "@/utils/formatDate"
import { useEffect } from "react"

export const useAppInit = () => {
  const dispatch = useAppDispatch()
  // Fetch transactions and categories on component mount
  useEffect(() => {
    dispatch(fetchDashboardData())
    dispatch(fetchTransactions())
    dispatch(fetchCategories())
    dispatch(fetchBudgetsByMonth(getCurrentMonth()))
  }, [dispatch])
}
