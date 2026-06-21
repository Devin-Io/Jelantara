import { ArrowLeft, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Brand from '../components/common/Brand'
import { roleOptions } from '../data/content'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [role, setRole] = useState('operator')
  const [email, setEmail] = useState('operator@jelantara.id')
  const [password, setPassword] = useState('jelantara123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const selectRole = (next) => {
    setRole(next.role)
    setEmail(next.email)
    setError('')
  }

  const submit = (event) => {
    event.preventDefault()
    if (!email || !password) return setError('Email dan password wajib diisi.')
    if (password !== 'jelantara123') return setError('Gunakan password dummy: jelantara123')
    const home = login({ email, role })
    navigate(home)
  }

  return (
    <main className="min-h-screen bg-soft lg:grid lg:grid-cols-[.85fr_1.15fr]">
      <section className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-36 -top-36 h-96 w-96 rounded-full bg-brand-500/25" />
        <div className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full bg-brand-400/15" />
        <Brand light />
        <div className="relative max-w-xl">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">Prototype berbasis peran</div>
          <h1 className="mt-5 font-[Manrope] text-4xl font-bold leading-tight">Satu platform untuk setiap titik dalam rantai pasok UCO.</h1>
          <p className="mt-5 text-base leading-8 text-white/70">Masuk sebagai operator SPPG, mitra logistik, fasilitas pengolahan, atau administrator untuk melihat alur kerja yang berbeda.</p>
          <div className="mt-8 space-y-4 text-sm text-white/75">
            {['Tidak menggunakan backend nyata', 'Seluruh data merupakan simulasi prototype', 'Akun cepat tersedia untuk demonstrasi'].map((item) => <div key={item} className="flex items-center gap-3"><CheckCircle2 className="text-brand-300" size={18} />{item}</div>)}
          </div>
        </div>
        <div className="relative text-xs text-white/45">Tim SAKAWAN · Universitas Lambung Mangkurat · 2026</div>
      </section>

      <section className="flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl">
          <div className="mb-7 flex items-center justify-between">
            <div className="lg:hidden"><Brand /></div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand-700"><ArrowLeft size={17} /> Kembali ke beranda</Link>
          </div>
          <div className="border border-border bg-white p-5 shadow-soft sm:p-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">Pilih peran</div>
              <h2 className="mt-2 font-[Manrope] text-3xl font-bold text-ink">Masuk ke prototype</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Pilih peran untuk mengisi akun dummy secara otomatis.</p>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {roleOptions.map((item) => (
                <button key={item.role} type="button" onClick={() => selectRole(item)}
                  className={`flex items-start gap-3 border p-4 text-left transition ${role === item.role ? 'border-brand-500 bg-brand-50 shadow-sm' : 'border-border bg-white hover:border-brand-300'}`}>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${role === item.role ? 'bg-brand-500 text-white' : 'bg-soft text-muted'}`}><item.icon size={20} /></span>
                  <span><span className="block text-sm font-bold text-ink">{item.label}</span><span className="mt-1 block text-xs leading-5 text-muted">{item.description}</span></span>
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-7 grid gap-5">
              <div>
                <label htmlFor="email" className="label">Email akun dummy</label>
                <div className="relative"><Mail className="absolute left-3.5 top-3.5 text-muted" size={18} /><input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-11" /></div>
              </div>
              <div>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-3.5 text-muted" size={18} />
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field px-11" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 rounded-lg p-1 text-muted" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>
              {error && <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}
              <button className="btn-primary w-full">Masuk sebagai {roleOptions.find((x) => x.role === role)?.label}</button>
            </form>
            <div className="mt-5 rounded-xl bg-brand-100 p-4 text-xs leading-6 text-brand-800">
              Password semua akun: <strong>jelantara123</strong>. Autentikasi ini hanya simulasi front-end.
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
