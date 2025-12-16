import '@testing-library/jest-dom'

// Fix for __vite_ssr_exportName__ when running vitest with rolldown/oxc.
// Ensure it assigns onto the export object to keep named exports intact.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).__vite_ssr_exportName__ = (mod: any, name: string, value: any) => {
  if (mod && typeof mod === 'object' && name) {
    mod[name] = value
  }
  return value
}

