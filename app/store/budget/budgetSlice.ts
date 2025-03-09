// app/store/budget/budgetSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { Budget, budgetApiService } from "@/services/api/mockApi"
import { getCurrentMonth } from "@/utils/formatDate"

interface BudgetState {
  budgets: Budget[]
  currentMonth: string // Format: 'YYYY-MM'
  isAddEditModalVisible: boolean
  currentEditBudget: Budget | null
  isLoading: boolean
  error: string | null
}

// Get current month in YYYY-MM format

const initialState: BudgetState = {
  budgets: [],
  currentMonth: getCurrentMonth(),
  isAddEditModalVisible: false,
  currentEditBudget: null,
  isLoading: false,
  error: null,
}

// Fetch all budgets
export const fetchBudgets = createAsyncThunk(
  "budget/fetchBudgets",
  async (_, { rejectWithValue }) => {
    try {
      return await budgetApiService.getBudgets()
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch budgets")
    }
  },
)

// Fetch budgets for specific month
export const fetchBudgetsByMonth = createAsyncThunk(
  "budget/fetchBudgetsByMonth",
  async (month: string, { rejectWithValue }) => {
    try {
      return await budgetApiService.getBudgetsByMonth(month)
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch budgets for month")
    }
  },
)

// Add new budget
export const addBudget = createAsyncThunk(
  "budget/addBudget",
  async (budget: Omit<Budget, "id">, { rejectWithValue }) => {
    try {
      return await budgetApiService.addBudget(budget)
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add budget")
    }
  },
)

// Update budget
export const updateBudget = createAsyncThunk(
  "budget/updateBudget",
  async (budget: Budget, { rejectWithValue }) => {
    try {
      return await budgetApiService.updateBudget(budget)
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update budget")
    }
  },
)

// Delete budget
export const deleteBudget = createAsyncThunk(
  "budget/deleteBudget",
  async (id: string, { rejectWithValue }) => {
    try {
      await budgetApiService.deleteBudget(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete budget")
    }
  },
)

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    // Set current month
    setCurrentMonth(state, action: PayloadAction<string>) {
      state.currentMonth = action.payload
    },

    // Toggle add/edit modal
    toggleAddEditModal(state, action: PayloadAction<boolean>) {
      state.isAddEditModalVisible = action.payload
    },

    // Set budget for editing
    setCurrentEditBudget(state, action: PayloadAction<Budget | null>) {
      state.currentEditBudget = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = action.payload
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch budgets by month
      .addCase(fetchBudgetsByMonth.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgetsByMonth.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = action.payload
      })
      .addCase(fetchBudgetsByMonth.rejected, (state, action) => {
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
        state.isAddEditModalVisible = false
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
        state.isAddEditModalVisible = false
        state.currentEditBudget = null
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
        state.budgets = state.budgets.filter((b) => b.id !== action.payload)
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setCurrentMonth, toggleAddEditModal, setCurrentEditBudget } = budgetSlice.actions
export default budgetSlice.reducer
