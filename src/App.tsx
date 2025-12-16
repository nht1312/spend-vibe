import { useEffect, useState } from 'react'
import { Home } from './ui/screens/Home'
import { AddExpense } from './ui/screens/AddExpense'
import { WeeklyPulse } from './ui/screens/WeeklyPulse'
import { Onboarding } from './ui/screens/Onboarding'
import { useSpendingStore } from './core/store/useSpendingStore'
import { useAutoTheme } from './ui/theme'
import { MonthlySnapshot } from './ui/screens/MonthlySnapshot'
import { SyncPanel } from './ui/components/SyncPanel'

type Tab = 'home' | 'add' | 'weekly' | 'snapshot'

const TabButton = ({ tab, current, label, onClick }: { tab: Tab; current: Tab; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition duration-150 ${
      current === tab ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 border border-slate-200'
    }`}
  >
    {label}
  </button>
)

function App() {
  useAutoTheme()
  const income = useSpendingStore((s) => s.income)
  const profile = useSpendingStore((s) => s.profile)
  const ensureMonth = useSpendingStore((s) => s.ensureMonth)
  const lastExpenseAt = useSpendingStore((s) => s.lastExpenseAt)
  const role = useSpendingStore((s) => s.role)
  const mode = useSpendingStore((s) => s.mode)
  const setRole = useSpendingStore((s) => s.setRole)
  const calmMode = useSpendingStore((s) => s.calmMode)
  const setCalmMode = useSpendingStore((s) => s.setCalmMode)
  const [tab, setTab] = useState<Tab>('home')
  const [focusTick, setFocusTick] = useState(0)
  const [banner, setBanner] = useState<string | null>(null)
  const [nudge, setNudge] = useState<string | null>(null)

  useEffect(() => {
    const res = ensureMonth()
    if (res.reset) {
      setBanner('New month started. Everything is refreshed 🌱')
    }
  }, [ensureMonth])

  useEffect(() => {
    if (!lastExpenseAt) return
    const days =
      (Date.now() - lastExpenseAt) / (1000 * 60 * 60 * 24)
    if (days >= 3) {
      const rounded = Math.floor(days)
      if (!calmMode) setNudge(`${rounded} ngày rồi mình chưa ghi chi tiêu chung. Có ổn không?`)
    }
  }, [lastExpenseAt, calmMode])

  if (!income || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <Onboarding onDone={() => setTab('home')} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        {banner && !calmMode ? (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm">
            {banner}
          </div>
        ) : null}
        {nudge ? (
          <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-50 shadow-sm">
            <p>{nudge}</p>
            <div className="flex gap-2">
              <button
                className="rounded-full bg-slate-700 px-3 py-1 text-xs font-medium"
                onClick={() => setNudge(null)}
              >
                Ổn, bỏ qua
              </button>
              <button
                className="rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-slate-900"
                onClick={() => {
                  setNudge(null)
                  setTab('add')
                  setFocusTick((t) => t + 1)
                }}
              >
                Ghi nhanh
              </button>
            </div>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Spend Vibe</p>
            <h1 className="text-2xl font-bold text-slate-900">Weekly awareness beats daily obsession</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-full bg-white/80 p-1 shadow-sm backdrop-blur">
          {!calmMode && <TabButton tab="home" current={tab} label="Home" onClick={() => setTab('home')} />}
          <TabButton tab="add" current={tab} label="Add" onClick={() => setTab('add')} />
          <TabButton tab="weekly" current={tab} label="Weekly" onClick={() => setTab('weekly')} />
          {!calmMode && <TabButton tab="snapshot" current={tab} label="Snapshot" onClick={() => setTab('snapshot')} />}
          <button
            onClick={() => {
              const next = !calmMode
              setCalmMode(next)
              if (next) setTab('weekly')
            }}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              calmMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {calmMode ? 'Calm Mode: On' : 'Calm Mode: Off'}
          </button>
        </div>

        {tab === 'home' && !calmMode && <Home onAddExpense={() => setTab('add')} />}
        {tab === 'add' && <AddExpense onSaved={() => setTab(calmMode ? 'weekly' : 'home')} focusTick={focusTick} />}
        {tab === 'weekly' && <WeeklyPulse />}
        {tab === 'snapshot' && !calmMode && <MonthlySnapshot />}
        {mode !== 'solo' && !calmMode && <SyncPanel />}
      </div>

      <button
        onClick={() => {
          setTab('add')
          setFocusTick((t) => t + 1)
        }}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-2xl font-bold text-white shadow-xl transition duration-150 hover:scale-105"
        aria-label="Thêm chi tiêu nhanh"
      >
        +
      </button>

      {mode === 'family' && !calmMode ? (
        <div className="fixed bottom-6 left-6 rounded-full bg-white/90 px-3 py-2 text-xs shadow-sm">
          <span className="text-slate-700">Vai trò: {role === 'admin' ? 'Admin' : 'Member'}</span>
          <button
            className="ml-2 rounded-full bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white"
            onClick={() => setRole(role === 'admin' ? 'member' : 'admin')}
          >
            Đổi
          </button>
        </div>
      ) : null}
    </main>
  )
}

export default App

