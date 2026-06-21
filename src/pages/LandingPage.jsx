import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Gauge,
  MapPinned,
  Plane,
  Play,
  Recycle,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { SectionHeading } from '../components/common/UI'
import { AnimatedRange, CountUp, Reveal, useInView } from '../components/common/Motion'
import { features, impactGroups, implementation, problems, productStats, stakeholders, swot, workflow } from '../data/content'

const flowNodes = [
  { title: 'SPPG', text: 'Volume 92 L tercatat', icon: Recycle, meta: '08.42 WITA' },
  { title: 'Optimasi rute', text: 'Armada DA 8421 BF', icon: Route, meta: '4 titik' },
  { title: 'Verifikasi mutu', text: 'Pemeriksaan awal Grade A', icon: Sparkles, meta: '88/100' },
  { title: 'Fasilitas', text: 'Batch diterima mitra', icon: Factory, meta: '12.48 WITA' },
  { title: 'Traceability', text: 'Rekam jejak disiapkan', icon: FileCheck2, meta: '6/7 tahap' },
]

function SupplyChainVisual() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const capacityPercent = 76
  const currentVolume = 456
  const containerCapacity = 600
  const priorityThreshold = 85

  useEffect(() => {
    if (paused || hovering) return undefined
    const timer = setInterval(() => setActive((current) => (current + 1) % flowNodes.length), 1800)
    return () => clearInterval(timer)
  }, [paused, hovering])

  return (
    <Reveal direction="right" delay={220} className="relative w-full">
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />
      <div
        className="supply-panel relative overflow-hidden border border-white/80 bg-white/92 p-5 shadow-[0_32px_90px_rgba(23,53,46,.16)] backdrop-blur-xl sm:p-7"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-300 via-brand-500 to-cyan-400" />

        <div className="supply-panel-header mb-5 flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Live system preview</div>
            <div className="mt-1 text-xl font-extrabold tracking-[-.02em] text-ink">Perjalanan satu batch UCO</div>
            <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted">Simulasi alur data dari pencatatan SPPG hingga rekam jejak akhir.</p>
          </div>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className={`live-pill inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[11px] font-bold transition ${paused ? 'bg-slate-100 text-slate-600' : 'bg-brand-100 text-brand-700 hover:bg-brand-200'}`}
            aria-pressed={paused}
            aria-label={paused ? 'Lanjutkan simulasi alur' : 'Jeda simulasi alur'}
          >
            {paused ? <Play size={13} /> : <span className="live-dot h-2 w-2 rounded-full bg-brand-500" />}
            {paused ? 'Lanjutkan' : 'Simulasi aktif'}
          </button>
        </div>

        <div className={`capacity-overview ${active === 0 ? 'capacity-overview-active' : ''}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="capacity-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand-700 shadow-sm">
                <Gauge size={19} />
              </span>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[.16em] text-brand-700">Kapasitas wadah SPPG</div>
                <div className="mt-1 text-sm font-semibold text-ink">SPPG Banjarbaru Utara</div>
              </div>
            </div>
            <span className="capacity-status rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800">
              {priorityThreshold - capacityPercent}% menuju prioritas
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="leading-none">
              <span className="text-2xl font-extrabold tracking-tight text-ink">{currentVolume}</span>
              <span className="ml-1.5 text-xs font-semibold text-muted">dari {containerCapacity} liter</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold tracking-tight text-brand-700">{capacityPercent}%</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[.13em] text-muted">Terisi</div>
            </div>
          </div>

          <div className="capacity-progress mt-3" aria-label={`Kapasitas wadah ${capacityPercent} persen`}>
            <div className="capacity-progress-fill" style={{ width: `${capacityPercent}%` }} />
            <span className="capacity-threshold" style={{ left: `${priorityThreshold}%` }} aria-hidden="true" />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-[9px] font-semibold text-muted">
            <span>Pembacaan sensor simulasi</span>
            <span>Ambang prioritas {priorityThreshold}%</span>
          </div>
        </div>

        <div className="relative mt-5 space-y-2.5">
          <div className="absolute bottom-8 left-[22px] top-8 w-px bg-border" />
          <div
            className="absolute left-[21px] top-8 w-[3px] rounded-full bg-brand-500 transition-all duration-700 ease-out"
            style={{ height: `${(active / (flowNodes.length - 1)) * 80}%` }}
          />
          {flowNodes.map(({ title, text, icon: Icon, meta }, index) => {
            const isActive = index === active
            const isDone = index < active
            return (
              <button
                type="button"
                key={title}
                onClick={() => setActive(index)}
                className={`flow-node relative flex w-full items-center gap-4 rounded-2xl border p-3.5 text-left transition-all duration-500 ${isActive ? 'translate-x-1 border-brand-300 bg-brand-50 shadow-[0_12px_30px_rgba(29,158,117,.12)]' : 'border-transparent bg-soft/65 hover:border-border hover:bg-white'}`}
                aria-label={`Lihat tahap ${title}`}
              >
                <span className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-all duration-500 ${isActive ? 'scale-110 border-brand-500 bg-brand-500 text-white shadow-lg' : isDone ? 'border-brand-200 bg-brand-100 text-brand-700' : 'border-border bg-white text-muted'}`}>
                  <Icon size={20} />
                  {isActive && <span className="absolute -inset-1 -z-10 animate-ping rounded-2xl bg-brand-300/30" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className={`font-bold ${isActive ? 'text-brand-700' : 'text-ink'}`}>{title}</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">0{index + 1}</div>
                  </div>
                  <div className="mt-0.5 text-xs text-muted">{text}</div>
                </div>
                <span className={`hidden min-w-[68px] rounded-lg px-2 py-1.5 text-center text-[10px] font-bold sm:block ${isActive ? 'bg-white text-brand-700 shadow-sm' : 'bg-white/75 text-muted'}`}>{meta}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {[
            ['Batch', 'JLT-018'],
            ['Tahap aktif', `${active + 1} dari ${flowNodes.length}`],
            ['Rekam jejak', `${Math.min(active + 3, 7)}/7 tahap`],
          ].map(([label, value]) => (
            <div key={label} className="telemetry-card rounded-2xl border border-brand-100 bg-brand-50/80 p-3.5">
              <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">{label}</div>
              <div className="mt-1.5 truncate text-sm font-extrabold text-brand-700">{value}</div>
            </div>
          ))}
        </div>

        <div className="custody-strip mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-white/80 p-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700"><ShieldCheck size={17} /></span>
            <div>
              <div className="text-xs font-extrabold text-ink">Chain of custody aktif</div>
              <div className="mt-0.5 text-[10px] text-muted">Setiap perubahan status batch tercatat otomatis.</div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Alur end-to-end</span>
            <div className="flex gap-1.5" aria-label="Progress simulasi">
              {flowNodes.map((node, index) => (
                <button
                  key={node.title}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${index === active ? 'w-8 bg-brand-500' : 'w-2 bg-brand-200 hover:bg-brand-300'}`}
                  aria-label={`Tahap ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function StatisticValue({ index }) {
  const className = 'text-3xl font-extrabold tracking-tight text-brand-700 sm:text-4xl'
  if (index === 0) return <CountUp end={27983} duration={1800} className={className} />
  if (index === 1) return <AnimatedRange start={500} end={590} suffix=" L" duration={1600} className={className} />
  if (index === 2) return <span className={className}>±<CountUp end={6} suffix=" juta L" duration={1300} /></span>
  if (index === 3) return <CountUp end={715} suffix=" kt" duration={1500} className={className} />
  if (index === 4) return <AnimatedRange start={20} end={40} suffix="%" duration={1500} className={className} />
  return <span className={className}>hingga <CountUp end={80} suffix="%" duration={1500} /></span>
}

function WorkflowJourney() {
  const [containerRef, visible] = useInView({ threshold: 0.25, once: false })
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!visible) return undefined
    const timer = setInterval(() => setActive((value) => (value + 1) % workflow.length), 1700)
    return () => clearInterval(timer)
  }, [visible])

  return (
    <div ref={containerRef} className="relative mt-12">
      <div className="absolute left-[10%] right-[10%] top-8 hidden h-1 overflow-hidden rounded-full bg-brand-100 lg:block">
        <div className="h-full rounded-full bg-brand-500 transition-all duration-700" style={{ width: `${(active / (workflow.length - 1)) * 100}%` }} />
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        {workflow.map(([step, title, text, Icon], index) => {
          const isActive = active === index
          const isDone = index < active
          return (
            <button
              type="button"
              key={step}
              onClick={() => setActive(index)}
              className={`workflow-step group relative border p-5 text-left transition-all duration-500 lg:border-0 lg:bg-transparent lg:p-2 lg:text-center ${isActive ? 'border-brand-300 bg-brand-50 shadow-soft lg:shadow-none' : 'border-border bg-white'}`}
            >
              <div className={`relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-2xl border-4 border-white transition-all duration-500 ${isActive ? '-translate-y-1 rotate-3 bg-brand-500 text-white shadow-[0_16px_35px_rgba(29,158,117,.28)]' : isDone ? 'bg-brand-300 text-brand-800' : 'bg-brand-100 text-brand-700'}`}>
                <Icon size={23} />
              </div>
              <div className="mt-4 text-xs font-extrabold tracking-[0.14em] text-brand-600">{step}</div>
              <h3 className={`mt-1 font-bold transition-colors ${isActive ? 'text-brand-700' : 'text-ink'}`}>{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </button>
          )
        })}
      </div>
      <div className="mx-auto mt-8 max-w-2xl border border-brand-200 bg-brand-50 p-4 text-center text-sm font-semibold text-brand-800">
        Tahap aktif: <span className="text-brand-600">{workflow[active][1]}</span> — {workflow[active][2]}
      </div>
    </div>
  )
}

function StakeholderEcosystem() {
  const positions = ['left-0 top-4', 'right-0 top-4', 'left-0 top-[43%]', 'right-0 top-[43%]', 'left-[15%] bottom-0', 'right-[15%] bottom-0']
  return (
    <div className="ecosystem-map relative min-h-[470px]">
      <div className="ecosystem-ring ecosystem-ring-outer" />
      <div className="ecosystem-ring ecosystem-ring-inner" />
      <div className="absolute left-1/2 top-1/2 z-10 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand-300/40 bg-brand-500 text-center shadow-[0_0_0_18px_rgba(93,202,165,.08),0_28px_65px_rgba(0,0,0,.24)]">
        <div>
          <ShieldCheck className="mx-auto" size={28} />
          <div className="mt-2 font-extrabold tracking-wide">JELANTARA</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/70">Integrated data hub</div>
        </div>
      </div>
      <span className="ecosystem-pulse ecosystem-pulse-a" />
      <span className="ecosystem-pulse ecosystem-pulse-b" />
      <span className="ecosystem-pulse ecosystem-pulse-c" />
      {stakeholders.map(([label, Icon], index) => (
        <Reveal key={label} delay={index * 90} direction={index % 2 ? 'left' : 'right'} className={`absolute ${positions[index]} z-20`}>
          <div className="stakeholder-chip flex w-44 items-center gap-3 border border-white/15 bg-white/10 p-3 backdrop-blur-md">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-300"><Icon size={18} /></span>
            <span className="text-xs font-semibold leading-5">{label}</span>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function SwotExplorer() {
  const entries = Object.entries(swot)
  const [active, setActive] = useState(0)
  const themes = [
    ['Kekuatan', 'border-brand-400 bg-brand-50 text-brand-700', 'S'],
    ['Kelemahan', 'border-amber-400 bg-amber-50 text-amber-800', 'W'],
    ['Peluang', 'border-cyan-400 bg-cyan-50 text-cyan-800', 'O'],
    ['Ancaman', 'border-red-400 bg-red-50 text-red-700', 'T'],
  ]

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
      <div className="grid grid-cols-2 gap-3">
        {entries.map(([title], index) => (
          <button
            key={title}
            type="button"
            onClick={() => setActive(index)}
            className={`swot-tile group min-h-36 border p-5 text-left transition-all duration-500 ${active === index ? `${themes[index][1]} -translate-y-1 shadow-soft` : 'border-border bg-white hover:border-brand-200 hover:bg-soft'}`}
          >
            <div className="flex items-start justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-xl text-lg font-black ${active === index ? 'bg-white/70' : 'bg-soft text-muted'}`}>{themes[index][2]}</span>
              <ChevronRight className={`transition-transform ${active === index ? 'rotate-90' : 'group-hover:translate-x-1'}`} size={18} />
            </div>
            <div className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-muted">{themes[index][0]}</div>
            <div className="mt-1 font-bold text-ink">{title}</div>
          </button>
        ))}
      </div>
      <div className={`relative overflow-hidden border-l-4 p-7 transition-colors duration-500 ${themes[active][1]}`}>
        <div className="absolute -right-5 -top-12 text-[170px] font-black leading-none opacity-[0.06]">{themes[active][2]}</div>
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-[0.18em] opacity-70">Analisis aktif</div>
          <h3 className="mt-2 text-2xl font-extrabold text-ink">{entries[active][0]}</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {entries[active][1].map((item, index) => (
              <div key={item} className="swot-item flex gap-3 border border-white/70 bg-white/70 p-4 text-sm leading-6 text-muted shadow-sm" style={{ animationDelay: `${index * 80}ms` }}>
                <CheckCircle2 className="mt-1 shrink-0 text-brand-500" size={17} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureMiniVisual({ index }) {
  if (index === 0) {
    return (
      <div className="feature-visual feature-visual-volume" aria-label="Ringkasan pencatatan volume simulasi">
        <div className="feature-visual-head">
          <span>Input terhubung</span>
          <span className="feature-live-dot">Aktif</span>
        </div>
        <div className="feature-volume-reading">
          <div>
            <div className="feature-visual-label">Volume wadah</div>
            <strong>456 L</strong>
          </div>
          <span>76%</span>
        </div>
        <div className="feature-volume-bar"><span style={{ width: '76%' }} /></div>
        <div className="feature-source-grid">
          <div><ClipboardCheck size={16} /><span>QR tercatat</span></div>
          <div><Gauge size={16} /><span>Sensor sinkron</span></div>
        </div>
      </div>
    )
  }

  if (index === 1) {
    return (
      <div className="feature-visual feature-visual-quality" aria-label="Ringkasan verifikasi mutu simulasi">
        <div className="feature-quality-score">
          <span>88</span>
          <small>dari 100</small>
        </div>
        <div className="feature-quality-list">
          <div><span>Warna UCO</span><b>Amber</b></div>
          <div><span>Kekeruhan</span><b>Rendah</b></div>
          <div><span>Hasil awal</span><b className="text-brand-700">Grade A</b></div>
        </div>
      </div>
    )
  }

  if (index === 2) {
    return (
      <div className="feature-visual feature-visual-route" aria-label="Diagram rute penjemputan simulasi">
        <div className="feature-route-line" />
        {[0, 1, 2, 3].map((point) => <span key={point} className={`feature-route-point feature-route-point-${point + 1}`}>{point + 1}</span>)}
        <span className="feature-route-vehicle"><Truck size={16} /></span>
        <div className="feature-route-meta"><strong>4 titik</strong><span>31,6 km · rute simulasi</span></div>
      </div>
    )
  }

  if (index === 3) {
    return (
      <div className="feature-visual feature-visual-incentive" aria-label="Simulasi perhitungan insentif">
        <div className="feature-formula-row"><span>Volume terverifikasi</span><b>92 L</b></div>
        <div className="feature-formula-row"><span>Bonus kualitas</span><b>Grade A</b></div>
        <div className="feature-formula-total"><span>Insentif</span><strong>Terhitung otomatis</strong></div>
      </div>
    )
  }

  return (
    <div className="feature-visual feature-visual-trace" aria-label="Tahapan traceability batch">
      {['Dicatat', 'Dijemput', 'Diterima', 'Dokumen'].map((label, step) => (
        <div key={label} className="feature-trace-step">
          <span className={step < 3 ? 'is-complete' : 'is-active'}>{step < 3 ? <CheckCircle2 size={14} /> : <CircleDot size={14} />}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="bg-soft text-ink">
      <Navbar />
      <main>
        <section id="beranda" className="hero-section relative isolate overflow-hidden border-b border-border">
          <div className="hero-grid absolute inset-0 -z-20" />
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="container-page grid min-h-[800px] items-center gap-12 py-20 lg:grid-cols-[.9fr_1.1fr] lg:py-24 xl:gap-16">
            <div>
              <Reveal delay={40}>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/85 px-3 py-2 text-xs font-bold text-brand-700 shadow-sm backdrop-blur">
                  <CircleDot size={15} /> Platform rantai pasok UCO terintegrasi
                </div>
              </Reveal>
              <Reveal delay={110}>
                <h1 className="mt-7 max-w-4xl font-[Manrope] text-4xl font-extrabold leading-[1.05] tracking-[-.035em] text-ink sm:text-5xl lg:text-[64px]">
                  Ubah Jelantah Dapur SPPG Menjadi <span className="hero-accent-text">BioAvtur Berkelanjutan</span>
                </h1>
              </Reveal>
              <Reveal delay={190}>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                  JELANTARA menghubungkan dapur SPPG, mitra logistik, dan fasilitas pengolahan SAF dalam satu ekosistem digital yang terukur, transparan, dan dapat diaudit.
                </p>
              </Reveal>
              <Reveal delay={270}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="#cara-kerja" className="btn-primary premium-button">Lihat Cara Kerja <ArrowRight size={18} /></a>
                  <Link to="/login" className="btn-secondary premium-button">Masuk ke Prototype</Link>
                </div>
              </Reveal>
              <Reveal delay={340}>
                <div className="mt-9 grid gap-3 text-sm text-muted sm:grid-cols-3">
                  {['Pencatatan terintegrasi', 'Optimasi berbasis data', 'Traceability end-to-end'].map((item, index) => (
                    <div key={item} className="trust-point flex items-center gap-2" style={{ animationDelay: `${500 + index * 110}ms` }}>
                      <CheckCircle2 size={17} className="text-brand-500" />{item}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <SupplyChainVisual />
          </div>
          <div className="scroll-cue hidden lg:flex"><span /> Gulir untuk menjelajahi</div>
        </section>

        <section className="section-space bg-white">
          <div className="container-page">
            <Reveal><SectionHeading eyebrow="Kesenjangan operasional" title="Potensi besar terhambat oleh sistem yang belum terhubung" description="Persoalannya bukan hanya ketersediaan minyak jelantah, tetapi bagaimana setiap liter dicatat, dikumpulkan, diverifikasi, dan ditelusuri." /></Reveal>
            <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
              {problems.map(([title, text, Icon], index) => (
                <Reveal key={title} delay={index * 70} as="article" className="problem-card group bg-white p-6 transition-all duration-500 hover:z-10 hover:bg-brand-50">
                  <div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition duration-500 group-hover:rotate-3 group-hover:scale-110 group-hover:bg-brand-100"><Icon size={21} /></span><span className="text-xs font-bold text-muted">0{index + 1}</span></div>
                  <h3 className="mt-5 font-bold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space relative overflow-hidden bg-brand-100">
          <div className="stats-pattern absolute inset-0 opacity-40" />
          <div className="container-page relative">
            <Reveal><SectionHeading eyebrow="Skala peluang" title="Angka kunci dari esai JELANTARA" description="Data berikut merupakan data dan estimasi berdasarkan sumber yang digunakan dalam esai, bukan data sistem real-time." /></Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {productStats.map((s, index) => (
                <Reveal key={s.label} delay={index * 75} className="stat-panel group relative overflow-hidden border border-white/80 bg-white/90 p-6 shadow-soft backdrop-blur">
                  <div className="absolute -right-7 -top-8 h-24 w-24 rounded-full bg-brand-100 transition-transform duration-700 group-hover:scale-150" />
                  <div className="relative"><StatisticValue index={index} /></div>
                  <div className="relative mt-2 font-bold text-ink">{s.label}</div>
                  <div className="relative mt-3 text-xs leading-5 text-muted">{s.detail}</div>
                  <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-brand-100"><div className="stat-bar h-full rounded-full bg-brand-500" style={{ '--bar-delay': `${index * 100}ms` }} /></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="tentang" className="section-space bg-white">
          <div className="container-page grid gap-14 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
            <Reveal direction="left" className="relative">
              <div className="relative min-h-[500px] overflow-hidden border border-brand-200 bg-brand-50 shadow-soft sm:min-h-[480px]">
                <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,rgba(29,158,117,.14)_0_2px,transparent_3px)] [background-size:34px_34px]" />

                <div className="absolute inset-x-0 top-12 flex justify-center sm:top-10">
                  <div className="relative grid h-52 w-52 place-items-center rounded-full border border-brand-300 bg-white shadow-[0_28px_70px_rgba(23,53,46,.14)] sm:h-56 sm:w-56">
                    <div className="absolute inset-5 animate-spin rounded-full border border-dashed border-brand-300 [animation-duration:18s]" />
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-500 text-white sm:h-24 sm:w-24"><Recycle size={42}/></span>
                    {[['Pencatatan','-top-8 left-1/2 -translate-x-1/2'],['Logistik','top-1/2 -right-20 -translate-y-1/2 sm:-right-24'],['Fasilitas','-bottom-8 left-1/2 -translate-x-1/2'],['Traceability','top-1/2 -left-24 -translate-y-1/2 sm:-left-28']].map(([label,pos])=><span key={label} className={`absolute ${pos} whitespace-nowrap rounded-xl border border-brand-200 bg-white px-3 py-2 text-[11px] font-bold text-brand-700 shadow-soft sm:px-4 sm:text-xs`}>{label}</span>)}
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 right-5 grid gap-3 rounded-2xl border border-white/80 bg-white/92 p-4 shadow-[0_16px_42px_rgba(23,53,46,.10)] backdrop-blur sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-[.14em] text-brand-600">Circular economy</div>
                    <div className="mt-1 text-sm font-semibold leading-6 text-ink">Setiap liter UCO memiliki asal, status, dan rekam perjalanan.</div>
                  </div>
                  <div className="flex items-center gap-3 border-t border-brand-100 pt-3 sm:max-w-[220px] sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700"><Recycle size={20} /></span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600">Prinsip utama</div>
                      <div className="mt-1 text-sm font-bold leading-5 text-ink">Limbah menjadi aset sirkular</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={100}>
              <SectionHeading eyebrow="Tentang JELANTARA" title="Platform distribusi dan traceability, bukan produsen SAF" description="JELANTARA berfungsi sebagai lapisan manajemen rantai pasok digital. Proses konversi UCO menjadi SAF tetap dilakukan oleh mitra industri yang tersertifikasi." />
              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {['Mencatat volume UCO', 'Memverifikasi mutu awal', 'Menjadwalkan penjemputan', 'Mengoptimalkan rute', 'Menghitung insentif', 'Mendokumentasikan traceability'].map((item, index) => (
                  <div key={item} className="capability-row flex items-center gap-3 border-b border-border py-3 text-sm font-semibold text-ink" style={{ animationDelay: `${index * 70}ms` }}><CheckCircle2 size={18} className="text-brand-500" />{item}</div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="fitur" className="section-space relative overflow-hidden bg-soft">
          <div className="feature-glow absolute -right-40 top-20 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
          <div className="container-page relative">
            <Reveal><SectionHeading eyebrow="Lima modul utama" title="Satu platform, lima fungsi yang saling terhubung" description="Setiap modul memperkuat alur dari pencatatan di sumber hingga pembentukan rekam jejak batch." /></Reveal>
            <div className="feature-grid mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
              {features.map((f, index) => {
                const spanClass = index === 0
                  ? 'md:col-span-2 lg:col-span-7'
                  : index === 1
                    ? 'lg:col-span-5'
                    : 'lg:col-span-4'

                return (
                  <Reveal
                    key={f.title}
                    delay={index * 80}
                    as="article"
                    className={`feature-card feature-card-v43 group relative flex h-full min-h-[292px] flex-col overflow-hidden rounded-[18px] border border-border bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[0_26px_60px_rgba(23,53,46,.13)] ${spanClass} ${index === 0 ? 'feature-card-featured bg-gradient-to-br from-white via-white to-brand-50/70 lg:min-h-[332px] lg:p-8' : ''}`}
                  >
                    <div className="feature-card-accent" aria-hidden="true" />
                    <div className="relative flex items-start justify-between gap-4">
                      <span className={`grid place-items-center rounded-2xl bg-brand-100 text-brand-700 transition-all duration-500 group-hover:-rotate-3 group-hover:bg-brand-500 group-hover:text-white ${index === 0 ? 'h-14 w-14' : 'h-12 w-12'}`}>
                        <f.icon size={index === 0 ? 28 : 23} />
                      </span>
                    </div>

                    <div className={`relative mt-6 ${index === 0 ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_250px] lg:items-end lg:gap-8' : ''}`}>
                      <div>
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-600">{f.category}</div>
                        <h3 className={`mt-2 font-extrabold tracking-[-.02em] text-ink ${index === 0 ? 'text-2xl sm:text-[28px]' : 'text-xl'}`}>{f.title}</h3>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{f.text}</p>
                        {index === 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {['QR Code', 'Sensor wadah', 'Sinkronisasi'].map((item) => (
                              <span key={item} className="rounded-full border border-brand-200 bg-white px-3 py-2 text-[11px] font-bold text-brand-700 shadow-sm">{item}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className={index === 0 ? 'mt-6 lg:mt-0' : 'mt-6'}>
                        <FeatureMiniVisual index={index} />
                      </div>
                    </div>

                    <Link to={f.href} className="feature-card-link relative mt-auto inline-flex items-center gap-2 pt-6 text-sm font-extrabold text-brand-700">
                      Pelajari fitur
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-50 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-brand-500 group-hover:text-white"><ChevronRight size={15} /></span>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        <section id="cara-kerja" className="section-space bg-white">
          <div className="container-page">
            <Reveal><SectionHeading eyebrow="Cara kerja" title="Alur lima tahap dari dapur hingga fasilitas" description="Alur dirancang agar seluruh perpindahan material memiliki data asal, status, dan pihak penanggung jawab." align="center" /></Reveal>
            <WorkflowJourney />
          </div>
        </section>

        <section id="mitra" className="section-space relative overflow-hidden bg-ink text-white">
          <div className="dark-grid absolute inset-0 opacity-20" />
          <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="container-page relative grid items-center gap-12 lg:grid-cols-[.82fr_1.18fr]">
            <Reveal direction="left">
              <div className="rounded-[28px] border border-white/15 bg-white/[0.07] p-6 shadow-[0_24px_70px_rgba(0,0,0,.16)] backdrop-blur-md sm:p-8">
                <SectionHeading
                  eyebrow="Stakeholder ecosystem"
                  title="JELANTARA menjadi simpul data di tengah ekosistem multipihak"
                  description="Setiap pihak mengakses fungsi berbeda, tetapi seluruh proses bertemu dalam satu rekam data yang konsisten."
                  light
                />
              </div>
            </Reveal>
            <Reveal direction="right" delay={120}><StakeholderEcosystem /></Reveal>
          </div>
        </section>

        <section id="dampak" className="section-space bg-white">
          <div className="container-page">
            <Reveal><SectionHeading eyebrow="Dampak" title="Nilai lingkungan, ekonomi, dan operasional dalam satu alur" description="Rancangan JELANTARA menghubungkan circular economy dengan kebutuhan visibilitas pasokan dan kepatuhan rantai pasok." /></Reveal>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {impactGroups.map((g, index) => (
                <Reveal key={g.title} delay={index * 100} as="article" className="impact-card group relative overflow-hidden border-t-4 border-brand-500 bg-soft p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-soft">
                  <div className="absolute right-0 top-0 h-28 w-28 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100 transition-transform duration-700 group-hover:scale-150" />
                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-sm"><g.icon /></span><h3 className="relative mt-5 text-xl font-extrabold">{g.title}</h3>
                  <ul className="relative mt-4 space-y-3">{g.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted"><CheckCircle2 className="mt-1 shrink-0 text-brand-500" size={16} />{item}</li>)}</ul>
                </Reveal>
              ))}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[['7','Energi Bersih'],['12','Konsumsi & Produksi'],['13','Penanganan Iklim']].map(([number,label], index) => <Reveal key={number} delay={index * 80}><div className="sdg-card group border border-brand-200 bg-brand-50 p-5 text-center transition hover:border-brand-500 hover:bg-brand-100"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-xl font-black text-white">SDG {number}</div><div className="mt-3 text-sm font-bold text-brand-700">{label}</div></div></Reveal>)}
            </div>
          </div>
        </section>

        <section className="section-space relative overflow-hidden bg-brand-100">
          <div className="stats-pattern absolute inset-0 opacity-30" />
          <div className="container-page relative">
            <Reveal><SectionHeading eyebrow="Strategi implementasi" title="Bertahap, terukur, dan berbasis kemitraan" description="Rancangan tahapan implementasi prototype." /></Reveal>
            <div className="implementation-line relative mt-10 grid gap-5 lg:grid-cols-4">
              {implementation.map((item, index) => (
                <Reveal key={item.step} delay={index * 100} as="article" className="implementation-card group relative border border-white bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-brand-300">
                  <div className="absolute left-0 top-0 h-1 w-0 bg-brand-500 transition-all duration-700 group-hover:w-full" />
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">{item.step}</div><h3 className="mt-3 font-extrabold text-ink">{item.title}</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">{item.items.map(x => <li key={x} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{x}</li>)}</ul>
                  <span className="absolute right-5 top-5 text-4xl font-black text-brand-100 transition-transform duration-500 group-hover:scale-110">0{index + 1}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space bg-white">
          <div className="container-page">
            <Reveal><SectionHeading eyebrow="Analisis SWOT" title="Kekuatan inovasi dan risiko adopsi dilihat secara seimbang" description="Klik setiap kuadran untuk menelusuri analisis SWOT JELANTARA secara interaktif." /></Reveal>
            <Reveal delay={100}><SwotExplorer /></Reveal>
          </div>
        </section>

        <section className="cta-premium relative overflow-hidden bg-brand-500 py-16 text-white">
          <div className="dark-grid absolute inset-0 opacity-15" />
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[50px] border-white/5" />
          <div className="container-page relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <Reveal direction="left"><div><div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Prototype competition-ready</div><h2 className="mt-3 max-w-3xl font-[Manrope] text-3xl font-extrabold tracking-tight sm:text-4xl">Bangun Rantai Pasok Jelantah yang Terukur dan Berkelanjutan</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">Masuk ke dashboard untuk melihat pencatatan volume, optimasi rute, verifikasi mutu, insentif, dan traceability bekerja sebagai satu alur.</p></div></Reveal>
            <Reveal direction="right" delay={100}><div className="flex flex-col gap-3 sm:flex-row"><Link to="/login" className="premium-button rounded-xl bg-white px-5 py-3 font-bold text-brand-700 shadow-lg">Jelajahi Prototype</Link><Link to="/admin" className="premium-button rounded-xl border border-white/50 px-5 py-3 font-bold text-white backdrop-blur">Lihat Dashboard</Link></div></Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
