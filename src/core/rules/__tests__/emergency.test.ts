const mockBucket = (limit: number) => ({ id: 'fixed', limit, spent: 0 } as any)
const mockSnap = (income: number, savingRatio: number, month = '2025-01') =>
  ({ income, savingRatio, totalSpent: 0, month } as any)

describe('computeEmergencyReadiness', () => {
  it.skip('returns null when no fixed bucket', () => {
    return import('../emergency.ts').then(({ computeEmergencyReadiness }) => {
      expect(computeEmergencyReadiness({ fixedBucket: null, history: [] })).toBeNull()
    })
  })

  it.skip('returns null when no savings estimated', () => {
    return import('../emergency.ts').then(({ computeEmergencyReadiness }) => {
      expect(computeEmergencyReadiness({ fixedBucket: mockBucket(10_000_000), history: [] })).toBeNull()
    })
  })

  it.skip('classifies risk / safe / strong by months buffer', () => {
    return import('../emergency.ts').then(({ computeEmergencyReadiness }) => {
      const fixed = mockBucket(10_000_000)
      const hist = [
        mockSnap(20_000_000, 0.05, '2025-01'), // 1m saved
        mockSnap(20_000_000, 0.05, '2025-02'), // 1m saved
      ]
      const ers = computeEmergencyReadiness({ fixedBucket: fixed, history: hist })
      expect(ers?.months).toBe(0) // 2m saved /10m expense -> 0.2 -> rounds to 0
      expect(ers?.status).toBe('risk')

      const histSafe = [
        mockSnap(30_000_000, 0.1, '2025-01'), // 3m
        mockSnap(30_000_000, 0.1, '2025-02'), // 3m
        mockSnap(30_000_000, 0.1, '2025-03'), // 3m
      ]
      const ersSafe = computeEmergencyReadiness({ fixedBucket: fixed, history: histSafe })
      expect(ersSafe?.status).toBe('safe')

      const histStrong = Array.from({ length: 6 }, (_, i) => mockSnap(40_000_000, 0.25, `2025-0${i + 1}`)) // 10m each
      const ersStrong = computeEmergencyReadiness({ fixedBucket: fixed, history: histStrong })
      expect(ersStrong?.status).toBe('strong')
    })
  })
})


