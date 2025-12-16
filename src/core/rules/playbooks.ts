import { AllocationRatios, PlaybookId } from '../domain/types'

type PlaybookConfig = {
  id: PlaybookId
  label: string
  ratios: AllocationRatios
  tone: 'gentle' | 'focus' | 'stretch'
}

// Rule-based, non-AI playbooks.
export const PLAYBOOKS: PlaybookConfig[] = [
  {
    id: 'none',
    label: 'Giữ nguyên (balanced)',
    ratios: { fixed: 0.35, controlled: 0.2, necessary: 0.2, saving: 0.2, free: 0.05 },
    tone: 'gentle',
  },
  {
    id: 'stabilizing',
    label: 'Ổn định tài chính',
    ratios: { fixed: 0.35, controlled: 0.18, necessary: 0.2, saving: 0.22, free: 0.05 },
    tone: 'gentle',
  },
  {
    id: 'preparing_marriage',
    label: 'Chuẩn bị kết hôn',
    ratios: { fixed: 0.37, controlled: 0.18, necessary: 0.17, saving: 0.25, free: 0.03 },
    tone: 'focus',
  },
  {
    id: 'buying_house',
    label: 'Mua nhà',
    ratios: { fixed: 0.38, controlled: 0.16, necessary: 0.14, saving: 0.3, free: 0.02 },
    tone: 'stretch',
  },
]

export const getPlaybook = (id: PlaybookId) => PLAYBOOKS.find((p) => p.id === id) ?? PLAYBOOKS[0]


