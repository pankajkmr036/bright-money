// app/hooks/useExchangeRates.ts
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/store"
import {
  fetchExchangeRates,
  loadCachedRates,
  setBaseCurrency,
  CACHE_EXPIRY,
} from "@/store/exchangeRates/exchangeRatesSlice"

export const useExchangeRates = () => {
  const dispatch = useAppDispatch()
  const { data, lastUpdated, base, isLoading, error } = useAppSelector(
    (state) => state.exchangeRates,
  )

  // Load cached rates and fetch fresh rates if needed
  useEffect(() => {
    const loadRates = async () => {
      try {
        // Try to load cached rates first
        await dispatch(loadCachedRates()).unwrap()

        // Check if cache is expired
        if (lastUpdated && Date.now() - lastUpdated > CACHE_EXPIRY) {
          // Cache is expired, fetch fresh data
          dispatch(fetchExchangeRates(base))
        }
      } catch (error) {
        // No cached data or error loading cache, fetch fresh data
        dispatch(fetchExchangeRates(base))
      }
    }

    loadRates()
    // We only want to run this once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // Function to refresh rates manually
  const refreshRates = () => {
    dispatch(fetchExchangeRates(base))
  }

  // Function to change base currency
  const changeBaseCurrency = (newBase: string) => {
    dispatch(setBaseCurrency(newBase))
    dispatch(fetchExchangeRates(newBase))
  }

  // Utility function to convert between currencies
  const convert = (amount: number, from: string, to: string): number => {
    if (!data || !data.rates) return amount

    // If base currency is already 'from', we can convert directly
    if (base === from) {
      return amount * (data.rates[to] || 1)
    }

    // Otherwise, we need to convert via the base currency
    // First convert from -> base, then base -> to
    const fromRate = from === base ? 1 : data.rates[from]
    const toRate = data.rates[to]

    if (!fromRate || !toRate) return amount

    return (amount / fromRate) * toRate
  }

  return {
    rates: data?.rates || {},
    base,
    lastUpdated,
    isLoading,
    error,
    refreshRates,
    changeBaseCurrency,
    convert,
  }
}
