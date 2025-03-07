import { useAppDispatch } from "@/store/store"
import { fetchTransactions } from "@/store/transactions/transactionsSlice"
import { useEffect } from "react"

export const useAppInit = () => {
  const dispatch = useAppDispatch()
  // Fetch transactions and categories on component mount
  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])
}
