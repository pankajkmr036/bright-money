// app/services/api/mockApi/budgetService.ts
import { delay } from "@/utils/delay"
import { v4 as uuidv4 } from "uuid"

export interface Budget {
  id: string
  category: string
  allocated: number
  spent: number
  month: string // Format: 'YYYY-MM'
  year: number
}

// Initial mock data
const mockBudgets: Budget[] = [
  {
    id: "1",
    category: "food and drinks",
    allocated: 15000,
    spent: 12300,
    month: "2025-02",
    year: 2025,
  },
  {
    id: "2",
    category: "shopping",
    allocated: 8000,
    spent: 7200,
    month: "2025-02",
    year: 2025,
  },
  {
    id: "3",
    category: "entertainment",
    allocated: 5000,
    spent: 5500,
    month: "2025-02",
    year: 2025,
  },
  {
    id: "4",
    category: "transportation",
    allocated: 3000,
    spent: 1800,
    month: "2025-02",
    year: 2025,
  },
]

class BudgetApiService {
  private apiDelay = 600
  private budgets = [...mockBudgets]

  // Get all budgets
  async getBudgets(): Promise<Budget[]> {
    await delay(this.apiDelay)
    return [...this.budgets]
  }

  // Get budgets for specific month
  async getBudgetsByMonth(month: string): Promise<Budget[]> {
    await delay(this.apiDelay)
    return this.budgets.filter((budget) => budget.month === month)
  }

  // Add new budget
  async addBudget(budget: Omit<Budget, "id">): Promise<Budget> {
    await delay(this.apiDelay)

    const newBudget = {
      ...budget,
      id: uuidv4(),
    }

    this.budgets.push(newBudget)
    return newBudget
  }

  // Update budget
  async updateBudget(budget: Budget): Promise<Budget> {
    await delay(this.apiDelay)

    const index = this.budgets.findIndex((b) => b.id === budget.id)
    if (index === -1) throw new Error("Budget not found")

    this.budgets[index] = budget
    return budget
  }

  // Delete budget
  async deleteBudget(id: string): Promise<boolean> {
    await delay(this.apiDelay)

    const index = this.budgets.findIndex((b) => b.id === id)
    if (index === -1) throw new Error("Budget not found")

    this.budgets.splice(index, 1)
    return true
  }
}

// Export singleton instance
export const budgetApiService = new BudgetApiService()
