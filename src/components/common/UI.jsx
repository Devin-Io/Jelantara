import { useEffect, useRef } from 'react'
import { AlertCircle, Check, ChevronRight, Info, X } from 'lucide-react'

export function SectionHeading({ eyebrow, title, description, align = 'left', light = false }) {
  return (
    <div className={`section-heading max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <div className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${light ? 'text-brand-200' : 'text-brand-600'}`}>{eyebrow}</div>}
      <h2 className={`font-[Manrope] text-3xl font-bold leading-tight sm:text-4xl ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {description && <p className={`mt-4 text-base leading-7 sm:text-lg ${light ? 'text-white/80' : 'text-muted'}`}>{description}</p>}
    </div>
  )
}

export function StatusBadge({ children, tone = 'neutral' }) {
  const styles = {
    success: 'bg-brand-100 text-brand-700',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-700',
    info: 'bg-cyan-100 text-cyan-800',
    neutral: 'bg-slate-100 text-slate-700',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${styles[tone]}`}>{children}</span>
}

export function StatCard({ icon: Icon, label, value, detail, accent = false }) {
  return (
    <article className={`premium-card border p-5 ${accent ? 'border-brand-300 bg-brand-100' : 'border-border bg-white'} shadow-soft`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent ? 'bg-white text-brand-700' : 'bg-brand-50 text-brand-600'}`}>
          {Icon && <Icon size={21} />}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Data simulasi</span>
      </div>
      <div className="text-2xl font-bold text-ink">{value}</div>
      <div className="mt-1 text-sm font-semibold text-muted">{label}</div>
      {detail && <p className="mt-3 text-xs leading-5 text-muted">{detail}</p>}
    </article>
  )
}

export function PageHeader({ eyebrow = 'Prototype JELANTARA', title, description, action }) {
  return (
    <div className="page-header-enter mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</div>
        <h1 className="mt-2 font-[Manrope] text-3xl font-bold text-ink">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Modal({ open, onClose, title, children, size = 'max-w-2xl' }) {
  const panelRef = useRef(null)
  const previousFocus = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    previousFocus.current = document.activeElement
    const panel = panelRef.current
    const focusable = () => [...(panel?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || [])].filter((item) => !item.disabled)
    focusable()[0]?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const items = focusable()
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); previousFocus.current?.focus?.() }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="modal-backdrop fixed inset-0 z-[70] grid place-items-center bg-ink/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div ref={panelRef} className={`modal-panel max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-5 py-4">
          <h2 id="modal-title" className="font-bold text-ink">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Tutup modal"><X size={20} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function Toast({ message, onClose, tone = 'success' }) {
  useEffect(() => {
    if (!message) return
    const id = setTimeout(onClose, 3200)
    return () => clearTimeout(id)
  }, [message, onClose])
  if (!message) return null
  return (
    <div className="toast-enter fixed bottom-5 right-5 z-[80] flex max-w-sm items-start gap-3 rounded-2xl border border-border bg-white p-4 shadow-2xl">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${tone === 'success' ? 'bg-brand-100 text-brand-700' : 'bg-red-100 text-red-700'}`}>
        {tone === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
      </span>
      <div className="text-sm font-medium text-ink">{message}</div>
      <button onClick={onClose} className="ml-auto text-muted" aria-label="Tutup notifikasi"><X size={17} /></button>
    </div>
  )
}

export function InfoBox({ children, tone = 'info' }) {
  const style = tone === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-cyan-200 bg-cyan-50 text-cyan-900'
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${style}`}>
      <Info className="mt-0.5 shrink-0" size={18} />
      <div>{children}</div>
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="grid min-h-64 place-items-center border border-dashed border-border bg-soft p-8 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-700"><Info /></div>
        <h3 className="font-bold text-ink">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  )
}

export function DataTable({ columns, rows, onRowClick }) {
  return (
    <div className="overflow-x-auto border border-border bg-white shadow-soft">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-soft text-xs uppercase tracking-[0.08em] text-muted">
          <tr>{columns.map((col) => <th key={col.key} className="px-4 py-3 font-semibold">{col.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, index) => (
            <tr key={row.id || index} onClick={() => onRowClick?.(row)} className={onRowClick ? 'cursor-pointer transition-colors hover:bg-brand-50/70' : 'transition-colors hover:bg-soft/70'}>
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3.5 text-muted">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ListLink({ children }) {
  return <span className="inline-flex items-center gap-1 font-semibold text-brand-700">{children}<ChevronRight size={15} /></span>
}
