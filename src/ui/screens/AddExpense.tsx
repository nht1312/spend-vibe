import { useEffect, useMemo, useRef, useState } from 'react'
import { BUCKETS, BucketId, formatCurrency } from '../../core/domain/types'
import { useSpendingStore } from '../../core/store/useSpendingStore'
import { getBucketStatus } from '../../core/rules/alerts'

type Props = {
  onSaved?: () => void
  focusTick?: number
}

const bucketShort: Record<BucketId, string> = {
  fixed: 'Fixed',
  controlled: 'Controlled',
  necessary: 'Necessary',
  saving: 'Saving',
  free: 'Free',
}

export const AddExpense = ({ onSaved, focusTick }: Props) => {
  const bucketMap = useSpendingStore((s) => s.buckets)
  const currency = useSpendingStore((s) => s.currency)
  const role = useSpendingStore((s) => s.role)
  const mode = useSpendingStore((s) => s.mode)
  const buckets = useMemo(() => Object.values(bucketMap), [bucketMap])
  const addExpense = useSpendingStore((s) => s.addExpense)
  const freeLocked = useSpendingStore((s) => s.freeLocked)
  const [bucketId, setBucketId] = useState<BucketId>('controlled')
  const [amount, setAmount] = useState<number>(0)
  const [note, setNote] = useState('')
  const [overrideFree, setOverrideFree] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const amountRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    amountRef.current?.focus()
  }, [focusTick])

  const handleSave = () => {
    const selected = buckets.find((b) => b.id === bucketId)
    const remaining = selected ? Math.max(0, selected.limit - selected.spent) : 0

    if (!amount || amount <= 0) {
      setError('Số tiền cần lớn hơn 0.')
      return
    }

    if (bucketId !== 'free' && selected && amount > remaining) {
      setError('Số tiền vượt quá hạn mức còn lại của bucket này. Thử nhập ít hơn một chút.')
      return
    }

    const res = addExpense({ bucketId, amount, note, overrideFree })
    if (!res.ok) {
      if (res.reason === 'free-locked') {
        setError('Quỹ Free đã hết. Nếu muốn vượt trần, bật “Cho phép vượt”.')
      } else {
        setError('Không lưu được. Kiểm tra lại số tiền.')
      }
      return
    }
    setError(null)
    setAmount(0)
    setNote('')
    setOverrideFree(false)
    onSaved?.()
  }

  const selected = buckets.find((b) => b.id === bucketId)
  const status = bucketId === 'free' ? 'safe' : selected ? getBucketStatus(selected) : 'safe'

  const isMemberBlocked = mode === 'family' && role === 'member' && !selected

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">10-second entry</p>
          <h3 className="text-xl font-semibold text-slate-800">Thêm chi tiêu</h3>
        </div>
        <span className="text-sm text-slate-500">
          {selected ? formatCurrency(selected.limit - selected.spent, currency) + ' còn' : ''}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {BUCKETS.map((id) => (
          <button
            key={id}
            onClick={() => setBucketId(id)}
            className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium transition duration-150 ${
              bucketId === id ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <span>{bucketShort[id]}</span>
            <span className="text-xs text-slate-500">
              {formatCurrency(buckets.find((b) => b.id === id)?.limit ?? 0, currency)}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-600">Số tiền</span>
          <input
            type="number"
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-lg font-semibold focus:border-teal-500 focus:outline-none"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSave()
              }
            }}
            ref={amountRef}
          />
          {amount ? (
            <span className="mt-1 text-xs text-slate-500">
              ≈ {formatCurrency(amount, currency)}
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-600">Ghi chú (tuỳ chọn)</span>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base focus:border-teal-500 focus:outline-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ví dụ: cafe, xem phim..."
          />
        </label>

        {bucketId === 'free' ? (
          <div className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
            <p>Guilt-Free mode</p>
            <label className="mt-1 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={overrideFree}
                onChange={(e) => setOverrideFree(e.target.checked)}
                className="h-4 w-4 accent-amber-600"
              />
              Cho phép vượt Free lần này (soft lock hiện tại {freeLocked ? 'đang bật' : 'chưa bật'})
            </label>
          </div>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>

      <button
        onClick={handleSave}
        disabled={isMemberBlocked}
        className="mt-4 w-full rounded-2xl bg-slate-900 py-3 text-base font-semibold text-white shadow-lg transition duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isMemberBlocked ? 'Chỉ admin mới chỉnh hạn mức' : 'Lưu'}
        {bucketId !== 'free' && status === 'warn' ? ' (cẩn thận gần trần)' : bucketId !== 'free' && status === 'over' ? ' (đang vượt)' : ''}
      </button>
    </div>
  )
}

