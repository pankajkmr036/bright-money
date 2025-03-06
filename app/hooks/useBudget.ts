// app/hooks/useBudget.ts
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/store"
import {
  fetchBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  setBudgetPeriod,
  setBudgetMonth,
  setBudgetYear,
} from "@/store/budget/budgetSlice"
import type { Budget } from "@/types"

export const useBudget = () => {
  const dispatch = useAppDispatch()
  const { budgets, selectedPeriod, selectedMonth, selectedYear, isLoading, error } = useAppSelector(
    (state) => state.budget,
  )

  useEffect(() => {
    dispatch(fetchBudgets())
  }, [dispatch, selectedPeriod, selectedMonth, selectedYear])

  const createBudget = (budget: Omit<Budget, "id">) => {
    return dispatch(addBudget(budget)).unwrap()
  }

  const modifyBudget = (id: string, updates: Partial<Omit<Budget, "id">>) => {
    return dispatch(updateBudget({ id, updates })).unwrap()
  }

  const removeBudget = (id: string) => {
    return dispatch(deleteBudget(id)).unwrap()
  }

  const changePeriod = (period: "monthly" | "yearly") => {
    dispatch(setBudgetPeriod(period))
  }

  const changeMonth = (month: number) => {
    dispatch(setBudgetMonth(month))
  }

  const changeYear = (year: number) => {
    dispatch(setBudgetYear(year))
  }

  return {
    budgets,
    selectedPeriod,
    selectedMonth,
    selectedYear,
    isLoading,
    error,
    createBudget,
    modifyBudget,
    removeBudget,
    changePeriod,
    changeMonth,
    changeYear,
  }
}
