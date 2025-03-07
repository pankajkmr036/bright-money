import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import authReducer from "./auth/authSlice"
import exchangeRatesReducer from "./exchangeRates/exchangeRatesSlice"
import dashboardReducer from "./dashboard/dashboardSlice"
import transactionsReducer from "./transactions/transactionsSlice"
import budgetReducer from "./budget/budgetSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exchangeRates: exchangeRatesReducer,
    dashboard: dashboardReducer,
    transactions: transactionsReducer,
    budget: budgetReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout app instead of plain `useDispatch` and `useSelector` for type safety
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
