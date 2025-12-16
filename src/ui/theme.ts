import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export const useAutoTheme = (): Theme => {
  const getPref = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const [theme, setTheme] = useState<Theme>(getPref())

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setTheme(mql.matches ? 'dark' : 'light')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return theme
}

export const vibeColors = {
  safe: 'text-teal-600',
  warn: 'text-amber-500',
  alert: 'text-red-500',
}

