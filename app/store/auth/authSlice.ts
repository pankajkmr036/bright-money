import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import * as storage from "@/utils/storage"

export interface User {
  username: string
  id: string
  name: string
  email?: string
}

interface LoginCredentials {
  username: string
  password: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
