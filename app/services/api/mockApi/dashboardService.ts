// app/services/api/mockApi/dashboardService.ts
import { delay } from "@/utils/delay"
import type { DashboardData, Transaction, Budget } from "@/types"

class DashboardApiService {
  private apiDelay = 500

  async getDashboardData(): Promise<DashboardData> {
    // Simulate API delay
    await delay(this.apiDelay)

    return {
      summary: {
        totalBalance: 12580.45,
        income: 4250.0,
        expenses: 2785.32,
        savings: 1464.68,
        budgetUtilization: 68.5,
      },
      recentTransactions: [
        {
          id: "1",
          date: "2023-05-15",
          amount: -124.56,
          category: "Food",
          description: "Grocery Shopping",
          currency: "USD",
          exchangeRate: 1,
          baseAmount: -124.56,
        },
        {
          id: "2",
          date: "2023-05-14",
          amount: 3250.0,
          category: "Income",
          description: "Salary Deposit",
          currency: "USD",
          exchangeRate: 1,
          baseAmount: 3250.0,
        },
        {
          id: "3",
          date: "2023-05-12",
          amount: -94.27,
          category: "Utilities",
          description: "Electric Bill",
          currency: "USD",
          exchangeRate: 1,
          baseAmount: -94.27,
        },
        {
          id: "4",
          date: "2023-05-10",
          amount: -65.5,
          category: "Transport",
          description: "Uber",
          currency: "EUR",
          exchangeRate: 1.1,
          baseAmount: -72.05,
        },
        {
          id: "5",
          date: "2023-05-08",
          amount: -129.99,
          category: "Shopping",
          description: "Amazon purchase",
          currency: "USD",
          exchangeRate: 1,
          baseAmount: -129.99,
        },
      ],
      budgets: [
        {
          id: "1",
          category: "Food",
          amount: 600,
          spent: 450,
          period: "monthly",
          month: 5,
          year: 2023,
        },
        {
          id: "2",
          category: "Transport",
          amount: 400,
          spent: 300,
          period: "monthly",
          month: 5,
          year: 2023,
        },
        {
          id: "3",
          category: "Entertainment",
          amount: 300,
          spent: 250,
          period: "monthly",
          month: 5,
          year: 2023,
        },
        {
          id: "4",
          category: "Utilities",
          amount: 500,
          spent: 450,
          period: "monthly",
          month: 5,
          year: 2023,
        },
      ],
      monthlyExpenses: [
        { month: "Jan", amount: 2400 },
        { month: "Feb", amount: 2100 },
        { month: "Mar", amount: 2800 },
        { month: "Apr", amount: 2600 },
        { month: "May", amount: 2785 },
      ],
      expensesByCategory: [
        { category: "Food", amount: 450, percentage: 16.2, color: "#00C928" },
        { category: "Rent", amount: 1200, percentage: 43.1, color: "#37AF80" },
        { category: "Transport", amount: 300, percentage: 10.8, color: "#65C39E" },
        { category: "Entertainment", amount: 250, percentage: 9.0, color: "#FFCA43" },
        { category: "Shopping", amount: 385, percentage: 13.8, color: "#00A021" },
        { category: "Others", amount: 200, percentage: 7.1, color: "#B6C5B6" },
      ],
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    await delay(this.apiDelay)
    // Implementation would return a full list of transactions
    // Using the same structure as recentTransactions
    return []
  }

  async getBudgets(): Promise<Budget[]> {
    await delay(this.apiDelay)
    // Implementation would return all budgets
    return []
  }

  setDelay(ms: number): void {
    this.apiDelay = ms
  }
}

export const dashboardApiService = new DashboardApiService()
