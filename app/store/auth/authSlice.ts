import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import * as storage from "@/utils/storage"
import { mockApiClient } from "@/services/api/mockApi"
import type {
  AuthState,
  LoginCredentials,
  AuthResponse,
  User,
} from "@/services/api/mockApi/authTypes"

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await mockApiClient.login(credentials)

      storage.save("auth_token", response.token)
      storage.save("user", response.user)

      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed")
    }
  },
)

export const logout = createAsyncThunk("auth/logout", async () => {
  storage.remove("auth_token")
  storage.remove("user")
  return null
})

export const checkAuth = createAsyncThunk("auth/check", async () => {
  const token = storage.load<string>("auth_token")
  const user = storage.load<User>("user")

  if (token && user) {
    // We could verify the token with the server here if needed
    const validUser = await mockApiClient.getCurrentUser(token)
    return { user, token }
  }

  return { user: null, token: null }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.error = (action.payload as string) || "Login failed"
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload.token && action.payload.user) {
          state.isAuthenticated = true
          state.user = action.payload.user
          state.token = action.payload.token
        }
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
