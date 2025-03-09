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
    currentMonth: string // Format: "MMM'YY" (e.g., "FEB'25")
    currentSpend: number
    previousMonth: string
    previousSpend: number
    comparisonAmount: number
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
          currentMonth: "FEB'25",
          currentSpend: 59760,
          previousMonth: "JAN'25",
          previousSpend: 100730,
          comparisonAmount: 40970,
          isLower: true,
        },
        {
          currentMonth: "JAN'25",
          currentSpend: 100730,
          previousMonth: "DEC'24",
          previousSpend: 85410,
          comparisonAmount: 15320,
          isLower: false,
        },
        {
          currentMonth: "DEC'24",
          currentSpend: 85410,
          previousMonth: "NOV'24",
          previousSpend: 80290,
          comparisonAmount: 5120,
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
