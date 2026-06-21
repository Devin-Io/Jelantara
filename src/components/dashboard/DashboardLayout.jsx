import { Bell, LogOut, Menu, RefreshCcw, RotateCcw, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Brand from '../common/Brand'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../hooks/useAppData'
import { Modal, StatusBadge, Toast } from '../common/UI'
import { formatDateTime } from '../../utils/batchUtils'

export default function DashboardLayout({ menu, children, contextLabel, locationLabel = 'Indonesia' }) {
  const [open, setOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [toast, setToast] = useState('')
  const { user, logout } = useAuth()
  const { state, markNotificationsRead, resetData } = useAppData()
  const navigate = useNavigate()
  const unread = state.notifications.filter((item) => !item.read).length

  const sidebar = (
    <aside className="dashboard-sidebar flex h-full w-72 flex-col border-r border-border bg-white">
      <div className="border-b border-border p-5"><Brand /></div>
      <div className="px-5 pt-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.17em] text-muted">Ruang kerja</div>
        <div className="mt-2 font-semibold text-ink">{contextLabel}</div>
        <div className="mt-1 text-xs text-muted">{locationLabel}</div>
      </div>
      <nav className="mt-5 flex-1 space-y-1 overflow-y-auto px-3 pb-5" aria-label="Navigasi dashboard">
        {menu.map(([label, path, Icon]) => (
          <NavLink key={path} to={path} end={path.split('/').length === 2} onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${isActive ? 'relative bg-brand-100 text-brand-700 shadow-sm before:absolute before:left-0 before:top-2.5 before:h-7 before:w-1 before:rounded-r-full before:bg-brand-500' : 'text-muted hover:translate-x-0.5 hover:bg-soft hover:text-ink'}`}>
            <Icon size={18} />{label}
          </NavLink>
        ))}
      </nav>
      <button onClick={() => setResetOpen(true)} className="mx-3 mb-2 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 hover:bg-amber-100">
        <RotateCcw size={18} /> Reset Data Simulasi
      </button>
      <button onClick={() => { logout(); navigate('/login') }} className="m-3 mt-0 flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted hover:bg-red-50 hover:text-red-700">
        <LogOut size={18} /> Keluar
      </button>
    </aside>
  )

  const doReset = () => {
    resetData()
    setResetOpen(false)
    setToast('Data simulasi dikembalikan ke kondisi awal.')
  }

  return (
    <div className="dashboard-shell min-h-screen bg-soft">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-ink/40" aria-label="Tutup sidebar" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72">{sidebar}<button className="absolute right-3 top-3 rounded-lg p-2" onClick={() => setOpen(false)} aria-label="Tutup menu"><X /></button></div>
        </div>
      )}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/90 px-4 shadow-[0_8px_28px_rgba(23,53,46,.05)] backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="rounded-xl border border-border p-2 lg:hidden" aria-label="Buka sidebar"><Menu /></button>
            <div>
              <div className="text-sm font-semibold text-ink">{user?.name || contextLabel}</div>
              <div className="text-xs text-muted">{user?.email || 'mode-demo@jelantara.id'}</div>
            </div>
          </div>
          <div className="relative flex items-center gap-2 sm:gap-3">
            <StatusBadge tone="success"><RefreshCcw size={12} className="mr-1" /> Sinkron</StatusBadge>
            <button onClick={() => { setNotificationsOpen((value) => !value); markNotificationsRead() }} className="relative rounded-xl border border-border p-2.5 text-muted hover:bg-soft" aria-label={`Notifikasi, ${unread} belum dibaca`}>
              <Bell size={19} />{unread > 0 && <span className="notification-pulse absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">{unread}</span>}
            </button>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white">{(user?.name || 'J').charAt(0)}</div>
            {notificationsOpen && (
              <div className="absolute right-10 top-12 z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3"><div><div className="font-bold text-ink">Notifikasi Prototype</div><div className="text-xs text-muted">Terhubung dengan aktivitas antarmodul</div></div><button onClick={() => setNotificationsOpen(false)} className="rounded-lg p-1.5 hover:bg-soft" aria-label="Tutup notifikasi"><X size={18}/></button></div>
                <div className="max-h-96 overflow-y-auto">
                  {state.notifications.slice(0,8).map((item) => <div key={item.id} className="border-b border-border px-4 py-3 last:border-b-0"><div className="text-sm font-semibold text-ink">{item.title}</div><div className="mt-1 text-xs leading-5 text-muted">{item.message}</div><div className="mt-2 text-[10px] text-muted">{formatDateTime(item.timestamp)}</div></div>)}
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="dashboard-content p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset Data Simulasi" size="max-w-lg">
        <p className="text-sm leading-6 text-muted">Seluruh pencatatan, status rute, hasil mutu, insentif, dan traceability yang dibuat selama demo akan dikembalikan ke data awal.</p>
        <div className="mt-6 flex justify-end gap-3"><button onClick={() => setResetOpen(false)} className="btn-secondary">Batal</button><button onClick={doReset} className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700">Reset Sekarang</button></div>
      </Modal>
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  )
}
