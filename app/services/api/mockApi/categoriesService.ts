// app/services/api/mockApi/categoriesService.ts
import { delay } from "@/utils/delay"
import type { Category } from "@/types"

class CategoriesService {
  private apiDelay = 300
  private categories: Category[] = [
    { id: "food", name: "Food", icon: "🍔", color: "#00C928" },
    { id: "transport", name: "Transport", icon: "🚗", color: "#37AF80" },
    { id: "entertainment", name: "Entertainment", icon: "🎭", color: "#65C39E" },
    { id: "utilities", name: "Utilities", icon: "💡", color: "#93D7BC" },
    { id: "shopping", name: "Shopping", icon: "🛍️", color: "#C1EBDA" },
    { id: "health", name: "Health", icon: "🏥", color: "#00A021" },
    { id: "education", name: "Education", icon: "📚", color: "#4AD864" },
    { id: "housing", name: "Housing", icon: "🏠", color: "#86E698" },
    { id: "income", name: "Income", icon: "💰", color: "#C7F3D0" },
    { id: "others", name: "Others", icon: "📦", color: "#E3F9E7" },
  ]

  async getCategories(): Promise<Category[]> {
    await delay(this.apiDelay)
    return [...this.categories]
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    await delay(this.apiDelay / 2)
    return this.categories.find((category) => category.id === id)
  }

  async addCategory(category: Omit<Category, "id">): Promise<Category> {
    await delay(this.apiDelay)
    const id = category.name.toLowerCase().replace(/\s+/g, "-")
    const newCategory = { id, ...category }
    this.categories.push(newCategory)
    return newCategory
  }

  async updateCategory(id: string, updates: Partial<Omit<Category, "id">>): Promise<Category> {
    await delay(this.apiDelay)
    const index = this.categories.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error("Category not found")
    }

    this.categories[index] = {
      ...this.categories[index],
      ...updates,
    }

    return this.categories[index]
  }

  async deleteCategory(id: string): Promise<boolean> {
    await delay(this.apiDelay)
    const initialLength = this.categories.length
    this.categories = this.categories.filter((c) => c.id !== id)
    return this.categories.length !== initialLength
  }

  setDelay(ms: number): void {
    this.apiDelay = ms
  }
}

export const categoriesService = new CategoriesService()
