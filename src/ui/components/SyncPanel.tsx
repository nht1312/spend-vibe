import { useState } from 'react'
import { useSpendingStore } from '../../core/store/useSpendingStore'

// Light UX for QR/text sync: copy payload to generate QR elsewhere, paste scanned data to import.
export const SyncPanel = () => {
  const exportSyncPayload = useSpendingStore((s) => s.exportSyncPayload)
  const importSyncPayload = useSpendingStore((s) => s.importSyncPayload)
  const mode = useSpendingStore((s) => s.mode)
  const [shareData, setShareData] = useState('')
  const [incoming, setIncoming] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const handleExport = () => {
    const data = exportSyncPayload()
    setShareData(data)
    setMessage('Đã tạo mã chia sẻ. Dùng app QR bất kỳ để tạo/scan.')
  }

  const handleImport = () => {
    const res = importSyncPayload(incoming)
    if (!res.ok) {
      const reason =
        res.reason === 'stale'
          ? 'Dữ liệu nhận cũ hơn dữ liệu hiện tại.'
          : res.reason === 'parse'
            ? 'Không đọc được mã. Thử lại nhé.'
            : 'Không thể đồng bộ.'
      setMessage(reason)
      return
    }
    setMessage('Đã đồng bộ xong. Dữ liệu mới nhất đang được dùng.')
  }

  if (mode === 'solo') return null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Chia sẻ nhanh</p>
          <p className="text-sm text-slate-700">
            {mode === 'couple'
              ? 'QR Sync cho cặp đôi – last-write-wins.'
              : 'Gia đình: minh bạch, không kiểm soát.'}
          </p>
        </div>
        <button
          onClick={handleExport}
          className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
        >
          Tạo mã chia sẻ
        </button>
      </div>

      {shareData ? (
        <div className="mt-3">
          <p className="text-xs text-slate-500">Mã để tạo QR / copy:</p>
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs font-mono text-slate-700"
            rows={3}
            value={shareData}
            readOnly
          />
        </div>
      ) : null}

      <div className="mt-3">
        <p className="text-xs text-slate-500">Dán dữ liệu đã scan từ QR:</p>
        <textarea
          className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs font-mono text-slate-700"
          rows={3}
          value={incoming}
          onChange={(e) => setIncoming(e.target.value)}
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleImport}
            className="rounded-full bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            Đồng bộ ngay
          </button>
          <button
            onClick={() => {
              setIncoming('')
              setMessage(null)
            }}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
          >
            Xóa nội dung
          </button>
        </div>
      </div>

      {message ? <p className="mt-2 text-xs text-slate-600">{message}</p> : null}
    </div>
  )
}

