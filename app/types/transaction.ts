// app/models/transaction.ts
export interface Transaction {
  id: string
  merchantName: string

  // Amount in base currency (e.g., INR)
  amount: number

  // For transactions in other currencies
  originalAmount?: number
  originalCurrency?: string
  exchangeRate?: number

  date: string
  category: TransactionCategory
  subcategory?: string

  // Type of transaction
  // true = money coming in (credit/income)
  // false = money going out (debit/expense)
  type: TransactionType

  // Additional information
  description?: string
  status?: "pending" | "cleared" | "failed"

  // Payment method or account information
  paymentMethod?: string
  accountId?: string
}

export type TransactionType = "income" | "expense"

export type TransactionCategory =
  | "medical"
  | "food and drinks"
  | "wallet and digital payment"
  | "apps and software"
  | "banking and finance"
  | "card and finance charges"
  | "education"
  | "emi"
  | "entertainment"
  | "automobile and fuel"
  | "shopping"
  | "bills and utilities"
  | "travel"
  | "investment"
  | "income"
  | "other"

export type SortOption = "new to old" | "old to new" | "high to low" | "low to high"

export interface TransactionFilter {
  sort: SortOption
  categories: TransactionCategory[]
  range: {
    min: number
    max: number
  }
  search?: string
  dateRange?: {
    from: string
    to: string
  }
  type?: TransactionType
}
