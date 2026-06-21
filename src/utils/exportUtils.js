export function downloadText(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function exportCsv(filename, rows) {
  if (!rows.length) return
  const keys = Object.keys(rows[0])
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const csv = [keys.map(escape).join(','), ...rows.map((row) => keys.map((key) => escape(row[key])).join(','))].join('\n')
  downloadText(filename, csv, 'text/csv;charset=utf-8')
}

export function documentText(document, batch, events = []) {
  return [
    'JELANTARA — DOKUMEN SIMULASI',
    `Document ID: ${document.id}`,
    `Jenis: ${document.type}`,
    `Batch ID: ${document.batchId}`,
    `Judul: ${document.title}`,
    `Status: ${document.status}`,
    `Versi: ${document.version}`,
    `Pihak terkait: ${document.parties}`,
    `Dibuat: ${new Date(document.createdAt).toLocaleString('id-ID')}`,
    '',
    batch ? `Asal: ${batch.sppgName}\nVolume: ${batch.volume} liter\nGrade: ${batch.qualityGrade || 'Belum diverifikasi'}\nStatus batch: ${batch.status}` : '',
    '',
    'Riwayat:',
    ...events.map((item) => `- ${new Date(item.timestamp).toLocaleString('id-ID')} | ${item.label} | ${item.description}`),
    '',
    'Dokumen ini merupakan keluaran simulasi front-end dan bukan dokumen operasional atau sertifikasi resmi.',
  ].join('\n')
}
