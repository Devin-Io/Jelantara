export const batchStatusLabels = {
  recorded: 'Dicatat',
  scheduled: 'Dijadwalkan',
  picked_up: 'Dijemput',
  quality_verified: 'Diverifikasi',
  in_transit: 'Dalam perjalanan',
  received: 'Diterima fasilitas',
  document_completed: 'Dokumen selesai',
}

export const batchStatusOrder = ['recorded','scheduled','picked_up','quality_verified','in_transit','received','document_completed']

export function generateBatchId(existing = [], date = new Date()) {
  const year = date.getFullYear()
  const max = existing.reduce((highest, item) => {
    const match = item.batchId?.match(/(\d{4})$/)
    return Math.max(highest, match ? Number(match[1]) : 0)
  }, 0)
  return `JLT-BJB-${year}-${String(max + 1).padStart(4, '0')}`
}

export function formatDateTime(value) {
  if (!value) return 'Belum tersedia'
  return new Intl.DateTimeFormat('id-ID', { dateStyle:'medium', timeStyle:'short', timeZone:'Asia/Makassar' }).format(new Date(value))
}

export function getBatchTone(status) {
  if (['received','document_completed'].includes(status)) return 'success'
  if (['in_transit','quality_verified'].includes(status)) return 'info'
  if (['scheduled','picked_up'].includes(status)) return 'warning'
  return 'neutral'
}
