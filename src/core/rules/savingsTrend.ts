import { MonthlySnapshot } from '../domain/types'

// North Star metric: savings rate trend over months.
// We intentionally ignore daily noise and look at month-over-month direction.

export type TrendDirection = 'stable' | 'improving' | 'declining'

export type SavingsTrend = {
  last3: TrendDirection
  last6: TrendDirection
  overall: TrendDirection
}

const classifyWindow = (snapshots: MonthlySnapshot[]): TrendDirection => {
  if (snapshots.length < 2) return 'stable'

  const sorted = [...snapshots].sort((a, b) => (a.month < b.month ? -1 : 1))
  const first = sorted[0].savingRatio
  const last = sorted[sorted.length - 1].savingRatio
  const diff = last - first

  // Financial reasoning:
  // - Small wiggles (<2 percentage points) are treated as "stable"
  //   to avoid overreacting to noise.
  // - Clear upward/downward moves are called out as improving/declining.
  const threshold = 0.02
  if (diff > threshold) return 'improving'
  if (diff < -threshold) return 'declining'
  return 'stable'
}

export const computeSavingsTrend = (history: MonthlySnapshot[]): SavingsTrend => {
  const recent = [...history].sort((a, b) => (a.month < b.month ? -1 : 1)).slice(-6)
  const last3Slice = recent.slice(-3)
  const last6Slice = recent

  const last3 = classifyWindow(last3Slice)
  const last6 = classifyWindow(last6Slice)

  // Overall direction:
  // - If any window is declining and none improving -> declining
  // - If any window is improving and none declining -> improving
  // - Otherwise treat as stable.
  let overall: TrendDirection = 'stable'
  if ((last3 === 'declining' || last6 === 'declining') && !(last3 === 'improving' || last6 === 'improving')) {
    overall = 'declining'
  } else if ((last3 === 'improving' || last6 === 'improving') && !(last3 === 'declining' || last6 === 'declining')) {
    overall = 'improving'
  }

  return { last3, last6, overall }
}

export default {
  computeSavingsTrend,
}


