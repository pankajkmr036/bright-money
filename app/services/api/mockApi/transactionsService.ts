// app/services/api/mockApi/transactionsService.ts
import { delay } from "@/utils/delay"
// import { exchangeRateService } from "./exchangeRateService"
import type { Transaction } from "@/types"
import { v4 as uuidv4 } from "uuid"

// Helper to generate a random transaction for mock data
const generateRandomTransaction = (index: number): Transaction => {
  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Utilities",
    "Shopping",
    "Health",
    "Education",
    "Income",
  ]
  const descriptions = [
    "Grocery shopping",
    "Restaurant",
    "Coffee",
    "Uber ride",
    "Gas",
    "Public transport",
    "Movie tickets",
    "Streaming service",
    "Electricity bill",
    "Internet bill",
    "Phone bill",
    "Online shopping",
    "Clothes",
    "Electronics",
    "Doctor visit",
    "Medication",
    "Books",
    "Online course",
    "Salary",
    "Freelance work",
    "Interest",
    "Gift",
  ]
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD"]

  const isIncome = Math.random() > 0.8
  const amount = isIncome
    ? Math.floor(Math.random() * 3000) + 1000
    : -Math.floor(Math.random() * 200) - 10

  const currency = currencies[Math.floor(Math.random() * currencies.length)]
  const exchangeRate = currency === "USD" ? 1 : 0.8 + Math.random() * 0.4

  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))

  return {
    id: uuidv4(),
    date: date.toISOString().split("T")[0],
    amount,
    category: isIncome ? "Income" : categories[Math.floor(Math.random() * (categories.length - 1))],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    currency,
    exchangeRate,
    baseAmount: amount * exchangeRate,
  }
}

class TransactionsService {
  private apiDelay = 800
  private transactions: Transaction[] = Array.from({ length: 50 }, (_, i) =>
    generateRandomTransaction(i),
  )

  async getTransactions(
    limit?: number,
    offset?: number,
    filters?: {
      startDate?: string
      endDate?: string
      category?: string
      minAmount?: number
      maxAmount?: number
      searchTerm?: string
    },
  ): Promise<{ transactions: Transaction[]; total: number }> {
    await delay(this.apiDelay)

    let filteredTransactions = [...this.transactions]

    // Apply filters if provided
    if (filters) {
      if (filters.startDate) {
        filteredTransactions = filteredTransactions.filter((t) => t.date >= filters.startDate!)
      }

      if (filters.endDate) {
        filteredTransactions = filteredTransactions.filter((t) => t.date <= filters.endDate!)
      }

      if (filters.category) {
        filteredTransactions = filteredTransactions.filter((t) => t.category === filters.category)
      }

      if (filters.minAmount !== undefined) {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.baseAmount >= filters.minAmount!,
        )
      }

      if (filters.maxAmount !== undefined) {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.baseAmount <= filters.maxAmount!,
        )
      }

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        filteredTransactions = filteredTransactions.filter(
          (t) =>
            t.description.toLowerCase().includes(term) || t.category.toLowerCase().includes(term),
        )
      }
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const total = filteredTransactions.length

    // Apply pagination if requested
    if (limit !== undefined && offset !== undefined) {
      filteredTransactions = filteredTransactions.slice(offset, offset + limit)
    }

    return {
      transactions: filteredTransactions,
      total,
    }
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    await delay(this.apiDelay / 2)
    return this.transactions.find((t) => t.id === id)
  }

  async addTransaction(
    transaction: Omit<Transaction, "id" | "baseAmount" | "exchangeRate">,
  ): Promise<Transaction> {
    await delay(this.apiDelay)

    // Get exchange rate and calculate base amount
    const { rate } = await exchangeRateService.convertAmount(
      transaction.amount,
      transaction.currency,
      "USD",
    )

    const newTransaction: Transaction = {
      id: uuidv4(),
      ...transaction,
      exchangeRate: rate,
      baseAmount: transaction.amount * rate,
    }

    this.transactions.push(newTransaction)

    return newTransaction
  }

  async updateTransaction(
    id: string,
    updates: Partial<Omit<Transaction, "id" | "baseAmount" | "exchangeRate">>,
  ): Promise<Transaction> {
    await delay(this.apiDelay)

    const index = this.transactions.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error("Transaction not found")
    }

    let updatedTransaction = { ...this.transactions[index], ...updates }

    // Recalculate baseAmount if amount or currency changed
    if (updates.amount !== undefined || updates.currency !== undefined) {
      const { rate } = await exchangeRateService.convertAmount(
        updatedTransaction.amount,
        updatedTransaction.currency,
        "USD",
      )

      updatedTransaction = {
        ...updatedTransaction,
        exchangeRate: rate,
        baseAmount: updatedTransaction.amount * rate,
      }
    }

    this.transactions[index] = updatedTransaction

    return updatedTransaction
  }

  async deleteTransaction(id: string): Promise<boolean> {
    await delay(this.apiDelay)
    const initialLength = this.transactions.length
    this.transactions = this.transactions.filter((t) => t.id !== id)
    return this.transactions.length !== initialLength
  }

  async getRecentTransactions(limit: number = 5): Promise<Transaction[]> {
    await delay(this.apiDelay / 2)
    return this.transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }

  setDelay(ms: number): void {
    this.apiDelay = ms
  }
}
