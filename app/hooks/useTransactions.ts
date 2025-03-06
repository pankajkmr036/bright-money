// app/hooks/useTransactions.ts
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/store"
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setPage,
  setPageSize,
  setFilters,
} from "@/store/transactions/transactionsSlice"
import type { Transaction } from "@/types"

export const useTransactions = () => {
  const dispatch = useAppDispatch()
  const { transactions, totalTransactions, currentPage, pageSize, filters, isLoading, error } =
    useAppSelector((state) => state.transactions)

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch, currentPage, pageSize, filters])

  const createTransaction = (
    transaction: Omit<Transaction, "id" | "baseAmount" | "exchangeRate">,
  ) => {
    return dispatch(addTransaction(transaction))
      .unwrap()
      .then(() => dispatch(fetchTransactions()))
  }

  const modifyTransaction = (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "baseAmount" | "exchangeRate">>,
  ) => {
    return dispatch(updateTransaction({ id, updates })).unwrap()
  }

  const removeTransaction = (id: string) => {
    return dispatch(deleteTransaction(id)).unwrap()
  }

  const goToPage = (page: number) => {
    dispatch(setPage(page))
  }

  const changePageSize = (size: number) => {
    dispatch(setPageSize(size))
  }

  const applyFilters = (newFilters: typeof filters) => {
    dispatch(setFilters(newFilters))
  }

  return {
    transactions,
    totalTransactions,
    currentPage,
    pageSize,
    filters,
    isLoading,
    error,
    createTransaction,
    modifyTransaction,
    removeTransaction,
    goToPage,
    changePageSize,
    applyFilters,
  }
}
