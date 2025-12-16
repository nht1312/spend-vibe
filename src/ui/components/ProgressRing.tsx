import { motion } from 'framer-motion'
import clsx from 'clsx'

type Props = {
  size?: number
  thickness?: number
  progress: number // 0..1
  tone?: 'safe' | 'warn' | 'alert'
  label?: string
}

const toneColor: Record<NonNullable<Props['tone']>, string> = {
  safe: '#0FA9A7',
  warn: '#F4B400',
  alert: '#EF4444',
}

export const ProgressRing = ({ size = 96, thickness = 10, progress, tone = 'safe', label }: Props) => {
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(1.4, Math.max(0, progress))

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={thickness}
          fill="transparent"
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={toneColor[tone]}
          strokeWidth={thickness}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - clamped * circumference }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            opacity: 0.9,
          }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className={clsx('text-sm font-semibold fill-slate-800', tone === 'alert' && 'fill-red-600')}
        >
          {Math.round(clamped * 100)}%
        </text>
      </svg>
      {label ? <span className="mt-1 text-xs text-slate-600">{label}</span> : null}
    </div>
  )
}

