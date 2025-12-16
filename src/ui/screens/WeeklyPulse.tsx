import { useMemo } from 'react'
import { getWeeklyInsight } from '../../core/rules/alerts'
import { useSpendingStore } from '../../core/store/useSpendingStore'
import { TimeBreakdown } from '../components/TimeBreakdown'

export const WeeklyPulse = () => {
  const bucketMap = useSpendingStore((s) => s.buckets)
  const buckets = useMemo(() => Object.values(bucketMap), [bucketMap])
  const insight = useMemo(() => getWeeklyInsight(buckets), [buckets])

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Weekly pulse</p>
          <h3 className="text-xl font-semibold text-slate-800">Nhịp chi chung tuần này</h3>
          <p className="text-sm text-slate-500">Cùng giữ nhịp, không soi từng người.</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 shadow-sm">
        <p className="text-sm text-slate-700">{insight.message}</p>
      </div>

      <TimeBreakdown />
    </div>
  )
}

