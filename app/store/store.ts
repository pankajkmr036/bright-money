import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import authReducer from "./auth/authSlice"
import exchangeRatesReducer from "./exchangeRates/exchangeRatesSlice"
import dashboardReducer from "./dashboard/dashboardSlice"
import transactionsReducer from "./transactions/transactionsSlice"
import budgetReducer from "./budget/budgetSlice"

const appReducer = combineReducers({
  auth: authReducer,
  exchangeRates: exchangeRatesReducer,
  dashboard: dashboardReducer,
  transactions: transactionsReducer,
  budget: budgetReducer,
})

const rootReducer = (state: any, action: any) => {
  // If the action is logout, clear all state
  if (action.type === "auth/logout/fulfilled") {
    // This effectively resets the entire store to initial values
    return appReducer(undefined, action)
  }

  // Otherwise, proceed as normal
  return appReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout app instead of plain `useDispatch` and `useSelector` for type safety
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
