// app/store/exchangeRates/exchangeRatesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { exchangeRateApi, ExchangeRatesResponse } from "@/services/api/exchangeRateApi"
import * as storage from "@/utils/storage"

const CACHE_KEY = "exchange_rates_cache"
export const CACHE_EXPIRY = 60 * 60 * 1000 // 1 hour in milliseconds

interface CachedData {
  data: ExchangeRatesResponse
  lastUpdated: number
  base: string
}

interface ExchangeRatesState {
  data: ExchangeRatesResponse | null
  lastUpdated: number | null
  base: string
  isLoading: boolean
  error: string | null
}

const initialState: ExchangeRatesState = {
  data: null,
  lastUpdated: null,
  base: "USD", // Default base currency
  isLoading: false,
  error: null,
}

// Load cached exchange rates from storage
export const loadCachedRates = createAsyncThunk(
  "exchangeRates/loadCached",
  async (_, { rejectWithValue }) => {
    try {
      const cached = storage.load<CachedData>(CACHE_KEY)

      if (!cached || !cached.data || !cached.lastUpdated) {
        return rejectWithValue("No valid cached data found")
      }

      return cached as CachedData
    } catch (error) {
      return rejectWithValue("Failed to load cached data")
    }
  },
)

// Fetch latest exchange rates
export const fetchExchangeRates = createAsyncThunk(
  "exchangeRates/fetch",
  async (base: string = "USD", { rejectWithValue }) => {
    try {
      const data = await exchangeRateApi.getLatestRates(base)

      // Cache the response
      const cacheData: CachedData = {
        data,
        lastUpdated: Date.now(),
        base,
      }

      storage.save(CACHE_KEY, cacheData)

      return cacheData
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch exchange rates")
    }
  },
)

export const exchangeRatesSlice = createSlice({
  name: "exchangeRates",
  initialState,
  reducers: {
    setBaseCurrency: (state, action: PayloadAction<string>) => {
      state.base = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCachedRates.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadCachedRates.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.lastUpdated = action.payload.lastUpdated
        state.base = action.payload.base
        state.isLoading = false
      })
      .addCase(loadCachedRates.rejected, (state, action) => {
        state.isLoading = false
        // We don't set an error here as it's expected that cache might not exist
      })
      .addCase(fetchExchangeRates.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.lastUpdated = action.payload.lastUpdated
        state.base = action.payload.base
        state.isLoading = false
        state.error = null
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setBaseCurrency } = exchangeRatesSlice.actions
export default exchangeRatesSlice.reducer
