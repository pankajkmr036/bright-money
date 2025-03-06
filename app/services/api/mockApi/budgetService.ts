// app/services/api/mockApi/budgetService.ts
import { delay } from "@/utils/delay"
import type { Budget } from "@/types"
import { v4 as uuidv4 } from "uuid"

class BudgetService {
  private apiDelay = 600
  private budgets: Budget[] = [
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
    {
      id: "5",
      category: "Shopping",
      amount: 400,
      spent: 385,
      period: "monthly",
      month: 5,
      year: 2023,
    },
    {
      id: "6",
      category: "Health",
      amount: 300,
      spent: 120,
      period: "monthly",
      month: 5,
      year: 2023,
    },
  ]

  async getBudgets(
    period: "monthly" | "yearly" = "monthly",
    month?: number,
    year?: number,
  ): Promise<Budget[]> {
    await delay(this.apiDelay)

    let filteredBudgets = [...this.budgets]

    if (period) {
      filteredBudgets = filteredBudgets.filter((b) => b.period === period)
    }

    if (month !== undefined) {
      filteredBudgets = filteredBudgets.filter((b) => b.month === month)
    }

    if (year !== undefined) {
      filteredBudgets = filteredBudgets.filter((b) => b.year === year)
    }

    return filteredBudgets
  }

  async getBudgetById(id: string): Promise<Budget | undefined> {
    await delay(this.apiDelay / 2)
    return this.budgets.find((b) => b.id === id)
  }

  async getBudgetByCategory(
    category: string,
    period: "monthly" | "yearly" = "monthly",
    month?: number,
    year?: number,
  ): Promise<Budget | undefined> {
    await delay(this.apiDelay / 2)

    return this.budgets.find(
      (b) =>
        b.category === category &&
        b.period === period &&
        (month === undefined || b.month === month) &&
        (year === undefined || b.year === year),
    )
  }

  async addBudget(budget: Omit<Budget, "id">): Promise<Budget> {
    await delay(this.apiDelay)

    // Check if budget for this category and period already exists
    const existingBudget = await this.getBudgetByCategory(
      budget.category,
      budget.period,
      budget.month,
      budget.year,
    )

    if (existingBudget) {
      throw new Error(`Budget for ${budget.category} already exists for this period`)
    }

    const newBudget: Budget = {
      id: uuidv4(),
      ...budget,
    }

    this.budgets.push(newBudget)

    return newBudget
  }

  async updateBudget(id: string, updates: Partial<Omit<Budget, "id">>): Promise<Budget> {
    await delay(this.apiDelay)

    const index = this.budgets.findIndex((b) => b.id === id)
    if (index === -1) {
      throw new Error("Budget not found")
    }

    const updatedBudget = {
      ...this.budgets[index],
      ...updates,
    }

    // Check if update would create duplicate
    if (
      updates.category !== undefined ||
      updates.period !== undefined ||
      updates.month !== undefined ||
      updates.year !== undefined
    ) {
      const existingBudget = await this.getBudgetByCategory(
        updatedBudget.category,
        updatedBudget.period,
        updatedBudget.month,
        updatedBudget.year,
      )

      if (existingBudget && existingBudget.id !== id) {
        throw new Error(`Budget for ${updatedBudget.category} already exists for this period`)
      }
    }

    this.budgets[index] = updatedBudget

    return updatedBudget
  }

  async deleteBudget(id: string): Promise<boolean> {
    await delay(this.apiDelay)
    const initialLength = this.budgets.length
    this.budgets = this.budgets.filter((b) => b.id !== id)
    return this.budgets.length !== initialLength
  }

  async updateSpending(
    category: string,
    amount: number,
    period: "monthly" | "yearly" = "monthly",
    month?: number,
    year?: number,
  ): Promise<Budget | undefined> {
    await delay(this.apiDelay / 2)

    const budget = await this.getBudgetByCategory(category, period, month, year)
    if (!budget) {
      return undefined
    }

    const updatedBudget = {
      ...budget,
      spent: budget.spent + amount,
    }

    return this.updateBudget(budget.id, { spent: updatedBudget.spent })
  }

  setDelay(ms: number): void {
    this.apiDelay = ms
  }
}

export const budgetService = new BudgetService()
