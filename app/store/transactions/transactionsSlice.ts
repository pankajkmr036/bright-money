// app/store/transactions/transactionsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { transactionsService } from "@/services/api/mockApi/transactionsService"
import { exchangeRateService } from "@/services/api/mockApi/exchangeRateService"
import { budgetService } from "@/services/api/mockApi/budgetService"
import type { Transaction } from "@/types"

interface TransactionsState {
  transactions: Transaction[]
  totalTransactions: number
  currentPage: number
  pageSize: number
  filters: {
    startDate?: string
    endDate?: string
    category?: string
    minAmount?: number
    maxAmount?: number
    searchTerm?: string
  }
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

const initialState: TransactionsState = {
  transactions: [],
  totalTransactions: 0,
  currentPage: 0,
  pageSize: 10,
  filters: {},
  isLoading: false,
  error: null,
  lastUpdated: null,
}

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { transactions: TransactionsState }
      const { currentPage, pageSize, filters } = state.transactions

      const response = await transactionsService.getTransactions(
        pageSize,
        currentPage * pageSize,
        filters,
      )

      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch transactions")
    }
  },
)

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (
    transaction: Omit<Transaction, "id" | "baseAmount" | "exchangeRate">,
    { rejectWithValue },
  ) => {
    try {
      const newTransaction = await transactionsService.addTransaction(transaction)

      // If it's an expense, update the budget
      if (transaction.amount < 0) {
        // Get current month and year
        const date = new Date(transaction.date)
        const month = date.getMonth() + 1 // JavaScript months are 0-indexed
        const year = date.getFullYear()

        // Update budget spending
        await budgetService.updateSpending(
          transaction.category,
          Math.abs(transaction.amount),
          "monthly",
          month,
          year,
        )
      }

      return newTransaction
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add transaction")
    }
  },
)

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (
    {
      id,
      updates,
    }: {
      id: string
      updates: Partial<Omit<Transaction, "id" | "baseAmount" | "exchangeRate">>
    },
    { rejectWithValue, getState },
  ) => {
    try {
      // Get the original transaction for budget adjustment calculations
      const originalTransaction = await transactionsService.getTransactionById(id)
      if (!originalTransaction) {
        throw new Error("Transaction not found")
      }

      const updatedTransaction = await transactionsService.updateTransaction(id, updates)

      // Handle budget updates if category or amount changed
      if (
        (updates.category && updates.category !== originalTransaction.category) ||
        (updates.amount !== undefined && updates.amount !== originalTransaction.amount) ||
        (updates.date && updates.date !== originalTransaction.date)
      ) {
        // If it was an expense, adjust the original budget
        if (originalTransaction.amount < 0) {
          const originalDate = new Date(originalTransaction.date)
          const originalMonth = originalDate.getMonth() + 1
          const originalYear = originalDate.getFullYear()

          await budgetService.updateSpending(
            originalTransaction.category,
            -Math.abs(originalTransaction.amount), // Subtract the old amount
            "monthly",
            originalMonth,
            originalYear,
          )
        }

        // If it's still an expense, update the new budget
        if (updatedTransaction.amount < 0) {
          const newDate = new Date(updatedTransaction.date)
          const newMonth = newDate.getMonth() + 1
          const newYear = newDate.getFullYear()

          await budgetService.updateSpending(
            updatedTransaction.category,
            Math.abs(updatedTransaction.amount), // Add the new amount
            "monthly",
            newMonth,
            newYear,
          )
        }
      }

      return updatedTransaction
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update transaction")
    }
  },
)

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id: string, { rejectWithValue }) => {
    try {
      // Get the transaction before deleting for budget adjustment
      const transaction = await transactionsService.getTransactionById(id)
      if (!transaction) {
        throw new Error("Transaction not found")
      }

      const success = await transactionsService.deleteTransaction(id)

      if (success && transaction.amount < 0) {
        // If it was an expense, adjust the budget
        const date = new Date(transaction.date)
        const month = date.getMonth() + 1
        const year = date.getFullYear()

        await budgetService.updateSpending(
          transaction.category,
          -Math.abs(transaction.amount), // Subtract the amount from the budget
          "monthly",
          month,
          year,
        )
      }

      return { id, success }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete transaction")
    }
  },
)

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload
      state.currentPage = 0 // Reset to first page when changing page size
    },
    setFilters(state, action: PayloadAction<TransactionsState["filters"]>) {
      state.filters = action.payload
      state.currentPage = 0 // Reset to first page when applying filters
    },
    clearTransactionsError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = action.payload.transactions
        state.totalTransactions = action.payload.total
        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Add transaction
      .addCase(addTransaction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.isLoading = false
        // Don't update transactions list here - we'll refetch to maintain pagination
        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Update transaction
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isLoading = false

        // Update the transaction in the current list
        const index = state.transactions.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.transactions[index] = action.payload
        }

        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Delete transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isLoading = false

        if (action.payload.success) {
          // Remove the transaction from the current list
          state.transactions = state.transactions.filter((t) => t.id !== action.payload.id)
          state.totalTransactions -= 1
        }

        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setPage, setPageSize, setFilters, clearTransactionsError } =
  transactionsSlice.actions

export default transactionsSlice.reducer
