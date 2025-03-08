// app/components/Budget/BudgetProgressBar.tsx - updated
import React from "react"
import { ProgressBar } from "@/components"

interface BudgetProgressBarProps {
  allocated: number
  spent: number
}

export const BudgetProgressBar = ({ allocated, spent }: BudgetProgressBarProps) => {
  // Calculate percentage used
  const percentUsed = Math.min((spent / allocated) * 100, 100)

  return <ProgressBar progress={percentUsed} height={10} />
}
