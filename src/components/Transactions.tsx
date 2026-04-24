import { useState } from 'react'
import { Trash2, Search } from 'lucide-react'
import { Expense, Category, CATEGORIES } from '../types'

interface Props {
  expenses: Expense[]
  onDelete: (id: string) => void
}

const fmtDec = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)

const fmtDate = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function Transactions({ expenses, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = expenses.filter(e => {
    const matchCat = filterCat === 'all' || e.category === filterCat
    const matchSearch = !search || e.note.toLowerCase().includes(search.toLowerCase()) ||
      CATEGORIES[e.category].label.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 2500)
    }
  }

  return (
    <div className="space-y-3">
      {/* Search + filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="inp pl-9"
            style={{ paddingTop: '10px', paddingBottom: '10px' }}
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value as Category | 'all')}
          className="inp"
          style={{ width: 'auto', paddingTop: '10px', paddingBottom: '10px' }}
        >
          <option value="all">All categories</option>
          {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([key, cat]) => (
            <option key={key} value={key}>{cat.emoji} {cat.label}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'Syne' }}>
        {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        {filterCat !== 'all' || search ? ' (filtered)' : ''}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center" style={{ color: 'var(--muted)' }}>
          <p style={{ fontSize: 32 }}>💸</p>
          <p style={{ fontFamily: 'Syne', marginTop: 8 }}>No transactions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((expense, i) => {
            const cat = CATEGORIES[expense.category]
            const isConfirm = confirmDelete === expense.id
            return (
              <div
                key={expense.id}
                className="card flex items-center gap-3 p-3 fade-up"
                style={{ animationDelay: `${i * 0.02}s` }}
              >
                {/* Emoji */}
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 40, height: 40, background: cat.bg, fontSize: 18 }}
                >
                  {cat.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 13, fontFamily: 'Syne', fontWeight: 600, color: cat.color }}>
                      {cat.label}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{fmtDate(expense.date)}</span>
                  </div>
                  {expense.note && (
                    <p className="truncate" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>
                      {expense.note}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 15 }}>
                    {fmtDec(expense.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-1.5 rounded-lg transition-all"
                    style={{
                      color: isConfirm ? '#f87171' : 'var(--muted)',
                      background: isConfirm ? 'rgba(248,113,113,0.1)' : 'transparent',
                    }}
                    title={isConfirm ? 'Click again to confirm delete' : 'Delete'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
