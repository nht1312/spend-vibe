import { MonthlySnapshot } from '../domain/types'

export const downloadTextFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const exportBackupJson = (json: string) => {
  downloadTextFile(`spend-vibe-backup-${Date.now()}.json`, json)
}

export const exportSnapshotPdf = (snapshot: MonthlySnapshot, currencyFormatter: (v: number) => string) => {
  const win = window.open('', '_blank', 'width=800,height=1000')
  if (!win) return
  const rows = snapshot.buckets
    .map(
      (b) =>
        `<tr><td style="padding:6px 0;font-size:13px">${b.id}</td><td style="padding:6px 0;font-size:13px">${currencyFormatter(
          b.spent,
        )} / ${currencyFormatter(b.limit)}</td></tr>`,
    )
    .join('')
  win.document.write(`
    <html>
      <head>
        <title>Monthly Snapshot</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
          h1 { margin: 0 0 8px 0; }
          h2 { margin: 4px 0 16px 0; font-size: 16px; font-weight: 500; color: #475569; }
          .card { border: 1px solid #e2e8f0; padding: 12px; border-radius: 12px; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          td { border-bottom: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <h1>Monthly Snapshot</h1>
        <h2>Tháng ${snapshot.month}</h2>
        <div class="card">
          <div><strong>Thu nhập:</strong> ${currencyFormatter(snapshot.income)}</div>
          <div><strong>Đã chi:</strong> ${currencyFormatter(snapshot.totalSpent)}</div>
          <div><strong>Tiết kiệm (tỷ lệ):</strong> ${Math.round(snapshot.savingRatio * 100)}%</div>
          <div style="margin-top:8px;"><strong>Buckets:</strong></div>
          <table>${rows}</table>
        </div>
        <script>
          window.print();
          setTimeout(() => window.close(), 300);
        </script>
      </body>
    </html>
  `)
  win.document.close()
}


