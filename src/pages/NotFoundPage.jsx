import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from '../components/common/Brand'

export default function NotFoundPage() {
  return <main className="grid min-h-screen place-items-center bg-soft p-6"><div className="max-w-lg text-center"><div className="flex justify-center"><Brand/></div><div className="mt-12 text-7xl font-extrabold text-brand-200">404</div><h1 className="mt-4 text-2xl font-bold text-ink">Halaman tidak ditemukan</h1><p className="mt-3 text-muted">Route yang Anda buka tidak tersedia pada prototype JELANTARA.</p><Link to="/" className="btn-primary mt-7"><ArrowLeft size={18}/> Kembali ke beranda</Link></div></main>
}
