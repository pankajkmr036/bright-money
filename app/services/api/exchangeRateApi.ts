// app/services/api/exchangeRateApi.ts
import { api } from "./api"
import Config from "@/config"

// You'll need to get an API key from Open Exchange Rates
// and add it to your config files
const API_KEY = Config.OPEN_EXCHANGE_RATES_API_KEY

export interface ExchangeRatesResponse {
  disclaimer: string
  license: string
  timestamp: number
  base: string
  rates: Record<string, number>
}

export const exchangeRateApi = {
  getLatestRates: async (base: string = "USD"): Promise<ExchangeRatesResponse> => {
    const response = await api.apisauce.get(
      `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&base=${base}`,
    )

    if (!response.ok) {
      throw new Error(response.problem)
    }

    // Type assertion here to fix the error
    return response.data as ExchangeRatesResponse
  },
}
