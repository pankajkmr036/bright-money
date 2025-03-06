// app/store/budget/budgetSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { budgetService } from "@/services/api/mockApi/budgetService"
import type { Budget } from "@/types"

interface BudgetState {
  budgets: Budget[]
  selectedPeriod: "monthly" | "yearly"
  selectedMonth: number
  selectedYear: number
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

// Initialize with current month and year
const currentDate = new Date()
const initialState: BudgetState = {
  budgets: [],
  selectedPeriod: "monthly",
  selectedMonth: currentDate.getMonth() + 1, // JavaScript months are 0-indexed
  selectedYear: currentDate.getFullYear(),
  isLoading: false,
  error: null,
  lastUpdated: null,
}

export const fetchBudgets = createAsyncThunk(
  "budget/fetchBudgets",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { budget: BudgetState }
      const { selectedPeriod, selectedMonth, selectedYear } = state.budget

      const budgets = await budgetService.getBudgets(selectedPeriod, selectedMonth, selectedYear)

      return budgets
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch budgets")
    }
  },
)

export const addBudget = createAsyncThunk(
  "budget/addBudget",
  async (budget: Omit<Budget, "id">, { rejectWithValue }) => {
    try {
      return await budgetService.addBudget(budget)
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add budget")
    }
  },
)

export const updateBudget = createAsyncThunk(
  "budget/updateBudget",
  async (
    { id, updates }: { id: string; updates: Partial<Omit<Budget, "id">> },
    { rejectWithValue },
  ) => {
    try {
      return await budgetService.updateBudget(id, updates)
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update budget")
    }
  },
)

export const deleteBudget = createAsyncThunk(
  "budget/deleteBudget",
  async (id: string, { rejectWithValue }) => {
    try {
      const success = await budgetService.deleteBudget(id)
      return { id, success }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete budget")
    }
  },
)

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setBudgetPeriod(state, action) {
      state.selectedPeriod = action.payload
    },
    setBudgetMonth(state, action) {
      state.selectedMonth = action.payload
    },
    setBudgetYear(state, action) {
      state.selectedYear = action.payload
    },
    clearBudgetError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = action.payload
        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Add budget
      .addCase(addBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets.push(action.payload)
        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(addBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Update budget
      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isLoading = false

        const index = state.budgets.findIndex((b) => b.id === action.payload.id)
        if (index !== -1) {
          state.budgets[index] = action.payload
        }

        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Delete budget
      .addCase(deleteBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isLoading = false

        if (action.payload.success) {
          state.budgets = state.budgets.filter((b) => b.id !== action.payload.id)
        }

        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setBudgetPeriod, setBudgetMonth, setBudgetYear, clearBudgetError } =
  budgetSlice.actions

export default budgetSlice.reducer
