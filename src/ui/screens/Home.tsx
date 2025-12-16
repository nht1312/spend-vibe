import { useMemo } from 'react'
import { BucketCard } from '../components/BucketCard'
import { useSpendingStore } from '../../core/store/useSpendingStore'
import { formatCurrency } from '../../core/domain/types'
import { getSpendingVelocity } from '../../core/rules/velocity'

type Props = {
  onAddExpense: () => void
}

export const Home = ({ onAddExpense }: Props) => {
  const bucketMap = useSpendingStore((s) => s.buckets)
  const currency = useSpendingStore((s) => s.currency)
  const calmMode = useSpendingStore((s) => s.calmMode)
  const buckets = useMemo(() => Object.values(bucketMap), [bucketMap])

  const totalLimit = useMemo(() => buckets.reduce((sum, b) => sum + b.limit, 0), [buckets])
  const spent = useMemo(() => buckets.reduce((sum, b) => sum + b.spent, 0), [buckets])
  const totalRemaining = useMemo(
    () => buckets.reduce((acc, bucket) => acc + Math.max(0, bucket.limit - bucket.spent), 0),
    [buckets],
  )
  const velocity = getSpendingVelocity(buckets)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-white shadow-lg">
        <p className="text-sm opacity-80">Financial Pulse</p>
        <h2 className="mt-1 text-3xl font-bold">{formatCurrency(totalRemaining, currency)} còn lại</h2>
        <p className="text-sm opacity-80">
          Đã dùng {formatCurrency(spent, currency)} / {formatCurrency(totalLimit, currency)}
        </p>
        {!calmMode && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            <span
              className={
                velocity.status === 'on_track'
                  ? 'h-2 w-2 rounded-full bg-emerald-300'
                  : velocity.status === 'fast'
                    ? 'h-2 w-2 rounded-full bg-amber-300'
                    : 'h-2 w-2 rounded-full bg-red-300'
              }
            />
            <span>
              {velocity.status === 'on_track'
                ? 'Nhịp chi đang rất ổn.'
                : velocity.status === 'fast'
                  ? 'Đang chi hơi nhanh hơn nhịp tháng.'
                  : 'Tốc độ chi hơi quá tay rồi 👀'}
            </span>
          </div>
        )}
        <button
          onClick={onAddExpense}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-teal-700 shadow-sm transition duration-200 hover:bg-white"
        >
          + Thêm chi tiêu (≤10s)
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {buckets.map((bucket) => (
          <BucketCard key={bucket.id} bucket={bucket} />
        ))}
      </div>
    </div>
  )
}

