export type Category =
  | 'food'
  | 'rent'
  | 'transport'
  | 'subscriptions'
  | 'going_out'
  | 'gym'
  | 'shopping'
  | 'health'
  | 'savings'
  | 'other'

export interface Expense {
  id: string
  amount: number
  category: Category
  note: string
  date: string // ISO date string YYYY-MM-DD
  createdAt: number // timestamp
}

export interface Budget {
  [key: string]: number // category -> monthly limit
}

export interface MonthlyData {
  month: string // YYYY-MM
  expenses: Expense[]
}

export const CATEGORIES: Record<Category, { label: string; emoji: string; color: string; bg: string }> = {
  food:          { label: 'Food & Drinks',   emoji: '🍔', color: '#f97316', bg: '#2a1500' },
  rent:          { label: 'Rent & Bills',    emoji: '🏠', color: '#60a5fa', bg: '#0a1f2e' },
  transport:     { label: 'Transport',       emoji: '🚗', color: '#a78bfa', bg: '#1a0f2e' },
  subscriptions: { label: 'Subscriptions',   emoji: '📱', color: '#34d399', bg: '#0a2218' },
  going_out:     { label: 'Going Out',       emoji: '🎉', color: '#f472b6', bg: '#2e0a1f' },
  gym:           { label: 'Gym & Sport',     emoji: '💪', color: '#C8F135', bg: '#1a2500' },
  shopping:      { label: 'Shopping',        emoji: '🛍️', color: '#fbbf24', bg: '#2e1f00' },
  health:        { label: 'Health',          emoji: '💊', color: '#f87171', bg: '#2e0a0a' },
  savings:       { label: 'Savings',         emoji: '💰', color: '#4ade80', bg: '#0a2e15' },
  other:         { label: 'Other',           emoji: '📦', color: '#94a3b8', bg: '#1a1f26' },
}

export const DEFAULT_BUDGETS: Budget = {
  food: 300,
  rent: 800,
  transport: 150,
  subscriptions: 50,
  going_out: 200,
  gym: 60,
  shopping: 150,
  health: 80,
  savings: 300,
  other: 100,
}
