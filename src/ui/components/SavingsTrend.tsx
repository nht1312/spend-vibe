import { useMemo, useState } from 'react'
import { useSpendingStore } from '../../core/store/useSpendingStore'
import { computeSavingsTrend } from '../../core/rules/savingsTrend'

export const SavingsTrend = () => {
  const history = useSpendingStore((s) => s.snapshotHistory)
  const [open, setOpen] = useState(false)

  const trend = useMemo(() => computeSavingsTrend(history), [history])

  if (!history.length) {
    return null
  }

  const overallLabel =
    trend.overall === 'improving'
      ? 'Đang cải thiện đều – bạn đang tiết kiệm tốt hơn theo thời gian.'
      : trend.overall === 'declining'
        ? 'Tỉ lệ tiết kiệm đang giảm nhẹ. Chỉ cần điều chỉnh một chút là sẽ cân lại.'
        : 'Tỉ lệ tiết kiệm khá ổn định. Duy trì nhịp hiện tại là đủ.'

  const detailSentence =
    trend.last3 === trend.last6
      ? trend.last3 === 'improving'
        ? 'Trong 3–6 tháng gần đây, tỉ lệ tiết kiệm đều đi lên.'
        : trend.last3 === 'declining'
          ? 'Trong 3–6 tháng gần đây, tỉ lệ tiết kiệm hơi đi xuống.'
          : 'Trong 3–6 tháng gần đây, tỉ lệ tiết kiệm giữ ở mức ổn định.'
      : 'Nhịp tiết kiệm có dao động nhẹ giữa các tháng, nhưng vẫn trong vùng kiểm soát.'

  if (!open) {
    return (
      <button
        className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
        onClick={() => setOpen(true)}
      >
        Xem xu hướng tiết kiệm (Trend)
      </button>
    )
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white/85 p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              trend.overall === 'improving'
                ? 'bg-emerald-400'
                : trend.overall === 'declining'
                  ? 'bg-amber-400'
                  : 'bg-slate-400'
            }`}
          />
          <p className="text-sm font-semibold text-slate-700">Savings trend</p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-xs font-medium text-slate-500 underline underline-offset-4"
        >
          Đóng
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-700">{overallLabel}</p>
      <p className="mt-1 text-xs text-slate-500">
        {detailSentence}
      </p>
    </div>
  )
}


