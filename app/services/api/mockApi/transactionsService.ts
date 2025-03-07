// app/services/api/mockApi/transactionApi.ts
import { delay } from "@/utils/delay"
import type { Transaction, TransactionCategory, TransactionType, TransactionFilter } from "@/types"

// Mock transaction data based on screenshots
const mockTransactions: Transaction[] = [
  {
    id: "1",
    merchantName: "Mumbai Medical",
    amount: 76.53,
    date: "2025-02-12",
    category: "medical",
    subcategory: "medical",
    type: "income",
    status: "cleared",
    description: "Refund for medical services",
  },
  {
    id: "2",
    merchantName: "Mumbai Medical",
    amount: 1942.39,
    date: "2025-02-11",
    category: "medical",
    subcategory: "medical",
    type: "expense",
    status: "cleared",
    description: "Medical consultation",
  },
  {
    id: "3",
    merchantName: "Cashbackapp",
    amount: 109.0,
    date: "2025-02-08",
    category: "wallet and digital payment",
    type: "income",
    status: "cleared",
    description: "Cashback reward",
  },
  {
    id: "4",
    merchantName: "Food Products",
    amount: 261.0,
    date: "2025-02-07",
    category: "food and drinks",
    type: "expense",
    status: "cleared",
    description: "Grocery shopping",
  },
  {
    id: "5",
    merchantName: "Email Com",
    amount: 1968.0,
    date: "2025-02-04",
    category: "apps and software",
    type: "expense",
    status: "cleared",
    description: "Premium subscription",
  },
  {
    id: "6",
    merchantName: "Hdfc Ergo General Insurance Mumbai",
    amount: 23433.0,
    date: "2025-02-04",
    category: "banking and finance",
    type: "expense",
    status: "cleared",
    description: "Insurance premium payment",
  },
  {
    id: "7",
    merchantName: "CRED",
    amount: 7461.56,
    date: "2025-01-28",
    category: "wallet and digital payment",
    type: "income",
    status: "cleared",
    description: "Cashback rewards",
  },
  {
    id: "8",
    merchantName: "Zaitoon Restaurant",
    amount: 2882.0,
    date: "2025-01-25",
    category: "food and drinks",
    type: "expense",
    status: "cleared",
    description: "Dinner with colleagues",
    // Example of foreign currency transaction
    originalAmount: 34.5,
    originalCurrency: "USD",
    exchangeRate: 83.54,
  },
]

/**
 * Mock Transaction API Service
 * Simulates backend API for transaction data
 */
class TransactionApiService {
  /**
   * Simulated API delay (milliseconds)
   */
  private apiDelay = 800

  /**
   * Retrieve all transactions
   */
  async getTransactions(): Promise<Transaction[]> {
    // Simulate network delay
    await delay(this.apiDelay)
    return [...mockTransactions]
  }

  /**
   * Get filtered transactions based on filter criteria
   */
  async getFilteredTransactions(filter: TransactionFilter): Promise<Transaction[]> {
    await delay(this.apiDelay)

    let filtered = [...mockTransactions]

    // Apply category filter if any categories selected
    if (filter.categories.length > 0) {
      filtered = filtered.filter((t) => filter.categories.includes(t.category))
    }

    // Apply transaction type filter
    if (filter.type) {
      filtered = filtered.filter((t) => t.type === filter.type)
    }

    // Apply range filter
    filtered = filtered.filter((t) => {
      const amount = Math.abs(t.amount)
      return amount >= filter.range.min && amount <= filter.range.max
    })

    // Apply date range filter if specified
    if (filter.dateRange) {
      const fromDate = new Date(filter.dateRange.from).getTime()
      const toDate = new Date(filter.dateRange.to).getTime()

      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date).getTime()
        return transactionDate >= fromDate && transactionDate <= toDate
      })
    }

    // Apply search filter
    if (filter.search) {
      const search = filter.search.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.merchantName.toLowerCase().includes(search) ||
          t.category.toLowerCase().includes(search) ||
          (t.description && t.description.toLowerCase().includes(search)),
      )
    }

    // Apply sort
    switch (filter.sort) {
      case "new to old":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "old to new":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "high to low":
        filtered.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
        break
      case "low to high":
        filtered.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount))
        break
    }

    return filtered
  }

  /**
   * Search transactions by query string
   */
  async searchTransactions(query: string): Promise<Transaction[]> {
    await delay(this.apiDelay / 2) // Faster response for search

    if (!query) return [...mockTransactions]

    const search = query.toLowerCase()
    return mockTransactions.filter(
      (t) =>
        t.merchantName.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search) ||
        (t.description && t.description.toLowerCase().includes(search)),
    )
  }

  /**
   * Get transaction categories
   */
  async getCategories(): Promise<TransactionCategory[]> {
    await delay(this.apiDelay / 2)

    // Extract unique categories from transactions
    const categories = new Set<TransactionCategory>()
    mockTransactions.forEach((t) => {
      categories.add(t.category)
    })

    // Add additional categories from the screenshots
    const additionalCategories: TransactionCategory[] = [
      "education",
      "emi",
      "entertainment",
      "automobile and fuel",
      "card and finance charges",
      "shopping",
      "bills and utilities",
      "travel",
      "investment",
      "income",
      "other",
    ]

    additionalCategories.forEach((c) => categories.add(c))

    return Array.from(categories)
  }

  /**
   * Add a new transaction (in a real app, this would send to the server)
   */
  async addTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    await delay(this.apiDelay)

    // Generate a new ID
    const newTransaction = {
      id: `transaction-${Date.now()}`,
      ...transaction,
    }

    // In a real app, this would be sent to the server
    // For our mock API, we'll just return the new transaction
    return newTransaction
  }

  /**
   * Sets the simulated API delay
   */
  setDelay(ms: number): void {
    this.apiDelay = ms
  }
}

// Export a singleton instance
export const transactionApiService = new TransactionApiService()
