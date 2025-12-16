import { Bucket, BucketId } from '../domain/types'

export type BucketStatus = 'safe' | 'warn' | 'over'

const WARN_RATIO = 0.8
const OVER_RATIO = 1

export const getBucketStatus = (bucket: Bucket): BucketStatus => {
  if (bucket.id === 'free') return 'safe' // Guilt-free: không cảnh báo
  const ratio = bucket.limit === 0 ? 0 : bucket.spent / bucket.limit
  if (ratio >= OVER_RATIO) return 'over'
  if (ratio >= WARN_RATIO) return 'warn'
  return 'safe'
}

export const statusTone = (status: BucketStatus) => {
  if (status === 'over') return 'alert'
  if (status === 'warn') return 'warn'
  return 'safe'
}

export type WeeklyPulse = {
  bucketId: BucketId
  status: BucketStatus
  suggestion: string
}

const paceSuggestion = (bucketId: BucketId, status: BucketStatus) => {
  if (status === 'safe') {
    return 'Ổn, cứ giữ nhịp này nhé.'
  }
  if (status === 'warn') {
    const tips: Record<BucketId, string> = {
      controlled: 'Tuần sau thử giảm ăn ngoài 1–2 bữa?',
      free: 'Giữ vài ngày không chi Free để hồi phục quỹ.',
      necessary: 'Check lại tủ lạnh trước khi đi chợ.',
      fixed: 'Xem có khoản cố định nào hủy bớt được không?',
      saving: 'Giữ nguyên mức tiết kiệm, đừng rút lại nhé.',
    }
    return tips[bucketId]
  }
  return 'Đã vượt nhẹ, tạm dừng khoản này vài ngày để cân bằng.'
}

export const getWeeklyPulse = (buckets: Bucket[]): WeeklyPulse[] => {
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const day = today.getDate()
  const daysLeft = Math.max(1, daysInMonth - day)
  const elapsedRatio = day / daysInMonth

  return buckets.map((bucket) => {
    const status = getBucketStatus(bucket)
    if (bucket.limit <= 0) {
      return { bucketId: bucket.id, status, suggestion: 'Thêm hạn mức để theo dõi nhịp chi.' }
    }
    const pace = bucket.spent / bucket.limit
    const ahead = pace > elapsedRatio + 0.1
    const late = pace < elapsedRatio - 0.15

    if (status === 'over') {
      return {
        bucketId: bucket.id,
        status,
        suggestion: 'Đang vượt trần, thử đóng băng khoản này đến tuần sau.',
      }
    }
    if (ahead) {
      return {
        bucketId: bucket.id,
        status: 'warn',
        suggestion: paceSuggestion(bucket.id, 'warn'),
      }
    }
    if (late) {
      return {
        bucketId: bucket.id,
        status: 'safe',
        suggestion: 'Chi còn thấp, bạn đang rất tốt. Giữ nhịp hiện tại.',
      }
    }
    return {
      bucketId: bucket.id,
      status,
      suggestion: paceSuggestion(bucket.id, status),
    }
  })
}

export type WeeklyInsight = {
  bucketId: BucketId | null
  tone: BucketStatus
  message: string
}

export const getWeeklyInsight = (buckets: Bucket[]): WeeklyInsight => {
  const scoped = buckets.filter((b) => b.id !== 'free') // Không phân tích bucket Free

  if (!scoped.length) {
    return { bucketId: null, tone: 'safe', message: 'Chưa có chi tiêu chung tuần này, mọi thứ đang nhẹ nhàng.' }
  }

  const total = scoped.reduce((sum, b) => sum + b.spent, 0)
  if (total === 0) {
    return { bucketId: null, tone: 'safe', message: 'Chưa phát sinh chi tiêu đáng kể. Cứ tận hưởng tuần này nhé.' }
  }

  const sorted = [...scoped].sort((a, b) => b.spent - a.spent)
  const top = sorted[0]
  const share = top.spent / total

  const label: Record<BucketId, string> = {
    controlled: 'ăn chơi / mua sắm',
    fixed: 'khoản cố định',
    necessary: 'ăn uống / sinh hoạt',
    saving: 'tiết kiệm',
    free: 'khoản Free',
  }

  if (share < 0.35) {
    return {
      bucketId: top.id,
      tone: 'safe',
      message: 'Các khoản chi đang khá cân bằng. Chỉ cần giữ nhịp hiện tại là ổn.',
    }
  }

  if (top.id === 'controlled') {
    return {
      bucketId: top.id,
      tone: 'warn',
      message: 'Ăn uống / vui chơi đang chiếm phần khá lớn tuần này. Giảm 1–2 buổi là đủ để cả nhà cân lại.',
    }
  }

  if (top.id === 'necessary') {
    return {
      bucketId: top.id,
      tone: 'warn',
      message: 'Chi cho ăn uống / sinh hoạt hơi nổi bật. Mình thử lên danh sách chung trước khi đi chợ nhé?',
    }
  }

  if (top.id === 'free') {
    return {
      bucketId: top.id,
      tone: 'warn',
      message: 'Khoản Free đang dùng khá nhiều – không sao, cả nhà tạm nghỉ vài ngày là lại cân bằng.',
    }
  }

  return {
    bucketId: top.id,
    tone: 'safe',
    message: `Tuần này ${label[top.id]} chiếm phần nhiều, nhưng vẫn trong tầm kiểm soát chung. Chúng ta đang làm ổn.`,
  }
}

