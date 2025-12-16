import { useMemo, useState } from 'react'
import {
  AllocationProfile,
  AllocationRatios,
  PROFILE_RATIOS,
  BUCKETS,
  CURRENCY_META,
  CurrencyCode,
  UsageMode,
  UserRole,
} from '../../core/domain/types'
import { useSpendingStore } from '../../core/store/useSpendingStore'

type Props = {
  onDone: () => void
}

const profileLabels: Record<AllocationProfile, string> = {
  personal: 'Cá nhân',
  couple: 'Cặp đôi',
  family: 'Gia đình',
}

export const Onboarding = ({ onDone }: Props) => {
  const initializePlan = useSpendingStore((s) => s.initializePlan)
  const [income, setIncome] = useState<number>(15000000)
  const [profile, setProfile] = useState<AllocationProfile>('personal')
  const [ratios, setRatios] = useState<AllocationRatios>(PROFILE_RATIOS.personal)
  const [currency, setCurrency] = useState<CurrencyCode>('VND')
  const [mode, setMode] = useState<UsageMode>('solo')
  const [role, setRole] = useState<UserRole>('admin')

  const suggested = useMemo(() => PROFILE_RATIOS[profile], [profile])

  const handleRatioChange = (bucketId: keyof AllocationRatios, value: number) => {
    setRatios((prev) => ({ ...prev, [bucketId]: Math.max(0, value) }))
  }

  const handleSubmit = () => {
    if (!income || income <= 0) return
    initializePlan(income, profile, currency, ratios, mode, role)
    onDone()
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Onboarding • 60s</p>
        <h1 className="text-2xl font-bold text-slate-800">Thiết lập hạn mức</h1>
        <p className="text-sm text-slate-600">“Track by limit, not by receipt”</p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">Thu nhập tháng ({CURRENCY_META[currency].label})</span>
        <input
          type="number"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-teal-500 focus:outline-none"
          value={income}
          min={0}
          onChange={(e) => setIncome(Number(e.target.value))}
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(CURRENCY_META) as CurrencyCode[]).map((code) => (
          <button
            key={code}
            onClick={() => setCurrency(code)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              currency === code ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {CURRENCY_META[code].label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(['personal', 'couple', 'family'] as AllocationProfile[]).map((p) => (
          <button
            key={p}
            onClick={() => {
              setProfile(p)
              setRatios(PROFILE_RATIOS[p])
              if (p === 'family') setMode('family')
              if (p === 'couple') setMode('couple')
              if (p === 'personal') setMode('solo')
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              profile === p ? 'bg-teal-600 text-white shadow' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {profileLabels[p]}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-slate-50 p-3">
        <p className="text-xs text-slate-500">Gợi ý tỷ lệ (có thể chỉnh):</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {BUCKETS.map((id) => (
            <label key={id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
              <span className="text-sm capitalize text-slate-700">{id}</span>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-right focus:border-teal-500 focus:outline-none"
                  value={ratios[id]}
                  onChange={(e) => handleRatioChange(id, Number(e.target.value))}
                />
                <span className="text-xs text-slate-500">gợi ý {Math.round(suggested[id] * 100)}%</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-3">
        <p className="text-xs text-slate-500">Chế độ dùng chung</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['solo', 'couple', 'family'] as UsageMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                mode === m ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {m === 'solo' ? 'Một người' : m === 'couple' ? 'Cặp đôi (QR)' : 'Gia đình (vai trò)'}
            </button>
          ))}
        </div>
        {mode === 'family' ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {(['admin', 'member'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  role === r ? 'bg-teal-600 text-white shadow' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {r === 'admin' ? 'Admin (đặt hạn mức)' : 'Member (chỉ thêm chi tiêu)'}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full rounded-2xl bg-teal-600 py-3 text-base font-semibold text-white shadow-lg transition duration-200 hover:bg-teal-500"
      >
        Bắt đầu tracking
      </button>
    </div>
  )
}

