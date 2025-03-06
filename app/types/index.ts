// app/types/index.ts

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  description: string
  currency: string
  exchangeRate: number
  baseAmount: number
}

export interface Budget {
  id: string
  category: string
  amount: number
  spent: number
  period: "monthly" | "yearly"
  month: number
  year: number
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface FinancialSummary {
  totalBalance: number
  income: number
  expenses: number
  savings: number
  budgetUtilization: number
}

export interface Currency {
  code: string
  name: string
  symbol: string
}

export interface DashboardData {
  summary: FinancialSummary
  recentTransactions: Transaction[]
  budgets: Budget[]
  monthlyExpenses: {
    month: string
    amount: number
  }[]
  expensesByCategory: {
    category: string
    amount: number
    percentage: number
    color: string
  }[]
}
