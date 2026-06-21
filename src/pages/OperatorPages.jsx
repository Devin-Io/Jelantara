import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CalendarClock, ChevronLeft, ChevronRight, Clock3, Cpu, Droplets, FileCheck2, QrCode, Save, Search, ShieldCheck, WalletCards, XCircle } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import { ChartCard, QualityScore } from '../components/dashboard/Widgets'
import { DataTable, EmptyState, InfoBox, Modal, PageHeader, StatCard, StatusBadge, Toast } from '../components/common/UI'
import { CountUp } from '../components/common/Motion'
import { operatorMenu } from '../data/content'
import { useAppData } from '../hooks/useAppData'
import { batchStatusLabels, formatDateTime, getBatchTone } from '../utils/batchUtils'
import IncentivePage from './SharedModules'

const currency = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`
const shortDate = (value) => new Intl.DateTimeFormat('id-ID', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(value))

function useCountdown(target) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (!target) return undefined
    const update = () => {
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) return setText('Jadwal sedang berlangsung')
      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      setText(`${hours} jam ${minutes} menit lagi`)
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [target])
  return text
}

function buildWeekly(records) {
  const names = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
  const points = []
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date()
    date.setHours(0,0,0,0)
    date.setDate(date.getDate() - offset)
    const key = date.toISOString().slice(0,10)
    points.push({ name:names[date.getDay()], date:key, volume:records.filter((r)=>r.date===key).reduce((sum,r)=>sum+Number(r.volume),0) })
  }
  return points
}

function buildMonthly(records) {
  const now = new Date()
  return Array.from({length:6}, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5-index), 1)
    const year = date.getFullYear(); const month = date.getMonth()
    return { name:new Intl.DateTimeFormat('id-ID',{month:'short'}).format(date), volume:records.filter((r)=>{const d=new Date(r.date); return d.getFullYear()===year && d.getMonth()===month}).reduce((sum,r)=>sum+Number(r.volume),0) }
  })
}

export function OperatorDashboard() {
  const { state } = useAppData()
  const navigate = useNavigate()
  const monthKey = new Date().toISOString().slice(0,7)
  const monthVolume = state.volumeRecords.filter((r)=>r.date.startsWith(monthKey)).reduce((sum,r)=>sum+Number(r.volume),0)
  const waitingVolume = state.batches.filter((b)=>['recorded','scheduled'].includes(b.status)).reduce((sum,b)=>sum+b.volume,0)
  const distributed = state.batches.filter((b)=>['received','document_completed'].includes(b.status)).reduce((sum,b)=>sum+b.volume,0)
  const incentiveTotal = state.incentiveTransactions.reduce((sum,item)=>sum+item.total,0)
  const percent = Math.round((state.container.currentVolume/state.container.capacity)*100)
  const weekly = useMemo(()=>buildWeekly(state.volumeRecords),[state.volumeRecords])
  const monthly = useMemo(()=>buildMonthly(state.volumeRecords),[state.volumeRecords])
  const schedule = [...state.pickupSchedules].filter((x)=>!['completed'].includes(x.status)).sort((a,b)=>new Date(a.scheduledAt)-new Date(b.scheduledAt))[0]
  const scheduledBatch = schedule && state.batches.find((b)=>b.batchId===schedule.batchId)
  const countdown = useCountdown(schedule?.scheduledAt)
  const quality = [...state.qualityResults].sort((a,b)=>new Date(b.checkedAt)-new Date(a.checkedAt))[0]

  const stats = [
    [Droplets, 'Volume UCO bulan ini', <><CountUp end={monthVolume} duration={900}/> L</>, 'Dihitung dari pencatatan global state'],
    [CalendarClock, 'Menunggu dijemput', <><CountUp end={waitingVolume} duration={900}/> L</>, 'Batch recorded dan scheduled'],
    [FileCheck2, 'Total tersalurkan', <><CountUp end={distributed} duration={900}/> L</>, 'Batch diterima fasilitas'],
    [WalletCards, 'Estimasi insentif', currency(incentiveTotal), 'Nominal simulasi, bukan harga pasar'],
    [AlertTriangle, 'Kapasitas wadah', `${percent}%`, `${state.container.currentVolume} dari ${state.container.capacity} liter`],
  ]

  return (
    <DashboardLayout menu={operatorMenu} contextLabel="SPPG Banjarbaru Utara" locationLabel="Banjarbaru, Kalimantan Selatan">
      <PageHeader title="Ringkasan Operator SPPG" description="Seluruh kartu, grafik, jadwal, mutu, dan aktivitas mengambil data dari state prototype yang sama dan berubah tanpa reload." />
      {percent >= 85 ? <InfoBox tone="warning"><strong>Prioritas penjemputan:</strong> kapasitas wadah mencapai {percent}%. Batch baru otomatis masuk jadwal logistik.</InfoBox> : <InfoBox><strong>Status aman:</strong> kapasitas wadah {percent}%. Sistem akan membuat jadwal prioritas setelah mencapai 85%.</InfoBox>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([Icon, label, value, detail], index) => <StatCard key={label} icon={Icon} label={label} value={value} detail={detail} accent={index === 4} />)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Volume tujuh hari" subtitle="Data simulasi dari volumeRecords · diperbarui otomatis">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weekly}><defs><linearGradient id="volumeFillV3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1D9E75" stopOpacity={0.38}/><stop offset="95%" stopColor="#1D9E75" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#D9E8E3"/><XAxis dataKey="name" tick={{fontSize:12}}/><YAxis tick={{fontSize:12}}/><Tooltip formatter={(v)=>[`${v} L`,'Volume']}/><Area isAnimationActive animationDuration={900} type="monotone" dataKey="volume" stroke="#1D9E75" fill="url(#volumeFillV3)" strokeWidth={2.5}/></AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Tren enam bulan" subtitle="Akumulasi data simulasi per bulan">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="#D9E8E3"/><XAxis dataKey="name" tick={{fontSize:12}}/><YAxis tick={{fontSize:12}}/><Tooltip formatter={(v)=>[`${v} L`,'Volume']}/><Bar isAnimationActive animationDuration={950} dataKey="volume" fill="#5DCAA5" radius={[6,6,0,0]}/></BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <ChartCard title="Penjemputan berikutnya" subtitle={countdown || 'Belum ada jadwal aktif'}>
          {schedule && scheduledBatch ? <>
            <div className="grid gap-4 sm:grid-cols-3">
              {[["Tanggal",shortDate(schedule.scheduledAt)],["Waktu",schedule.window],["Mitra",schedule.partner]].map(([label,value])=><div key={label} className="border border-border bg-soft p-4"><div className="text-xs text-muted">{label}</div><div className="mt-1 text-sm font-bold text-ink">{value}</div></div>)}
            </div>
            <div className="mt-4 border-l-4 border-brand-500 bg-brand-50 p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><button onClick={()=>navigate(`/traceability?batch=${scheduledBatch.batchId}`)} className="text-left text-sm font-semibold text-ink hover:text-brand-700">{scheduledBatch.batchId}</button><div className="mt-1 text-xs text-muted">Estimasi volume {scheduledBatch.volume} liter · Kendaraan {schedule.vehicle}</div></div><StatusBadge tone="warning">{schedule.status==='armada_assigned'?'Armada ditugaskan':schedule.status}</StatusBadge></div>
              <div className="mt-4 grid grid-cols-5 gap-1" aria-label="Progress penjemputan">{['Dijadwalkan','Armada','Menuju','Tiba','Selesai'].map((label,index)=><div key={label}><div className={`h-1.5 rounded-full ${index <= (schedule.status==='arrived'?3:schedule.status==='en_route'?2:schedule.status==='armada_assigned'?1:0)?'bg-brand-500':'bg-border'}`}/><div className="mt-1 text-[9px] text-muted">{label}</div></div>)}</div>
            </div>
          </> : <EmptyState title="Belum ada jadwal" description="Catat volume hingga kapasitas mencapai 85% untuk membuat jadwal prioritas."/>}
        </ChartCard>
        <ChartCard title="Status kualitas terakhir" subtitle="Pemeriksaan awal · bukan hasil laboratorium">
          {quality ? <div><QualityScore score={quality.score} grade={quality.grade}/><div className="mt-5 grid grid-cols-2 gap-3 text-xs"><div className="bg-soft p-3"><span className="text-muted">Warna</span><strong className="mt-1 block text-ink">{quality.color}</strong></div><div className="bg-soft p-3"><span className="text-muted">Kekeruhan</span><strong className="mt-1 block text-ink">{quality.turbidity}</strong></div></div><button onClick={()=>navigate(`/logistik/verifikasi?batch=${quality.batchId}`)} className="btn-secondary mt-4 w-full">Lihat Detail Verifikasi</button></div> : <EmptyState title="Belum ada hasil mutu" description="Hasil akan muncul setelah petugas logistik menyimpan verifikasi."/>}
        </ChartCard>
      </div>
      <div className="mt-6">
        <ChartCard title="Aktivitas terbaru" subtitle="Terhubung dengan aksi lintas role">
          <div className="divide-y divide-border">{state.activities.slice(0,8).map((item)=><div key={item.id} className="flex flex-col justify-between gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"><div><div className="text-sm font-medium text-ink">{item.title}</div><div className="mt-1 text-xs text-muted">{item.detail}</div></div><div className="text-xs text-muted">{formatDateTime(item.timestamp)}</div></div>)}</div>
        </ChartCard>
      </div>
    </DashboardLayout>
  )
}

export function VolumeLogPage() {
  const { state, addVolumeRecord, updateSensor } = useAppData()
  const [form, setForm] = useState({ id:state.container.sppgId, date:new Date().toISOString().slice(0,10), volume:'', capacity:state.container.capacity, condition:state.container.condition, notes:'' })
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [sensorLoading, setSensorLoading] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [qrStatus, setQrStatus] = useState('ready')
  const percent = Math.min(100, Math.round((state.container.currentVolume / Number(form.capacity || 1)) * 100))

  const save = (e) => {
    e.preventDefault()
    if (!form.id.trim()) return setError('ID SPPG wajib diisi atau dipindai.')
    if (!form.volume || Number(form.volume) <= 0) return setError('Volume harus lebih dari 0 liter.')
    if (Number(form.volume) + state.container.currentVolume > Number(form.capacity)) return setError('Volume baru melebihi kapasitas wadah.')
    const result = addVolumeRecord({ sppgId:form.id,date:form.date,volume:Number(form.volume),capacity:Number(form.capacity),condition:form.condition,notes:form.notes })
    setForm((current)=>({...current,volume:'',notes:''}))
    setError('')
    setToast(`Pencatatan berhasil. Batch ${result.batchId} dibuat${result.scheduled ? ' dan masuk jadwal prioritas.' : '.'}`)
  }

  const simulateSensor = () => {
    setSensorLoading(true)
    setTimeout(() => {
      const value = Math.min(Number(form.capacity), 486 + Math.floor(Math.random()*24))
      updateSensor(value)
      setSensorLoading(false)
      setToast(`Sensor terhubung. Pembacaan baru ${value} liter.`)
    }, 1300)
  }

  const startQr = () => {
    setQrOpen(true); setQrStatus('scanning')
    setTimeout(()=>{ setForm((current)=>({...current,id:'SPPG-BJB-UTR-001'})); setQrStatus('success') },1500)
  }

  return (
    <DashboardLayout menu={operatorMenu} contextLabel="SPPG Banjarbaru Utara" locationLabel="Banjarbaru, Kalimantan Selatan">
      <PageHeader title="Catat Volume UCO" description="Pencatatan ini membuat batch baru, memperbarui grafik dan dashboard, serta menjadwalkan penjemputan ketika wadah mencapai 85%." />
      <div className="grid gap-6 xl:grid-cols-[1fr_.72fr]">
        <form onSubmit={save} className="border border-border bg-white p-5 shadow-soft sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label className="label" htmlFor="sppg-id">ID SPPG</label><input id="sppg-id" className="input-field" value={form.id} onChange={(e)=>setForm({...form,id:e.target.value})}/></div>
            <div><label className="label" htmlFor="date">Tanggal pencatatan</label><input id="date" type="date" className="input-field" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})}/></div>
            <div><label className="label" htmlFor="volume">Volume baru (liter)</label><input id="volume" type="number" min="1" className="input-field" placeholder="Contoh demo: 24" value={form.volume} onChange={(e)=>setForm({...form,volume:e.target.value})}/></div>
            <div><label className="label" htmlFor="capacity">Kapasitas wadah (liter)</label><input id="capacity" type="number" min="1" className="input-field" value={form.capacity} onChange={(e)=>setForm({...form,capacity:e.target.value})}/></div>
            <div className="sm:col-span-2"><label className="label" htmlFor="condition">Kondisi wadah</label><select id="condition" className="input-field" value={form.condition} onChange={(e)=>setForm({...form,condition:e.target.value})}><option>Baik dan tertutup</option><option>Perlu dibersihkan</option><option>Ada kebocoran kecil</option><option>Tidak layak digunakan</option></select></div>
            <div className="sm:col-span-2"><label className="label" htmlFor="notes">Catatan</label><textarea id="notes" rows="4" className="input-field" placeholder="Tambahkan kondisi khusus bila diperlukan." value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})}/></div>
          </div>
          {error && <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700"><XCircle size={17}/>{error}</div>}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="submit" className="btn-primary"><Save size={18}/> Simpan pencatatan</button>
            <button type="button" onClick={startQr} className="btn-secondary"><QrCode size={18}/> Simulasi scan QR</button>
            <button type="button" disabled={sensorLoading} onClick={simulateSensor} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"><Cpu className={sensorLoading?'animate-spin':''} size={18}/>{sensorLoading?'Membaca sensor...':'Ambil data sensor'}</button>
          </div>
        </form>
        <div className="space-y-6">
          <section className={`border bg-white p-6 shadow-soft transition ${percent>=95?'container-priority border-red-300':percent>=85?'container-priority border-amber-300':'border-border'}`}>
            <div className="flex items-center justify-between"><h2 className="font-bold text-ink">Kapasitas wadah</h2><StatusBadge tone={percent>=85?'warning':percent>=75?'info':'success'}>{percent}% terisi</StatusBadge></div>
            <div className="mt-8 flex items-end justify-center gap-6">
              <div className="liquid-container relative h-64 w-40 overflow-hidden rounded-b-3xl border-4 border-border bg-soft">
                <div className="liquid-fill absolute bottom-0 left-0 right-0 bg-brand-400 transition-[height] duration-1000 ease-out" style={{height:`${percent}%`}}><span className="liquid-wave"/></div>
                <div className="absolute inset-0 grid place-items-center"><div className="rounded-xl bg-white/90 px-4 py-3 text-center shadow"><div className="text-2xl font-bold text-ink"><CountUp end={state.container.currentVolume} duration={700}/> L</div><div className="text-xs text-muted">dari {form.capacity} L</div></div></div>
              </div>
            </div>
            <div className="mt-5 grid gap-2 text-center text-xs text-muted"><div><span className="inline-block h-2 w-2 rounded-full bg-brand-500"/> Sensor {state.container.sensorStatus==='connected'?'terhubung':'offline'}</div><div>Pembacaan: {formatDateTime(state.container.lastReadAt)}</div></div>
          </section>
          <InfoBox tone={percent>=85?'warning':'info'}>{percent>=85?'Ambang 85% tercapai. Pencatatan berikutnya akan membuat rekomendasi penjemputan prioritas.':'Saat kapasitas mencapai 85%, sistem akan membuat rekomendasi penjemputan prioritas.'}</InfoBox>
        </div>
      </div>
      <Modal open={qrOpen} onClose={()=>setQrOpen(false)} title="Simulasi Pemindaian QR" size="max-w-md">
        <div className="text-center"><div className="qr-scanner relative mx-auto grid h-64 w-64 place-items-center overflow-hidden rounded-2xl border-2 border-brand-300 bg-brand-50"><QrCode size={110} className="text-brand-300"/>{qrStatus==='scanning'&&<span className="qr-scan-line"/>}{qrStatus==='success'&&<div className="absolute inset-0 grid place-items-center bg-brand-500/90 text-white"><div><ShieldCheck className="mx-auto" size={44}/><div className="mt-3 font-bold">QR terverifikasi</div></div></div>}</div><p className="mt-4 text-sm text-muted">{qrStatus==='scanning'?'Mencocokkan identitas SPPG pada data dummy...':'ID SPPG-BJB-UTR-001 berhasil dimasukkan ke formulir.'}</p><button disabled={qrStatus!=='success'} onClick={()=>setQrOpen(false)} className="btn-primary mt-5 disabled:opacity-40">Gunakan ID SPPG</button></div>
      </Modal>
      <Toast message={toast} onClose={()=>setToast('')} />
    </DashboardLayout>
  )
}


export function OperatorSchedulePage() {
  const { state } = useAppData()
  const navigate = useNavigate()
  const schedules = [...state.pickupSchedules].sort((a,b)=>new Date(a.scheduledAt)-new Date(b.scheduledAt))
  const scheduleLabel = { scheduled:'Dijadwalkan', armada_assigned:'Armada ditugaskan', en_route:'Menuju lokasi', arrived:'Tiba', completed:'Selesai' }
  const scheduleTone = (value) => value==='completed'?'success':value==='en_route'||value==='arrived'?'info':'warning'
  return <DashboardLayout menu={operatorMenu} contextLabel="SPPG Banjarbaru Utara"><PageHeader title="Jadwal Penjemputan" description="Jadwal dibuat dari batch yang melewati ambang kapasitas dan berubah mengikuti perjalanan mitra logistik."/>{schedules.length?<div className="grid gap-4">{schedules.map((schedule)=>{const batch=state.batches.find((b)=>b.batchId===schedule.batchId);return <article key={schedule.id} className="premium-card border border-border bg-white p-5 shadow-soft"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><button onClick={()=>navigate(`/traceability?batch=${schedule.batchId}`)} className="font-bold text-ink hover:text-brand-700">{schedule.batchId}</button><div className="mt-2 text-sm text-muted">{batch?.volume||0} L · {schedule.partner} · {schedule.vehicle}</div><div className="mt-1 text-xs text-muted">{formatDateTime(schedule.scheduledAt)} · {schedule.window}</div></div><StatusBadge tone={scheduleTone(schedule.status)}>{scheduleLabel[schedule.status]||schedule.status}</StatusBadge></div><div className="mt-5 grid grid-cols-5 gap-1">{['scheduled','armada_assigned','en_route','arrived','completed'].map((status,index)=>{const current=['scheduled','armada_assigned','en_route','arrived','completed'].indexOf(schedule.status);return <div key={status}><div className={`h-1.5 rounded-full ${index<=current?'bg-brand-500':'bg-border'}`}/><div className="mt-1 text-[9px] text-muted">{scheduleLabel[status]}</div></div>})}</div></article>})}</div>:<EmptyState title="Belum ada jadwal" description="Jadwal muncul otomatis ketika kapasitas wadah mencapai minimal 85%."/>}</DashboardLayout>
}

export function OperatorHistoryPage() {
  const { state } = useAppData()
  const [query,setQuery]=useState(''); const [quality,setQuality]=useState('Semua'); const [sortAsc,setSortAsc]=useState(false); const [page,setPage]=useState(1); const [selected,setSelected]=useState(null)
  const rows = state.batches.map((batch)=>{
    const record=state.volumeRecords.find((x)=>x.batchId===batch.batchId); const incentive=state.incentiveTransactions.find((x)=>x.batchId===batch.batchId)
    return { id:batch.batchId,date:record?.date||batch.createdAt.slice(0,10),volume:batch.volume,quality:batch.qualityGrade||'Belum diverifikasi',pickup:batchStatusLabels[batch.status]||batch.status,partner:batch.logisticsPartner,incentive:incentive?.status||'pending',status:batch.status }
  })
  const pageSize=6
  const filtered=rows.filter((r)=>(r.id.toLowerCase().includes(query.toLowerCase())||r.partner.toLowerCase().includes(query.toLowerCase()))&&(quality==='Semua'||r.quality===quality)).sort((a,b)=>sortAsc?a.volume-b.volume:b.volume-a.volume)
  const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize)); const pageRows=filtered.slice((page-1)*pageSize,page*pageSize)
  const columns=[
    {key:'id',label:'Batch ID',render:(v)=><span className="font-semibold text-ink">{v}</span>},{key:'date',label:'Tanggal',render:(v)=>shortDate(v)},{key:'volume',label:'Volume',render:(v)=>`${v} L`},{key:'quality',label:'Status mutu',render:(v)=><StatusBadge tone={v==='Grade A'?'success':v==='Grade B'?'warning':v==='Grade C'?'error':'neutral'}>{v}</StatusBadge>},{key:'pickup',label:'Alur batch'},{key:'partner',label:'Mitra logistik'},{key:'incentive',label:'Insentif',render:(v)=><StatusBadge tone={v==='paid'?'success':v==='processing'?'info':'warning'}>{v}</StatusBadge>},
  ]
  return <DashboardLayout menu={operatorMenu} contextLabel="SPPG Banjarbaru Utara"><PageHeader title="Riwayat UCO" description="Data berasal dari batch dan transaksi global; pencatatan baru langsung muncul di tabel ini."/><div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px_auto]"><div className="relative"><Search className="absolute left-3.5 top-3.5 text-muted" size={18}/><input className="input-field pl-11" placeholder="Cari Batch ID atau mitra..." value={query} onChange={(e)=>{setQuery(e.target.value);setPage(1)}}/></div><select className="input-field" value={quality} onChange={(e)=>{setQuality(e.target.value);setPage(1)}}><option>Semua</option><option>Grade A</option><option>Grade B</option><option>Grade C</option><option>Belum diverifikasi</option></select><button onClick={()=>setSortAsc(!sortAsc)} className="btn-secondary">Urut volume {sortAsc?'↑':'↓'}</button></div><DataTable columns={columns} rows={pageRows} onRowClick={setSelected}/><div className="mt-4 flex items-center justify-between"><div className="text-xs text-muted">Halaman {page} dari {totalPages} · {filtered.length} data</div><div className="flex gap-2"><button className="rounded-lg border border-border p-2 disabled:opacity-40" disabled={page===1} onClick={()=>setPage((p)=>p-1)} aria-label="Halaman sebelumnya"><ChevronLeft/></button><button className="rounded-lg border border-border p-2 disabled:opacity-40" disabled={page===totalPages} onClick={()=>setPage((p)=>p+1)} aria-label="Halaman berikutnya"><ChevronRight/></button></div></div><Modal open={Boolean(selected)} onClose={()=>setSelected(null)} title={`Detail ${selected?.id||''}`}>{selected&&<div className="grid gap-4 sm:grid-cols-2">{Object.entries(selected).filter(([key])=>key!=='status').map(([key,value])=><div key={key} className="border border-border bg-soft p-4"><div className="text-xs font-semibold uppercase tracking-[.08em] text-muted">{key}</div><div className="mt-1 text-sm font-bold text-ink">{value}{key==='volume'?' liter':''}</div></div>)}<div className="sm:col-span-2"><StatusBadge tone={getBatchTone(selected.status)}>{batchStatusLabels[selected.status]}</StatusBadge></div></div>}</Modal></DashboardLayout>
}

export function OperatorIncentivePage() { return <IncentivePage menu={operatorMenu} contextLabel="SPPG Banjarbaru Utara"/> }
