import { useMemo, useState } from 'react'
import { CheckCircle2, ClipboardCheck, Database, Factory, FileCheck2, ScanLine, ShieldAlert, Truck } from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import { ChartCard } from '../components/dashboard/Widgets'
import { DataTable, EmptyState, InfoBox, PageHeader, StatCard, StatusBadge, Toast } from '../components/common/UI'
import { processingMenu } from '../data/content'
import { useAppData } from '../hooks/useAppData'
import { formatDateTime } from '../utils/batchUtils'

const receiptLabels={en_route:'Dalam perjalanan',arrived:'Kedatangan dikonfirmasi',documents_checked:'Dokumen diperiksa',accepted:'Diterima',review_requested:'Pemeriksaan tambahan'}
const receiptTone=(status)=>status==='accepted'?'success':status==='review_requested'?'warning':status==='en_route'?'info':'neutral'

export default function ProcessingPage() {
  const {state,confirmFacilityArrival,checkDocuments,acceptBatch,requestReview}=useAppData()
  const [toast,setToast]=useState('')
  const rows=useMemo(()=>state.processingReceipts.map((receipt)=>{
    const batch=state.batches.find((item)=>item.batchId===receipt.batchId)
    return {...receipt,id:receipt.batchId,source:batch?.sppgName||'-',volume:batch?.volume||0,quality:batch?.qualityGrade||'Belum diverifikasi',vehicle:batch?.vehicle||'-'}
  }),[state.processingReceipts,state.batches])
  const accepted=rows.filter((r)=>r.status==='accepted')
  const review=rows.filter((r)=>r.status==='review_requested')
  const totalAccepted=accepted.reduce((sum,r)=>sum+r.volume,0)
  const docsComplete=rows.length?Math.round(rows.filter((r)=>r.documentsChecked).length/rows.length*100):0
  const act=(fn,batchId,message)=>{fn(batchId);setToast(message)}
  const columns=[
    {key:'id',label:'Batch ID',render:(v)=><span className="font-semibold text-ink">{v}</span>},
    {key:'source',label:'Asal SPPG'},
    {key:'volume',label:'Volume',render:(v)=>`${v} L`},
    {key:'quality',label:'Mutu awal',render:(v)=><StatusBadge tone={v==='Grade A'?'success':v==='Grade B'?'warning':v==='Grade C'?'error':'neutral'}>{v}</StatusBadge>},
    {key:'vehicle',label:'Kendaraan'},
    {key:'status',label:'Status',render:(v)=><StatusBadge tone={receiptTone(v)}>{receiptLabels[v]||v}</StatusBadge>},
    {key:'action',label:'Aksi',render:(_,row)=><div className="flex min-w-[410px] flex-wrap gap-2">
      <button disabled={row.arrivalConfirmed||row.status==='accepted'} onClick={(e)=>{e.stopPropagation();act(confirmFacilityArrival,row.id,`Kedatangan ${row.id} dikonfirmasi.`)}} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-brand-700 disabled:cursor-not-allowed disabled:opacity-35">Konfirmasi Kedatangan</button>
      <button disabled={!row.arrivalConfirmed||row.documentsChecked||row.status==='accepted'} onClick={(e)=>{e.stopPropagation();act(checkDocuments,row.id,`Dokumen ${row.id} diperiksa.`)}} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-brand-700 disabled:cursor-not-allowed disabled:opacity-35">Periksa Dokumen</button>
      <button disabled={!row.documentsChecked||row.status==='accepted'} onClick={(e)=>{e.stopPropagation();act(acceptBatch,row.id,`Batch ${row.id} diterima. Insentif masuk status processing.`)}} className="rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-35">Terima Batch</button>
      <button disabled={row.status==='accepted'||row.status==='review_requested'} onClick={(e)=>{e.stopPropagation();act(requestReview,row.id,`Pemeriksaan tambahan untuk ${row.id} diminta.`)}} className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 disabled:cursor-not-allowed disabled:opacity-35">Minta Review</button>
    </div>},
  ]
  return <DashboardLayout menu={processingMenu} contextLabel="Mitra Fasilitas Pengolahan" locationLabel="Mode simulasi penerimaan"><PageHeader title="Dashboard Mitra Pengolahan" description="Batch yang dikirim dari dashboard logistik masuk ke antrean ini. Aksi penerimaan memperbarui status batch, traceability, insentif, operator, dan administrator."/><InfoBox tone="warning">Penerimaan pada prototype hanya menutup tahap distribusi dan chain of custody. Kelayakan bahan baku tetap memerlukan pengujian fasilitas dan standar yang berlaku.</InfoBox><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={Database} label="Antrean batch" value={`${rows.filter((r)=>r.status!=='accepted').length} batch`} detail="Dalam perjalanan atau menunggu proses"/><StatCard icon={Factory} label="Volume diterima" value={`${totalAccepted} L`} detail="Akumulasi batch diterima"/><StatCard icon={ScanLine} label="Perlu review" value={`${review.length} batch`} detail="Memerlukan pemeriksaan tambahan"/><StatCard icon={FileCheck2} label="Dokumen diperiksa" value={`${docsComplete}%`} detail="Kelengkapan record simulasi"/></div><div className="mt-6">{rows.length?<DataTable columns={columns} rows={rows}/>:<EmptyState title="Belum ada batch masuk" description="Selesaikan rute logistik dan kirim batch ke fasilitas agar antrean muncul."/>}</div><div className="mt-6 grid gap-6 lg:grid-cols-2"><ChartCard title="Checklist penerimaan" subtitle="Urutan aksi memiliki disabled state"><div className="space-y-3">{[[Truck,'Konfirmasi kendaraan dan kedatangan'],[ClipboardCheck,'Periksa Batch ID serta dokumen'],[ScanLine,'Tinjau hasil mutu awal'],[ShieldAlert,'Minta pemeriksaan tambahan bila perlu'],[CheckCircle2,'Terima batch dan proses insentif']].map(([Icon,label],index)=><div key={label} className="flex items-center gap-3 border border-border p-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-brand-700"><Icon size={17}/></span><span className="text-sm font-medium text-ink">{index+1}. {label}</span></div>)}</div></ChartCard><ChartCard title="Batas tanggung jawab platform"><div className="border-l-4 border-brand-500 bg-brand-50 p-5 text-sm leading-7 text-muted">JELANTARA mencatat distribusi, mutu awal, penerimaan, dan rekam jejak. Konversi UCO menjadi Sustainable Aviation Fuel dilakukan sepenuhnya oleh mitra industri tersertifikasi, di luar fungsi prototype.</div></ChartCard></div><Toast message={toast} onClose={()=>setToast('')}/></DashboardLayout>
}
