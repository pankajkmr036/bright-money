// app/store/transactions/transactionsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import {
  Transaction,
  TransactionFilter,
  TransactionCategory,
  FilterTab,
} from "@/types"
import { transactionApiService } from "@/services/api/mockApi"

interface TransactionsState {
  transactions: Transaction[]
  filteredTransactions: Transaction[]
  categories: TransactionCategory[]
  filter: TransactionFilter
  isFilterModalVisible: boolean
  activeFilterTab: FilterTab
  isSearchMode: boolean
  isLoading: boolean
  isSearching: boolean
  error: string | null
}

// Initialize default filter
const initialFilter: TransactionFilter = {
  sort: "new to old",
  categories: [],
  range: {
    min: 0,
    max: 500000,
  },
}

const initialState: TransactionsState = {
  transactions: [],
  filteredTransactions: [],
  categories: [],
  filter: initialFilter,
  isFilterModalVisible: false,
  activeFilterTab: "NEW TO OLD",
  isSearchMode: false,
  isLoading: false,
  isSearching: false,
  error: null,
}

// Fetch all transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      return await transactionApiService.getTransactions()
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch transactions")
    }
  },
)

// Fetch transaction categories
export const fetchCategories = createAsyncThunk(
  "transactions/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await transactionApiService.getCategories()
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch categories")
    }
  },
)

// Apply filters and get filtered transactions
export const applyFilters = createAsyncThunk(
  "transactions/applyFilters",
  async (filter: TransactionFilter, { rejectWithValue }) => {
    try {
      return await transactionApiService.getFilteredTransactions(filter)
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to apply filters")
    }
  },
)

// Search transactions
export const searchTransactions = createAsyncThunk(
  "transactions/searchTransactions",
  async (query: string, { rejectWithValue }) => {
    try {
      return await transactionApiService.searchTransactions(query)
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search transactions")
    }
  },
)

// Add new transaction
export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction: Omit<Transaction, "id">, { rejectWithValue }) => {
    try {
      return await transactionApiService.addTransaction(transaction)
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add transaction")
    }
  },
)

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // Toggle filter modal visibility
    toggleFilterModal(state, action: PayloadAction<boolean | undefined>) {
      state.isFilterModalVisible =
        action.payload !== undefined ? action.payload : !state.isFilterModalVisible
    },

    // Set active filter tab
    setActiveFilterTab(state, action: PayloadAction<FilterTab>) {
      state.activeFilterTab = action.payload
    },

    // Toggle search mode
    toggleSearchMode(state, action: PayloadAction<boolean>) {
      state.isSearchMode = action.payload
    },

    // Update filter in state without API call
    updateFilter(state, action: PayloadAction<Partial<TransactionFilter>>) {
      state.filter = { ...state.filter, ...action.payload }
    },

    // Reset filters
    resetFilters(state) {
      state.filter = initialFilter
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
        state.transactions = action.payload
        state.filteredTransactions = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })

      // Apply filters
      .addCase(applyFilters.pending, (state) => {
        state.isLoading = true
      })
      .addCase(applyFilters.fulfilled, (state, action) => {
        state.isLoading = false
        state.filteredTransactions = action.payload
      })
      .addCase(applyFilters.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Search transactions
      .addCase(searchTransactions.pending, (state) => {
        state.isSearching = true
      })
      .addCase(searchTransactions.fulfilled, (state, action) => {
        state.isSearching = false
        state.filteredTransactions = action.payload
      })
      .addCase(searchTransactions.rejected, (state, action) => {
        state.isSearching = false
        state.error = action.payload as string
      })

      // Add transaction
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload)
        // Re-apply current filters to update filtered transactions
        state.filteredTransactions = [action.payload, ...state.filteredTransactions]
      })
  },
})

export const {
  toggleFilterModal,
  setActiveFilterTab,
  toggleSearchMode,
  updateFilter,
  resetFilters,
} = transactionsSlice.actions

export default transactionsSlice.reducer
