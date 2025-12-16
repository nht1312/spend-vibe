import { useMemo } from 'react'
import { useSpendingStore } from '../../core/store/useSpendingStore'
import { formatCurrency } from '../../core/domain/types'
import { exportBackupJson, exportSnapshotPdf } from '../../core/utils/exporters'
import { SavingsTrend } from '../components/SavingsTrend'
import { EmergencyReadinessCard } from '../components/EmergencyReadinessCard'
import { PlaybookSelector } from '../components/PlaybookSelector'

export const MonthlySnapshot = () => {
  const snapshot = useSpendingStore((s) => s.lastSnapshot)
  const currency = useSpendingStore((s) => s.currency)
  const exportSyncPayload = useSpendingStore((s) => s.exportSyncPayload)

  const currencyFormatter = useMemo(() => (v: number) => formatCurrency(v, currency), [currency])

  if (!snapshot) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Monthly snapshot</p>
        <h3 className="text-xl font-semibold text-slate-800">Chưa có dữ liệu tháng trước</h3>
        <p className="text-sm text-slate-600">Khi sang tháng mới, chúng tôi sẽ lưu lại số liệu và làm mới hạn mức.</p>
      </div>
    )
  }

  const savingPercent = Math.round(snapshot.savingRatio * 100)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Monthly snapshot</p>
          <h3 className="text-xl font-semibold text-slate-800">Tháng {snapshot.month}</h3>
          <p className="text-sm text-slate-600">Chỉ xem, không chỉnh sửa.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Thu nhập</p>
          <p className="text-xl font-semibold text-slate-800">{formatCurrency(snapshot.income, currency)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Đã chi</p>
          <p className="text-xl font-semibold text-slate-800">{formatCurrency(snapshot.totalSpent, currency)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Tiết kiệm (tỷ lệ)</p>
          <p className="text-xl font-semibold text-slate-800">{savingPercent}%</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Buckets</p>
          <p className="text-sm text-slate-700">
            {snapshot.buckets
              .map((b) => `${b.id}: ${formatCurrency(b.spent, currency)} / ${formatCurrency(b.limit, currency)}`)
              .join(' • ')}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => exportSnapshotPdf(snapshot, currencyFormatter)}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm"
        >
          Xuất snapshot (PDF 1 trang)
        </button>
        <button
          onClick={() => exportBackupJson(exportSyncPayload())}
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200"
        >
          Tải backup JSON
        </button>
      </div>

      <SavingsTrend />
      <PlaybookSelector />
      <EmergencyReadinessCard />
    </div>
  )
}

