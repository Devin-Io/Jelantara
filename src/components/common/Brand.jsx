import { Link } from 'react-router-dom'
import logoJelantara from '../../assets/logo-jelantara-baru.png'

export default function Brand({ compact = false, light = false }) {
  return (
    <Link to="/" className="inline-flex items-center gap-3" aria-label="JELANTARA beranda">
      <span className={`grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl border shadow-sm ${light ? 'border-white/20 bg-white/95' : 'border-brand-100 bg-white'}`}>
        <img
          src={logoJelantara}
          alt="Logo JELANTARA"
          className="h-full w-full object-contain p-0.5"
        />
      </span>
      <span className={light ? 'text-white' : 'text-ink'}>
        <span className="block font-[Manrope] text-lg font-extrabold tracking-[0.08em]">JELANTARA</span>
        {!compact && <span className={`block text-[11px] font-semibold tracking-[0.18em] ${light ? 'text-white/75' : 'text-muted'}`}>JELANTAH NUSANTARA</span>}
      </span>
    </Link>
  )
}
