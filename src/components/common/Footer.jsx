import { Link } from 'react-router-dom'
import Brand from './Brand'

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Brand light />
          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
            Prototype platform pengelolaan rantai pasok minyak jelantah SPPG menuju ekosistem Sustainable Aviation Fuel.
          </p>
          <div className="mt-6 text-sm text-white/65">
            Tim SAKAWAN<br />Universitas Lambung Mangkurat<br />2026
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Platform</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/65">
            <a href="#tentang">Tentang JELANTARA</a><a href="#fitur">Fitur</a><a href="#cara-kerja">Cara kerja</a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Ekosistem</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/65">
            <a href="#dampak">Dampak</a><a href="#mitra">Mitra</a><Link to="/referensi">Sumber referensi</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Prototype</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/65">
            <Link to="/login">Masuk sistem</Link><Link to="/traceability">Traceability</Link><span>Kontak tim: sakawan@prototype.id</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        Website prototype visual. Tidak merepresentasikan sistem operasional atau integrasi pemerintah secara real-time.
      </div>
    </footer>
  )
}
