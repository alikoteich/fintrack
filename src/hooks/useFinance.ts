import { useState, useEffect, useCallback } from 'react'
import { Expense, Budget, Category, DEFAULT_BUDGETS } from '../types'

const EXPENSES_KEY = 'fintrack_expenses'
const BUDGET_KEY = 'fintrack_budget'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useFinance() {
  const [expenses, setExpenses] = useState<Expense[]>(() => load(EXPENSES_KEY, []))
  const [budget, setBudget] = useState<Budget>(() => load(BUDGET_KEY, DEFAULT_BUDGETS))

  useEffect(() => { save(EXPENSES_KEY, expenses) }, [expenses])
  useEffect(() => { save(BUDGET_KEY, budget) }, [budget])

  const addExpense = useCallback((
    amount: number,
    category: Category,
    note: string,
    date: string
  ) => {
    const expense: Expense = {
      id: crypto.randomUUID(),
      amount,
      category,
      note,
      date,
      createdAt: Date.now(),
    }
    setExpenses(prev => [expense, ...prev])
    return expense
  }, [])

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }, [])

  const updateBudget = useCallback((category: Category, limit: number) => {
    setBudget(prev => ({ ...prev, [category]: limit }))
  }, [])

  const getMonthExpenses = useCallback((month: string) => {
    return expenses.filter(e => e.date.startsWith(month))
  }, [expenses])

  const getMonthTotal = useCallback((month: string) => {
    return getMonthExpenses(month).reduce((s, e) => s + e.amount, 0)
  }, [getMonthExpenses])

  const getCategoryTotal = useCallback((category: Category, month: string) => {
    return getMonthExpenses(month)
      .filter(e => e.category === category)
      .reduce((s, e) => s + e.amount, 0)
  }, [getMonthExpenses])

  // Returns last N months with their totals for chart
  const getMonthlyTrend = useCallback((n = 6) => {
    const months: { month: string; label: string; total: number }[] = []
    const now = new Date()
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleString('default', { month: 'short' })
      months.push({ month: key, label, total: getMonthTotal(key) })
    }
    return months
  }, [getMonthTotal])

  return {
    expenses,
    budget,
    addExpense,
    deleteExpense,
    updateBudget,
    getMonthExpenses,
    getMonthTotal,
    getCategoryTotal,
    getMonthlyTrend,
  }
}
