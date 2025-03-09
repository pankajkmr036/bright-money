// app/store/dashboard/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { DashboardData, dashboardApiService } from "@/services/api/mockApi"

interface DashboardState {
  data: DashboardData | null
  isLoading: boolean
  error: string | null
}

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
}

// Fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardApiService.getDashboardData()
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch dashboard data")
    }
  },
)

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const {} = dashboardSlice.actions
export default dashboardSlice.reducer
