// app/store/dashboard/dashboardSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { dashboardApiService } from "@/services/api/mockApi/dashboardService"
import type { DashboardData } from "@/types"

interface DashboardState {
  data: DashboardData | null
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
}

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApiService.getDashboardData()
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch dashboard data")
    }
  },
)

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError(state) {
      state.error = null
    },
    refreshDashboard(state) {
      state.isLoading = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearDashboardError, refreshDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer
