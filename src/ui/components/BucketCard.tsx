import clsx from 'clsx'
import { Bucket, formatCurrency } from '../../core/domain/types'
import { useSpendingStore } from '../../core/store/useSpendingStore'
import { getBucketStatus, statusTone } from '../../core/rules/alerts'
import { ProgressRing } from './ProgressRing'

type Props = {
  bucket: Bucket
}

const bucketLabels: Record<Bucket['id'], string> = {
  fixed: 'Fixed • Cố định',
  controlled: 'Controlled • Kiểm soát',
  necessary: 'Necessary • Thiết yếu',
  saving: 'Saving • Tiết kiệm',
  free: 'Free • Thoải mái',
}

export const BucketCard = ({ bucket }: Props) => {
  const currency = useSpendingStore((s) => s.currency)
  const status = getBucketStatus(bucket)
  const tone = statusTone(status)
  const progress = bucket.limit === 0 ? 0 : bucket.spent / bucket.limit
  const remaining = Math.max(0, bucket.limit - bucket.spent)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <ProgressRing progress={progress} tone={tone as any} label="" size={84} />
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-slate-700">{bucketLabels[bucket.id]}</p>
          <p className="text-xs text-slate-500">Hạn mức: {formatCurrency(bucket.limit, currency)}</p>
          <p className={clsx('text-sm font-medium', tone === 'alert' && 'text-red-600', tone === 'warn' && 'text-amber-600')}>
            Đã dùng {formatCurrency(bucket.spent, currency)}
          </p>
          <p className="text-xs text-slate-500">Còn: {formatCurrency(remaining, currency)}</p>
        </div>
      </div>
    </div>
  )
}

