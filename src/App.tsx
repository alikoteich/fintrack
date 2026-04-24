import { useState, useMemo } from 'react'
import { LayoutDashboard, List, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFinance } from './hooks/useFinance'
import QuickAdd from './components/QuickAdd'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import BudgetSettings from './components/BudgetSettings'

type Tab = 'dashboard' | 'transactions' | 'budget'

function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function offsetMonth(base: string, delta: number): string {
  const [y, m] = base.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(month: string) {
  return new Date(month + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })
}

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth)
  const finance = useFinance()

  const thisMonth = getCurrentMonth()
  const isCurrentMonth = selectedMonth === thisMonth

  const monthExpenses = useMemo(
    () => finance.getMonthExpenses(selectedMonth),
    [finance.getMonthExpenses, selectedMonth]
  )

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'budget', label: 'Budget', icon: Settings },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30,
                background: 'var(--accent)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color: '#0a0a0a',
                fontFamily: 'Syne',
              }}>F</div>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
                FinTrack
              </span>
            </div>

            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setSelectedMonth(m => offsetMonth(m, -1))}
                style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '4px 8px', color: 'var(--muted)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 13, minWidth: 130, textAlign: 'center' }}>
                {monthLabel(selectedMonth)}
                {isCurrentMonth && (
                  <span style={{
                    marginLeft: 6, fontSize: 9, background: 'rgba(200,241,53,0.15)',
                    color: 'var(--accent)', padding: '2px 6px', borderRadius: 4, fontFamily: 'Syne', fontWeight: 700,
                  }}>NOW</span>
                )}
              </span>
              <button
                onClick={() => setSelectedMonth(m => offsetMonth(m, 1))}
                disabled={isCurrentMonth}
                style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '4px 8px', color: isCurrentMonth ? '#333' : 'var(--muted)',
                  cursor: isCurrentMonth ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Nav tabs */}
            <nav style={{ display: 'flex', gap: 4 }}>
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`tab ${tab === id ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Left: QuickAdd always visible */}
          <div>
            <QuickAdd onAdd={finance.addExpense} />
          </div>

          {/* Right: tab content */}
          <div key={tab + selectedMonth} className="fade-up">
            {tab === 'dashboard' && (
              <Dashboard
                monthExpenses={monthExpenses}
                budget={finance.budget}
                getMonthlyTrend={finance.getMonthlyTrend}
                currentMonth={selectedMonth}
              />
            )}
            {tab === 'transactions' && (
              <Transactions
                expenses={monthExpenses}
                onDelete={finance.deleteExpense}
              />
            )}
            {tab === 'budget' && (
              <BudgetSettings
                budget={finance.budget}
                onUpdate={finance.updateBudget}
                monthExpenses={monthExpenses}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
