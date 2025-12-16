import type { StateStorage } from 'zustand/middleware'

const STORAGE_KEY_PREFIX = 'spend-vibe'

const safeLocalStorage: Storage | null = typeof localStorage !== 'undefined' ? localStorage : null

const handle = {
  get(key: string) {
    try {
      return safeLocalStorage?.getItem(key) ?? null
    } catch {
      return null
    }
  },
  set(key: string, value: string) {
    try {
      safeLocalStorage?.setItem(key, value)
    } catch {
      /* ignore quota/unavailable */
    }
  },
  remove(key: string) {
    try {
      safeLocalStorage?.removeItem(key)
    } catch {
      /* ignore */
    }
  },
}

export const localStateStorage: StateStorage = {
  getItem: (name) => handle.get(`${STORAGE_KEY_PREFIX}:${name}`) ?? null,
  setItem: (name, value) => handle.set(`${STORAGE_KEY_PREFIX}:${name}`, value),
  removeItem: (name) => handle.remove(`${STORAGE_KEY_PREFIX}:${name}`),
}

