import { useMemo } from 'react'
import { useSpendingStore } from '../../core/store/useSpendingStore'
import { computeEmergencyReadiness } from '../../core/rules/emergency'

export const EmergencyReadinessCard = () => {
  const buckets = useSpendingStore((s) => s.buckets)
  const history = useSpendingStore((s) => s.snapshotHistory)

  const fixed = buckets.fixed ?? null
  const ers = useMemo(() => computeEmergencyReadiness({ fixedBucket: fixed ?? null, history }), [fixed, history])

  if (!ers) return null

  const toneClasses =
    ers.status === 'strong'
      ? 'bg-emerald-50 text-emerald-800'
      : ers.status === 'safe'
        ? 'bg-sky-50 text-sky-800'
        : 'bg-amber-50 text-amber-800'

  const label =
    ers.status === 'strong' ? 'Strong' : ers.status === 'safe' ? 'Safe' : 'Risk'

  const extraSentence =
    ers.status === 'risk'
      ? 'Vùng đệm hiện tại hơi mỏng. Khi có điều kiện, chúng ta để ý thêm một chút.'
      : ''

  return (
    <div className={`mt-4 rounded-2xl px-4 py-3 text-sm shadow-sm ${toneClasses}`}>
      <p className="text-xs uppercase tracking-[0.2em] opacity-70">Emergency readiness</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold leading-none">{ers.months}</span>
        <span className="text-sm">tháng có thể sống nếu không có thu nhập</span>
      </div>
      <p className="mt-1 text-xs">
        Trạng thái: <span className="font-semibold">{label}</span>
      </p>
      <p className="mt-1 text-xs text-opacity-80">
        Dựa trên chi cố định hàng tháng và số tiền đã tiết kiệm ước tính trong các tháng trước của chúng ta.
      </p>
      {extraSentence ? <p className="mt-1 text-xs">{extraSentence}</p> : null}
    </div>
  )
}


