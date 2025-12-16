import { useMemo, useState } from 'react'
import { useSpendingStore } from '../../core/store/useSpendingStore'
import { formatCurrency } from '../../core/domain/types'

const weekLabel = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4']

export const TimeBreakdown = () => {
  const expenses = useSpendingStore((s) => s.expenses)
  const currency = useSpendingStore((s) => s.currency)
  const [open, setOpen] = useState(false)

  const weeks = useMemo(() => {
    const totals = [0, 0, 0, 0]
    expenses.forEach((e) => {
      const d = new Date(e.createdAt)
      const day = d.getDate()
      const index = Math.min(3, Math.floor((day - 1) / 7))
      totals[index] += e.amount
    })
    const max = Math.max(...totals, 1)
    return totals.map((v, i) => ({
      label: weekLabel[i],
      value: v,
      pct: Math.round((v / max) * 100),
    }))
  }, [expenses])

  if (!open) {
    return (
      <button
        className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
        onClick={() => setOpen(true)}
      >
        Xem breakdown theo tuần (ẩn mặc định)
      </button>
    )
  }

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-white/85 p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Breakdown theo tuần</p>
        <button
          onClick={() => setOpen(false)}
          className="text-xs font-medium text-slate-500 underline underline-offset-4"
        >
          Ẩn
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {weeks.map((w) => (
          <div key={w.label}>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{w.label}</span>
              <span>{formatCurrency(w.value, currency)}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-900 transition-all duration-200"
                style={{ width: `${w.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">Chỉ để nhận biết nhịp tuần, không cần soi từng ngày.</p>
    </div>
  )
}


