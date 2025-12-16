import { useMemo } from 'react'
import { useSpendingStore } from '../../core/store/useSpendingStore'
import { PLAYBOOKS } from '../../core/rules/playbooks'
import { DecisionWindowId, PlaybookId } from '../../core/domain/types'

const windowLabels: Record<DecisionWindowId, string> = {
  salary_increase: 'Tăng lương',
  bonus: 'Thưởng',
  large_purchase: 'Mua món lớn',
  life_event: 'Sự kiện gia đình',
}

export const PlaybookSelector = () => {
  const playbookId = useSpendingStore((s) => s.playbookId)
  const setPlaybook = useSpendingStore((s) => s.setPlaybook)
  const decisionWindows = useSpendingStore((s) => s.decisionWindows)
  const toggleDecisionWindow = useSpendingStore((s) => s.toggleDecisionWindow)

  const activeTone = useMemo(() => {
    const pb = PLAYBOOKS.find((p) => p.id === playbookId)
    if (!pb) return 'gentle'
    if (pb.tone === 'stretch') return 'Giọng nhắc nhẹ để cả nhà giữ mục tiêu lớn.'
    if (pb.tone === 'focus') return 'Giọng tập trung, tránh xao nhãng chi tiêu chung.'
    return 'Giọng nhẹ nhàng, duy trì nhịp hiện tại.'
  }, [playbookId])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Playbook</p>
      <p className="text-sm text-slate-700">Chọn bối cảnh tài chính chung hiện tại (chỉ 1 playbook).</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {PLAYBOOKS.map((pb) => (
          <button
            key={pb.id}
            onClick={() => setPlaybook(pb.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              playbookId === pb.id ? 'bg-slate-900 text-white shadow' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {pb.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">Decision windows (chỉ bật khi cần, để cả nhà cùng lưu ý):</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {(Object.keys(windowLabels) as DecisionWindowId[]).map((id) => {
          const active = decisionWindows.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggleDecisionWindow(id)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                active ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {windowLabels[id]}
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-xs text-slate-600">{activeTone}</p>
      {decisionWindows.length ? (
        <p className="mt-1 text-[11px] text-slate-500">
          Các cửa sổ quyết định đang bật: {decisionWindows.map((w) => windowLabels[w]).join(' • ')}
        </p>
      ) : null}
    </div>
  )
}


