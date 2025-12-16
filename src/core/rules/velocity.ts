import { Bucket } from '../domain/types'

export type VelocityStatus = 'on_track' | 'fast' | 'too_fast'

type VelocityResult = {
  status: VelocityStatus
}

export const getSpendingVelocity = (buckets: Bucket[]): VelocityResult => {
  const totalLimit = buckets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = buckets.reduce((sum, b) => sum + b.spent, 0)
  if (totalLimit <= 0) return { status: 'on_track' }

  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const day = today.getDate()
  const daysPassed = Math.max(1, day)
  const expected = (totalLimit * daysPassed) / daysInMonth

  if (totalSpent > expected * 1.4) return { status: 'too_fast' }
  if (totalSpent > expected * 1.2) return { status: 'fast' }
  return { status: 'on_track' }
}


