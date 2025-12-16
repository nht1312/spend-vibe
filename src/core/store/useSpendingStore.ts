import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import {
  AllocationProfile,
  AllocationRatios,
  Bucket,
  BucketId,
  BUCKETS,
  CurrencyCode,
  Expense,
  PROFILE_RATIOS,
  MonthId,
  MonthlySnapshot,
  UsageMode,
  UserRole,
  PlaybookId,
  DecisionWindowId,
  CalmMode,
} from '../domain/types'
import { localStateStorage } from './persistence'
import { getPlaybook } from '../rules/playbooks'

type SpendingState = {
  income: number | null
  profile: AllocationProfile | null
  currency: CurrencyCode
  currentMonth: MonthId | null
  mode: UsageMode
  role: UserRole
  playbookId: PlaybookId
  decisionWindows: DecisionWindowId[]
  calmMode: CalmMode
  ratios: AllocationRatios
  buckets: Record<BucketId, Bucket>
  expenses: Expense[]
  freeLocked: boolean
  lastSnapshot: MonthlySnapshot | null
  snapshotHistory: MonthlySnapshot[]
  lastExpenseAt: number | null
  updatedAt: number
  initializePlan: (
    income: number,
    profile: AllocationProfile,
    currency: CurrencyCode,
    ratios?: AllocationRatios,
    mode?: UsageMode,
    role?: UserRole,
  ) => { ok: boolean; reason?: string }
  ensureMonth: () => { reset: boolean; snapshot?: MonthlySnapshot } | { reset: false }
  addExpense: (input: { bucketId: BucketId; amount: number; note?: string; overrideFree?: boolean }) => {
    ok: boolean
    reason?: string
  }
  setRole: (role: UserRole) => void
  setMode: (mode: UsageMode) => void
  setPlaybook: (playbookId: PlaybookId) => void
  toggleDecisionWindow: (id: DecisionWindowId) => void
  setCalmMode: (value: CalmMode) => void
  exportSyncPayload: () => string
  importSyncPayload: (payload: string) => { ok: boolean; reason?: string }
  bucketList: () => Bucket[]
  totalRemaining: () => number
}

const buildBuckets = (income: number, ratios: AllocationRatios): Record<BucketId, Bucket> =>
  BUCKETS.reduce((acc, id) => {
    acc[id] = { id, limit: Math.round(income * ratios[id]), spent: 0 }
    return acc
  }, {} as Record<BucketId, Bucket>)

const clampRatios = (ratios: AllocationRatios) => {
  const sum = Object.values(ratios).reduce((s, v) => s + v, 0)
  if (Math.abs(sum - 1) < 0.001) return ratios
  // normalize lightly to avoid over/under 100%
  return Object.fromEntries(Object.entries(ratios).map(([k, v]) => [k, v / sum])) as AllocationRatios
}

