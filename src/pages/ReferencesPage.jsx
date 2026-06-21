import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from '../components/common/Brand'
import Footer from '../components/common/Footer'
import { InfoBox, SectionHeading } from '../components/common/UI'
import { references } from '../data/content'

export default function ReferencesPage() {
  return (
    <div className="min-h-screen bg-soft">
      <header className="border-b border-border bg-white">
        <div className="container-page flex items-center justify-between py-4"><Brand/><Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand-700"><ArrowLeft size={17}/> Kembali</Link></div>
      </header>
      <main className="container-page section-space">
        <SectionHeading eyebrow="Referensi gagasan" title="Sumber yang digunakan dalam esai JELANTARA" description="Daftar ini mengikuti sumber yang tercantum dalam esai dan tidak menambahkan klaim atau data baru." />
        <div className="mt-8"><InfoBox>Website ini merupakan prototype visual dari gagasan yang disampaikan dalam esai JELANTARA. Data yang ditampilkan tidak merepresentasikan sistem operasional secara real-time.</InfoBox></div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {references.map(([source,detail],index)=><article key={source} className="flex items-start gap-4 border border-border bg-white p-5 shadow-soft"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700"><BookOpen size={19}/></div><div><div className="text-xs font-bold uppercase tracking-[.1em] text-brand-600">Sumber {String(index+1).padStart(2,'0')}</div><h2 className="mt-1 font-bold text-ink">{source}</h2><p className="mt-2 text-sm leading-6 text-muted">{detail}</p></div></article>)}
        </div>
      </main>
      <Footer/>
    </div>
  )
}
