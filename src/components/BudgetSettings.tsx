import { useState } from 'react'
import { Check } from 'lucide-react'
import { Category, CATEGORIES, Budget } from '../types'

interface Props {
  budget: Budget
  onUpdate: (category: Category, limit: number) => void
  monthExpenses: { category: string; amount: number }[]
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)

export default function BudgetSettings({ budget, onUpdate, monthExpenses }: Props) {
  const [saved, setSaved] = useState<Category | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const getCatSpent = (cat: Category) =>
    monthExpenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0)

  const handleSave = (cat: Category) => {
    const val = parseFloat(drafts[cat] ?? String(budget[cat] ?? 0))
    if (!isNaN(val) && val >= 0) {
      onUpdate(cat, val)
      setSaved(cat)
      setTimeout(() => setSaved(null), 1500)
    }
  }

  const totalBudget = Object.values(budget).reduce((s, v) => s + v, 0)
  const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="card p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--muted)', fontFamily: 'Syne' }}>TOTAL MONTHLY BUDGET</p>
            <p className="text-2xl font-bold mono" style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent)' }}>
              {fmt(totalBudget)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs mb-1" style={{ color: 'var(--muted)', fontFamily: 'Syne' }}>SPENT SO FAR</p>
            <p className="text-2xl font-bold mono" style={{
              fontFamily: 'JetBrains Mono',
              color: totalSpent > totalBudget ? '#f87171' : '#f0f0f0'
            }}>
              {fmt(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      {/* Category budgets */}
      <div className="space-y-2">
        {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([cat, info]) => {
          const limit = budget[cat] ?? 0
          const spent = getCatSpent(cat)
          const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
          const over = spent > limit && limit > 0
          const draftVal = drafts[cat] ?? String(limit)

          return (
            <div key={cat} className="card p-4">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 40, height: 40, background: info.bg, fontSize: 18 }}
                >
                  {info.emoji}
                </div>

                {/* Label + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span style={{ fontSize: 13, fontFamily: 'Syne', fontWeight: 600, color: info.color }}>
                      {info.label}
                    </span>
                    <span style={{ fontSize: 11, color: over ? '#f87171' : 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                      {fmt(spent)} / {fmt(limit)}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: over ? '#f87171' : pct > 75 ? '#fbbf24' : info.color,
                      }}
                    />
                  </div>
                </div>

                {/* Budget input */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--muted)' }}>$</span>
                    <input
                      type="number"
                      value={draftVal}
                      onChange={e => setDrafts(d => ({ ...d, [cat]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleSave(cat)}
                      className="inp text-right"
                      style={{ width: 90, paddingLeft: 20, paddingTop: 8, paddingBottom: 8, fontSize: 13, fontFamily: 'JetBrains Mono' }}
                      min="0"
                    />
                  </div>
                  <button
                    onClick={() => handleSave(cat)}
                    className="flex items-center justify-center rounded-lg transition-all"
                    style={{
                      width: 32, height: 32,
                      background: saved === cat ? 'rgba(200,241,53,0.15)' : 'var(--surface2)',
                      border: `1px solid ${saved === cat ? 'var(--accent)' : 'var(--border)'}`,
                      color: saved === cat ? 'var(--accent)' : 'var(--muted)',
                    }}
                    title="Save"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
