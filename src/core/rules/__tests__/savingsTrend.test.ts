const snap = (month: string, savingRatio: number) =>
  ({ month, savingRatio, income: 0, totalSpent: 0, buckets: [] } as any)

describe('computeSavingsTrend', () => {
  it.skip('treats small wiggles as stable', () => {
    return import('../savingsTrend.ts').then(({ computeSavingsTrend }) => {
      const hist = [snap('2025-01', 0.2), snap('2025-02', 0.205)]
      const trend = computeSavingsTrend(hist)
      expect(trend.overall).toBe('stable')
    })
  })

  it.skip('detects improving direction', () => {
    return import('../savingsTrend.ts').then(({ computeSavingsTrend }) => {
      const hist = [snap('2025-01', 0.2), snap('2025-02', 0.25), snap('2025-03', 0.27)]
      const trend = computeSavingsTrend(hist)
      expect(trend.last3).toBe('improving')
      expect(trend.overall).toBe('improving')
    })
  })

  it.skip('detects declining direction', () => {
    return import('../savingsTrend.ts').then(({ computeSavingsTrend }) => {
      const hist = [snap('2025-01', 0.3), snap('2025-02', 0.26), snap('2025-03', 0.25)]
      const trend = computeSavingsTrend(hist)
      expect(trend.last3).toBe('declining')
      expect(trend.overall).toBe('declining')
    })
  })
})


