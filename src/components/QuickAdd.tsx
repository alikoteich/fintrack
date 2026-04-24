import { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Category, CATEGORIES } from '../types'

interface Props {
  onAdd: (amount: number, category: Category, note: string, date: string) => void
}

export default function QuickAdd({ onAdd }: Props) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('food')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [flash, setFlash] = useState(false)
  const amountRef = useRef<HTMLInputElement>(null)

  useEffect(() => { amountRef.current?.focus() }, [])

  const submit = () => {
    const num = parseFloat(amount)
    if (!num || num <= 0) return
    onAdd(num, category, note.trim(), date)
    setAmount('')
    setNote('')
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    amountRef.current?.focus()
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className={`card p-5 transition-all duration-300 ${flash ? 'border-[var(--accent)]' : ''}`}>
      <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Syne' }}>
        Quick Add Expense
      </h2>

      {/* Amount - big and prominent */}
      <div className="relative mb-3">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono" style={{ color: 'var(--accent)' }}>$</span>
        <input
          ref={amountRef}
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          onKeyDown={handleKey}
          placeholder="0.00"
          className="inp text-2xl font-mono pl-10"
          style={{ fontFamily: 'JetBrains Mono', fontSize: '22px' }}
          min="0"
          step="0.01"
        />
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            title={cat.label}
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-all duration-150"
            style={{
              background: category === key ? cat.bg : 'var(--surface2)',
              border: `1px solid ${category === key ? cat.color : 'var(--border)'}`,
              color: category === key ? cat.color : 'var(--muted)',
              fontFamily: 'Syne',
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: '18px' }}>{cat.emoji}</span>
            <span style={{ fontSize: '9px', lineHeight: 1.1, textAlign: 'center' }}>{cat.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Note + Date row */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Note (optional)"
          className="inp flex-1"
          maxLength={60}
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="inp"
          style={{ width: '145px' }}
        />
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!amount || parseFloat(amount) <= 0}
        className="btn-accent w-full py-3 rounded-xl flex items-center justify-center gap-2 text-base disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
      >
        <Plus size={18} />
        Add Expense
      </button>
    </div>
  )
}
