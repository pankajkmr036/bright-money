// app/services/api/mockApi/dashboardService.ts
import { delay } from "@/utils/delay"

// Dashboard data model
export interface DashboardData {
  balance: {
    total: number
    available: number
    currency: string
  }
  monthlyInsights: {
    id: string
    currentMonth: string // Format: "MMM'YY" (e.g., "FEB'25")
    currentSpend: string
    previousMonth: string
    previousSpend: string
    comparisonAmount: string
    isLower: boolean
  }[]
  expenseDistribution: {
    category: string
    amount: number
    transactions: number
    color: string
    percentage: number
  }[]
  monthlyExpenses: {
    month: string
    amount: number
  }[]
}

class DashboardApiService {
  private apiDelay = 800

  /**
   * Get all dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    await delay(this.apiDelay)

    // Return complete dashboard data
    return {
      balance: {
        total: 9896.55,
        available: 8534.23,
        currency: "INR",
      },

      monthlyInsights: [
        {
          id: "1",
          currentMonth: "FEB'25",
          currentSpend: "59.76K",
          previousMonth: "JAN'25",
          previousSpend: "100.73K",
          comparisonAmount: "40.97K",
          isLower: true,
        },
        {
          id: "2",
          currentMonth: "JAN'25",
          currentSpend: "100.73K",
          previousMonth: "DEC'24",
          previousSpend: "85.41K",
          comparisonAmount: "15.32K",
          isLower: false,
        },
        {
          id: "3",
          currentMonth: "DEC'24",
          currentSpend: "85.41K",
          previousMonth: "NOV'24",
          previousSpend: "80.29K",
          comparisonAmount: "5.12K",
          isLower: false,
        },
      ],
      expenseDistribution: [
        {
          category: "banking and finance",
          amount: 23433,
          transactions: 1,
          color: "#7E5894",
          percentage: 76.9,
        },
        {
          category: "food and drinks",
          amount: 3143,
          transactions: 2,
          color: "#9D73B3",
          percentage: 10.3,
        },
        {
          category: "apps and software",
          amount: 1968,
          transactions: 1,
          color: "#BDA0CF",
          percentage: 6.5,
        },
        {
          category: "medical",
          amount: 1942.39,
          transactions: 2,
          color: "#D7C2E0",
          percentage: 6.4,
        },
      ],
      monthlyExpenses: [
        { month: "Sep", amount: 32000 },
        { month: "Oct", amount: 38500 },
        { month: "Nov", amount: 26700 },
        { month: "Dec", amount: 85410 },
        { month: "Jan", amount: 100730 },
        { month: "Feb", amount: 59760 },
      ],
    }
  }
}

// Export a singleton instance
export const dashboardApiService = new DashboardApiService()