const monthId = (): MonthId => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const useSpendingStore = create<SpendingState>()(
  persist(
    (set, get) => ({
      income: null,
      profile: null,
      currency: 'VND',
      currentMonth: null,
      mode: 'solo',
      role: 'admin',
      playbookId: 'none',
      decisionWindows: [],
      calmMode: false,
      ratios: PROFILE_RATIOS.personal,
      buckets: buildBuckets(0, PROFILE_RATIOS.personal),
      expenses: [],
      freeLocked: false,
      lastSnapshot: null,
      snapshotHistory: [],
      lastExpenseAt: null,
      updatedAt: Date.now(),
      initializePlan: (income, profile, currency, ratios, mode = 'solo', role = 'admin') => {
        if (get().mode === 'family' && get().role === 'member') {
          return { ok: false, reason: 'not-allowed' }
        }
        const safeRatios = clampRatios(ratios ?? PROFILE_RATIOS[profile])
        const pb = getPlaybook(get().playbookId)
        const appliedRatios = clampRatios(pb.ratios ?? safeRatios)
        set({
          income,
          profile,
          currency,
          currentMonth: monthId(),
          mode,
          role,
          ratios: appliedRatios,
          buckets: buildBuckets(income, appliedRatios),
          expenses: [],
          freeLocked: false,
          lastSnapshot: null,
          snapshotHistory: [],
          lastExpenseAt: null,
          updatedAt: Date.now(),
        })
        return { ok: true }
      },
      ensureMonth: () => {
        const state = get()
        if (!state.income || !state.currentMonth) {
          set({ currentMonth: monthId(), updatedAt: Date.now() })
          return { reset: false }
        }
        const nowMonth = monthId()
        if (state.currentMonth === nowMonth) return { reset: false }

        const buckets = Object.values(state.buckets)
        const totalSpent = buckets.reduce((sum, b) => sum + b.spent, 0)
        const savingRatio = state.ratios.saving ?? 0
        const snapshot: MonthlySnapshot = {
          month: state.currentMonth,
          income: state.income,
          totalSpent,
          savingRatio,
          buckets,
        }

        set({
          currentMonth: nowMonth,
          buckets: buildBuckets(state.income, state.ratios),
          expenses: [],
          freeLocked: false,
          lastSnapshot: snapshot,
          snapshotHistory: [...(state.snapshotHistory ?? []), snapshot].slice(-6),
          lastExpenseAt: null,
          updatedAt: Date.now(),
        })
        return { reset: true, snapshot }
      },
      addExpense: ({ bucketId, amount, note, overrideFree }) => {
        if (amount <= 0 || Number.isNaN(amount)) return { ok: false, reason: 'invalid' }
        const state = get()
        const target = state.buckets[bucketId]
        if (!target) return { ok: false, reason: 'missing-bucket' }
        const nextSpent = target.spent + amount

        if (bucketId === 'free' && state.freeLocked && !overrideFree) {
          return { ok: false, reason: 'free-locked' }
        }
        if (bucketId === 'free' && nextSpent >= target.limit && !overrideFree) {
          set({ freeLocked: true })
          return { ok: false, reason: 'free-locked' }
        }

        const nextBuckets = {
          ...state.buckets,
          [bucketId]: { ...target, spent: nextSpent },
        }
        const expense: Expense = {
          id: nanoid(),
          bucketId,
          amount,
          note: note?.trim() || undefined,
          createdAt: Date.now(),
        }
        const now = Date.now()
        set({
          buckets: nextBuckets,
          expenses: [expense, ...state.expenses].slice(0, 200), // keep recent, avoid bloat
          freeLocked: bucketId === 'free' ? nextSpent >= target.limit : state.freeLocked,
          lastExpenseAt: now,
          updatedAt: now,
        })
        return { ok: true }
      },
      setRole: (role) => set({ role, updatedAt: Date.now() }),
      setMode: (mode) => set({ mode, updatedAt: Date.now() }),
      setPlaybook: (playbookId) => {
        const state = get()
        const pb = getPlaybook(playbookId)
        const nextRatios = clampRatios(pb.ratios ?? state.ratios)
        if (!state.income) {
          set({ playbookId, ratios: nextRatios, updatedAt: Date.now() })
          return
        }
        set({
          playbookId,
          ratios: nextRatios,
          buckets: buildBuckets(state.income, nextRatios),
          updatedAt: Date.now(),
        })
      },
      toggleDecisionWindow: (id) => {
        const current = get().decisionWindows
        const exists = current.includes(id)
        const next = exists ? current.filter((w) => w !== id) : [...current, id]
        set({ decisionWindows: next, updatedAt: Date.now() })
      },
      setCalmMode: (value) => set({ calmMode: value, updatedAt: Date.now() }),
      exportSyncPayload: () => {
        const state = get()
        const payload = {
          version: 1,
          updatedAt: state.updatedAt,
          data: {
            income: state.income,
            profile: state.profile,
            currency: state.currency,
            currentMonth: state.currentMonth,
            mode: state.mode,
            role: state.role,
            playbookId: state.playbookId,
            decisionWindows: state.decisionWindows,
            calmMode: state.calmMode,
            ratios: state.ratios,
            buckets: state.buckets,
            expenses: state.expenses,
            freeLocked: state.freeLocked,
            lastSnapshot: state.lastSnapshot,
            lastExpenseAt: state.lastExpenseAt,
            snapshotHistory: state.snapshotHistory,
          },
        }
        return JSON.stringify(payload)
      },
      importSyncPayload: (payload) => {
        try {
          const parsed = JSON.parse(payload)
          if (parsed.version !== 1) return { ok: false, reason: 'version' }
          if (typeof parsed.updatedAt !== 'number') return { ok: false, reason: 'bad-payload' }
          const state = get()
          if (parsed.updatedAt <= state.updatedAt) return { ok: false, reason: 'stale' }
          const data = parsed.data as Partial<SpendingState>
          set({
            income: data.income ?? state.income,
            profile: data.profile ?? state.profile,
            currency: data.currency ?? state.currency,
            currentMonth: data.currentMonth ?? state.currentMonth,
            mode: data.mode ?? state.mode,
            role: data.role ?? state.role,
            playbookId: (data.playbookId as PlaybookId) ?? state.playbookId,
            decisionWindows: (data.decisionWindows as DecisionWindowId[]) ?? state.decisionWindows ?? [],
            calmMode: (data.calmMode as CalmMode) ?? state.calmMode,
            ratios: data.ratios ?? state.ratios,
            buckets: (data.buckets as any) ?? state.buckets,
            expenses: (data.expenses as any) ?? state.expenses,
            freeLocked: data.freeLocked ?? state.freeLocked,
            lastSnapshot: (data.lastSnapshot as any) ?? state.lastSnapshot,
            lastExpenseAt: data.lastExpenseAt ?? state.lastExpenseAt,
            snapshotHistory: (data.snapshotHistory as any) ?? state.snapshotHistory ?? [],
            updatedAt: parsed.updatedAt,
          })
          return { ok: true }
        } catch (e) {
          return { ok: false, reason: 'parse' }
        }
      },
      bucketList: () => Object.values(get().buckets),
      totalRemaining: () => {
        const { buckets } = get()
        return Object.values(buckets).reduce((acc, bucket) => acc + Math.max(0, bucket.limit - bucket.spent), 0)
      },
    }),
    {
      name: 'spending-store',
      version: 1,
      storage: createJSONStorage(() => localStateStorage),
      partialize: (state) => ({
        income: state.income,
        profile: state.profile,
        currency: state.currency,
        currentMonth: state.currentMonth,
        ratios: state.ratios,
        buckets: state.buckets,
        expenses: state.expenses,
        freeLocked: state.freeLocked,
        lastSnapshot: state.lastSnapshot,
        lastExpenseAt: state.lastExpenseAt,
        updatedAt: state.updatedAt,
        mode: state.mode,
        role: state.role,
        snapshotHistory: state.snapshotHistory,
        playbookId: state.playbookId,
        decisionWindows: state.decisionWindows,
        calmMode: state.calmMode,
      }),
    },
  ),
)

