export type BucketId = 'fixed' | 'controlled' | 'necessary' | 'saving' | 'free'

export type AllocationProfile = 'personal' | 'couple' | 'family'
export type CurrencyCode =
  | 'VND'
  | 'USD'
  | 'EUR'
  | 'JPY'
  | 'GBP'
  | 'AUD'
  | 'SGD'
  | 'CHF'
  | 'CNY'
  | 'KRW'
export type MonthId = string // e.g., "2025-12"
export type UsageMode = 'solo' | 'couple' | 'family'
export type UserRole = 'admin' | 'member'
export type PlaybookId = 'none' | 'stabilizing' | 'preparing_marriage' | 'buying_house'
export type DecisionWindowId = 'salary_increase' | 'bonus' | 'large_purchase' | 'life_event'
export type CalmMode = boolean

export type Bucket = {
  id: BucketId
  limit: number
  spent: number
}

export type Expense = {
  id: string
  bucketId: BucketId
  amount: number
  note?: string
  createdAt: number
}

export type MonthlySnapshot = {
  month: MonthId
  income: number
  totalSpent: number
  savingRatio: number
  buckets: Bucket[]
}

export const BUCKETS: BucketId[] = ['fixed', 'controlled', 'necessary', 'saving', 'free']

export type AllocationRatios = Record<BucketId, number>

export const PROFILE_RATIOS: Record<AllocationProfile, AllocationRatios> = {
  personal: {
    fixed: 0.35,
    controlled: 0.2,
    necessary: 0.2,
    saving: 0.2,
    free: 0.05,
  },
  couple: {
    fixed: 0.4,
    controlled: 0.2,
    necessary: 0.18,
    saving: 0.17,
    free: 0.05,
  },
  family: {
    fixed: 0.45,
    controlled: 0.18,
    necessary: 0.17,
    saving: 0.15,
    free: 0.05,
  },
}

export const CURRENCY_META: Record<CurrencyCode, { locale: string; label: string }> = {
  VND: { locale: 'vi-VN', label: 'VND ₫' },
  USD: { locale: 'en-US', label: 'USD $' },
  EUR: { locale: 'de-DE', label: 'EUR €' },
  JPY: { locale: 'ja-JP', label: 'JPY ¥' },
  GBP: { locale: 'en-GB', label: 'GBP £' },
  AUD: { locale: 'en-AU', label: 'AUD $' },
  SGD: { locale: 'en-SG', label: 'SGD $' },
  CHF: { locale: 'de-CH', label: 'CHF Fr.' },
  CNY: { locale: 'zh-CN', label: 'CNY ¥' },
  KRW: { locale: 'ko-KR', label: 'KRW ₩' },
}

export const formatCurrency = (value: number, currency: CurrencyCode = 'VND') => {
  const meta = CURRENCY_META[currency]
  return Intl.NumberFormat(meta.locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Math.max(0, value))
}

