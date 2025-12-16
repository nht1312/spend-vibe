import { Bucket, MonthlySnapshot } from '../domain/types'

export type ERSStatus = 'risk' | 'safe' | 'strong'

export type EmergencyReadiness = {
  months: number
  status: ERSStatus
}

// Estimate how many months user can survive without income.
// We only use:
// - Fixed monthly expenses
// - Historical savings (using savingRatio * income per month)
//
// This is intentionally approximate – the goal is awareness, not precision.

export const computeEmergencyReadiness = ({
  fixedBucket,
  history,
}: {
  fixedBucket: Bucket | null
  history: MonthlySnapshot[]
}): EmergencyReadiness | null => {
  if (!fixedBucket || fixedBucket.limit <= 0) return null

  // Approximate total emergency savings from last months:
  // sum(income * savingRatio) over history.
  const totalSavings = history.reduce((acc, snap) => acc + snap.income * snap.savingRatio, 0)
  if (totalSavings <= 0) return null

  const rawMonths = totalSavings / fixedBucket.limit
  const months = Math.max(0, Math.round(rawMonths))

  let status: ERSStatus = 'risk'
  // Financial reasoning:
  // - <3 months: vulnerable to shocks (risk)
  // - 3–6 months: commonly seen as a reasonable buffer (safe)
  // - >6 months: strong resilience
  if (months >= 6) status = 'strong'
  else if (months >= 3) status = 'safe'

  return { months, status }
}

export default {
  computeEmergencyReadiness,
}


