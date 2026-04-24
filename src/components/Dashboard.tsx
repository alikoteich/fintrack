import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Category, CATEGORIES, Budget } from '../types'
import { Expense } from '../types'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts'

interface Props {
  monthExpenses: Expense[]
  budget: Budget
  getMonthlyTrend: (n?: number) => { month: string; label: string; total: number }[]
  currentMonth: string
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)

const fmtDec = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

export default function Dashboard({ monthExpenses, budget, getMonthlyTrend, currentMonth }: Props) {
  const trend = getMonthlyTrend(6)
  const total = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const totalBudget = Object.values(budget).reduce((s, v) => s + v, 0)
  const remaining = totalBudget - total
  const pct = Math.min((total / totalBudget) * 100, 100)

  // Category breakdown
  const catData = useMemo(() => {
    const map: Record<string, number> = {}
    monthExpenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount
    })
    return (Object.entries(map) as [Category, number][])
      .map(([cat, amount]) => ({ cat, amount, ...CATEGORIES[cat] }))
      .sort((a, b) => b.amount - a.amount)
  }, [monthExpenses])

  // Pie data
  const pieData = catData.map(d => ({ name: d.label, value: d.amount, color: d.color }))

  // Month over month
  const prevTotal = trend[trend.length - 2]?.total ?? 0
  const diff = total - prevTotal
  const diffPct = prevTotal > 0 ? ((diff / prevTotal) * 100).toFixed(1) : null

  const monthLabel = new Date(currentMonth + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-4">
      {/* Hero stats */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total spent */}
        <div className="card p-4 col-span-1">
          <p className="text-xs mb-1" style={{ color: 'var(--muted)', fontFamily: 'Syne' }}>SPENT THIS MONTH</p>
          <p className="text-3xl font-bold mono" style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent)' }}>
            {fmt(total)}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{monthLabel}</p>
        </div>

        {/* Remaining */}
        <div className="card p-4 col-span-1">
          <p className="text-xs mb-1" style={{ color: 'var(--muted)', fontFamily: 'Syne' }}>REMAINING</p>
          <p className="text-3xl font-bold mono" style={{
            fontFamily: 'JetBrains Mono',
            color: remaining >= 0 ? '#4ade80' : '#f87171'
          }}>
            {fmt(Math.abs(remaining))}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {remaining >= 0 ? 'under budget' : 'over budget'}
          </p>
        </div>

        {/* vs last month */}
        <div className="card p-4 col-span-1">
          <p className="text-xs mb-1" style={{ color: 'var(--muted)', fontFamily: 'Syne' }}>VS LAST MONTH</p>
          <div className="flex items-center gap-2 mt-1">
            {diff === 0 || !diffPct ? (
              <Minus size={20} style={{ color: 'var(--muted)' }} />
            ) : diff > 0 ? (
              <TrendingUp size={20} style={{ color: '#f87171' }} />
            ) : (
              <TrendingDown size={20} style={{ color: '#4ade80' }} />
            )}
            <p className="text-2xl font-bold mono" style={{
              fontFamily: 'JetBrains Mono',
              color: !diffPct ? 'var(--muted)' : diff > 0 ? '#f87171' : '#4ade80'
            }}>
              {diffPct ? `${Math.abs(Number(diffPct))}%` : '—'}
            </p>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {diff > 0 ? `+${fmt(diff)} more` : diff < 0 ? `${fmt(Math.abs(diff))} less` : 'no data yet'}
          </p>
        </div>
      </div>

      {/* Budget progress */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-bold" style={{ fontFamily: 'Syne' }}>Monthly Budget</p>
          <p className="text-sm mono" style={{ fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>
            {fmtDec(total)} / {fmt(totalBudget)}
          </p>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${pct}%`,
              background: pct > 90 ? '#f87171' : pct > 75 ? '#fbbf24' : 'var(--accent)',
            }}
          />
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{pct.toFixed(1)}% used</p>
      </div>

      {/* Trend bar chart */}
      <div className="card p-4">
        <p className="text-sm font-bold mb-3" style={{ fontFamily: 'Syne' }}>6-Month Spending</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={trend} barSize={28}>
            <XAxis dataKey="label" tick={{ fill: '#666', fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              formatter={(v: number) => [fmtDec(v), 'Spent']}
              contentStyle={{ background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 12 }}
              labelStyle={{ color: '#C8F135', fontFamily: 'Syne' }}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {trend.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.month === currentMonth ? '#C8F135' : '#2a2a2a'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two columns: pie + category list */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pie */}
        <div className="card p-4">
          <p className="text-sm font-bold mb-2" style={{ fontFamily: 'Syne' }}>By Category</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => [fmtDec(v)]}
                  contentStyle={{ background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center" style={{ color: 'var(--muted)', fontSize: 13 }}>
              No data yet
            </div>
          )}
        </div>

        {/* Category list */}
        <div className="card p-4">
          <p className="text-sm font-bold mb-2" style={{ fontFamily: 'Syne' }}>Top Categories</p>
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 180 }}>
            {catData.slice(0, 6).map(({ cat, amount, label, emoji, color, bg }) => {
              const budgetLimit = budget[cat] || 0
              const catPct = budgetLimit > 0 ? Math.min((amount / budgetLimit) * 100, 100) : 0
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 13 }}>{emoji}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'Syne' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color }}>{fmtDec(amount)}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${catPct}%`, background: color }} />
                  </div>
                </div>
              )
            })}
            {catData.length === 0 && (
              <p style={{ color: 'var(--muted)', fontSize: 12 }}>Add expenses to see breakdown</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
