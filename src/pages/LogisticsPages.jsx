import { useMemo, useState } from 'react'
import { CheckCircle2, Clock3, Factory, MapPin, Navigation, PackageCheck, Play, Route, Send, Sparkles, Truck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import { ChartCard, RouteSummary } from '../components/dashboard/Widgets'
import { InfoBox, PageHeader, StatCard, StatusBadge, Toast } from '../components/common/UI'
import { logisticsMenu } from '../data/content'
import { useAppData } from '../hooks/useAppData'
import { journeyLabels, stopLabels } from '../utils/routeUtils'

const routeTone = (status) => ['arrived','quality_check'].includes(status) ? 'warning' : ['delivering','facility_received'].includes(status) ? 'info' : status==='ready' ? 'neutral' : 'success'
const statusTone = (status) => status==='completed'?'success':status==='verified'?'info':['arrived','verifying'].includes(status)?'warning':status==='active'?'info':'neutral'

export function LogisticsDashboard() {
  const { state, startRoute, markArrived, beginQuality, completePickup, sendToFacility } = useAppData()
  const navigate = useNavigate()
  const [toast,setToast]=useState('')
  const route = state.logisticsRoutes[0]
  const active = route.stops[route.currentStopIndex]
  const completed = route.stops.filter((s)=>s.status==='completed').length
  const delayed = route.stops.filter((s)=>s.status==='delayed').length
  const totalVolume = route.stops.reduce((sum,s)=>sum+s.volume,0)
  const activeBatch = active && state.batches.find((b)=>b.batchId===active.batchId)
  const canStart = ['ready','next_stop'].includes(route.journeyStatus) && Boolean(active)
  const canArrive = ['started','next_stop'].includes(route.journeyStatus)
  const canVerify = route.journeyStatus==='arrived'
  const hasQuality = activeBatch?.qualityGrade && active?.status==='verified'
  const canComplete = hasQuality && ['quality_check','arrived'].includes(route.journeyStatus)
  const canSend = route.journeyStatus==='completed'
  const vehiclePosition = route.journeyStatus==='ready' ? {x:4,y:88} : route.journeyStatus==='facility_received'||route.journeyStatus==='delivering' ? {x:94,y:8} : {x:active?.x||4,y:active?.y||88}

  const doStart=()=>{startRoute();setToast(`Armada ${route.vehicle} bergerak menuju ${active?.name}.`)}
  const doArrive=()=>{markArrived();setToast(`Kedatangan di ${active?.name} disimpan.`)}
  const doVerify=()=>{beginQuality();navigate(`/logistik/verifikasi?batch=${active.batchId}&from=logistik`)}
  const doComplete=()=>{completePickup();setToast(`Batch ${active.batchId} dimuat. Status rute dan kapasitas armada diperbarui.`)}
  const doSend=()=>{sendToFacility();setToast('Seluruh batch dikirim ke antrean fasilitas pengolahan.')}

  const stats = [
    [MapPin,'Titik penjemputan',`${route.stops.length} lokasi`,`${completed} telah selesai`],
    [PackageCheck,'Estimasi volume',`${totalVolume} L`,'Total seluruh titik rute'],
    [Route,'Jarak rute',`${route.optimized?route.distanceAfter:route.distanceBefore} km`,route.optimized?'Hasil optimasi simulasi':'Sebelum optimasi'],
    [Truck,'Kapasitas armada',`${route.vehicleLoad}/${route.capacity} L`,`${Math.round(route.vehicleLoad/route.capacity*100)}% terpakai`],
    [CheckCircle2,'Selesai',`${completed} titik`,active?`Aktif: ${active.name}`:'Tidak ada titik aktif'],
    [Clock3,'Tertunda',`${delayed} titik`,'Dihitung dari status rute'],
  ]

  return (
    <DashboardLayout menu={logisticsMenu} contextLabel="Borneo Circular Logistik" locationLabel="Klaster Banjarbaru">
      <PageHeader title="Ringkasan Mitra Logistik" description="Aksi perjalanan mengubah state batch, titik rute, kapasitas kendaraan, notifikasi, aktivitas, dan traceability secara terhubung." action={<StatusBadge tone={routeTone(route.journeyStatus)}>{journeyLabels[route.journeyStatus]||route.journeyStatus}</StatusBadge>}/>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{stats.map(([Icon,label,value,detail])=><StatCard key={label} icon={Icon} label={label} value={value} detail={detail}/>)}</div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <ChartCard title="Peta rute hari ini" subtitle="Diagram SVG interaktif · simulasi tanpa API berbayar">
          <div className="relative min-h-[440px] overflow-hidden bg-brand-50">
            <div className="absolute inset-0 opacity-40" style={{backgroundImage:'linear-gradient(#D9E8E3 1px, transparent 1px), linear-gradient(90deg, #D9E8E3 1px, transparent 1px)',backgroundSize:'32px 32px'}}/>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 440" preserveAspectRatio="none" aria-hidden="true"><path className={`route-path ${route.journeyStatus!=='ready'?'route-path-active':''}`} d="M45 390 C110 330, 160 325, 220 285 S320 185, 410 225 S545 285, 635 175 S705 85, 760 55" fill="none" stroke="#1D9E75" strokeWidth="6" strokeDasharray="12 9"/></svg>
            {route.stops.map((item,index)=><div key={item.stopId} className="absolute transition-all duration-700" style={{left:`${item.x}%`,top:`${item.y}%`,transform:'translate(-50%,-50%)'}}><div className={`route-node grid h-11 w-11 place-items-center rounded-full border-4 border-white font-bold text-white shadow-lg ${item.status==='completed'?'bg-brand-700':item.status==='verified'?'bg-cyan-600':item.status==='active'||item.status==='arrived'||item.status==='verifying'?'active-destination bg-amber-500':'bg-brand-400'}`}>{item.status==='completed'?<CheckCircle2 size={20}/>:index+1}</div><div className="mt-1 max-w-32 rounded bg-white px-2 py-1 text-center text-[10px] font-semibold text-ink shadow">{item.name.replace('SPPG ','')}</div></div>)}
            <div className="vehicle-marker absolute z-20 flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-white shadow-xl transition-all duration-[1800ms] ease-in-out" style={{left:`${vehiclePosition.x}%`,top:`${vehiclePosition.y}%`,transform:'translate(-50%,-50%)'}}><Truck size={16}/><span className="hidden sm:inline">{route.vehicle}</span></div>
            <div className="absolute right-4 top-4 rounded-xl border border-brand-200 bg-white p-3 text-xs text-muted shadow"><strong className="block text-ink">Tujuan akhir</strong>Fasilitas pengolahan mitra</div>
            <div className="absolute bottom-4 left-4 right-4 h-2 overflow-hidden rounded-full bg-white/80"><div className="h-full rounded-full bg-brand-500 transition-all duration-700" style={{width:`${Math.min(100,(completed/Math.max(1,route.stops.length))*85+(route.journeyStatus==='facility_received'?15:0))}%`}}/></div>
          </div>
        </ChartCard>
        <div className="space-y-6">
          <ChartCard title="Daftar rute harian" subtitle="Status berubah mengikuti aksi perjalanan">
            <div className="space-y-3">{route.stops.map((item,index)=><div key={item.stopId} className={`flex items-center gap-3 border p-3 transition ${index===route.currentStopIndex?'border-brand-400 bg-brand-50 shadow-sm':'border-border bg-white'}`}><div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${item.status==='completed'?'bg-brand-600 text-white':'bg-brand-100 text-brand-700'}`}>{index+1}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-ink">{item.name}</div><div className="mt-1 text-xs text-muted">{item.volume} L · {item.distance} km · {item.batchId}</div></div><StatusBadge tone={statusTone(item.status)}>{stopLabels[item.status]||item.status}</StatusBadge></div>)}</div>
          </ChartCard>
          <ChartCard title="Aksi perjalanan" subtitle={active?`Titik aktif: ${active.name}`:'Seluruh titik selesai'}>
            <div className="grid gap-3">
              <button disabled={!canStart} onClick={doStart} className="btn-primary disabled:cursor-not-allowed disabled:opacity-45"><Play size={18}/> {route.journeyStatus==='next_stop'?'Lanjutkan ke Titik Berikutnya':'Mulai Rute'}</button>
              <button disabled={!canArrive} onClick={doArrive} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-45"><Navigation size={18}/> Tandai Tiba</button>
              <button disabled={!canVerify} onClick={doVerify} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-45"><Sparkles size={18}/> Verifikasi Mutu</button>
              <button disabled={!canComplete} onClick={doComplete} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-45"><CheckCircle2 size={18}/> Selesaikan Penjemputan</button>
              {canSend&&<button onClick={doSend} className="btn-primary"><Send size={18}/> Kirim ke Fasilitas</button>}
            </div>
            <div className="mt-4 rounded-xl bg-soft p-3 text-xs leading-5 text-muted">{!canStart&&route.journeyStatus==='ready'?'Tidak ada titik aktif.':canVerify?'Kendaraan sudah tiba. Lakukan verifikasi mutu untuk mengaktifkan penyelesaian penjemputan.':canComplete?'Hasil mutu tersimpan. Batch siap dimuat ke kendaraan.':canSend?'Semua titik selesai. Kirim batch ke fasilitas pengolahan.':`Status: ${journeyLabels[route.journeyStatus]}`}</div>
          </ChartCard>
          <ChartCard title="Kapasitas kendaraan" subtitle="Diperbarui setelah penjemputan selesai"><div className="h-3 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-brand-500 transition-all duration-700" style={{width:`${Math.min(100,route.vehicleLoad/route.capacity*100)}%`}}/></div><div className="mt-3 flex justify-between text-sm"><strong className="text-ink">{route.vehicleLoad} L dimuat</strong><span className="text-muted">Kapasitas {route.capacity} L</span></div></ChartCard>
        </div>
      </div>
      <Toast message={toast} onClose={()=>setToast('')}/>
    </DashboardLayout>
  )
}

export function RouteOptimizationPage() {
  const { state, optimizeRoute } = useAppData()
  const [toast,setToast]=useState('')
  const route=state.logisticsRoutes[0]
  const efficiency=Math.round((1-route.distanceAfter/route.distanceBefore)*100)
  const beforeOrder=useMemo(()=>[...route.stops].sort((a,b)=>b.distance-a.distance),[route.stops])
  const doOptimize=()=>{optimizeRoute();setToast('Rute disusun ulang. Jalur, urutan titik, jarak, dan waktu simulasi diperbarui.')}
  return <DashboardLayout menu={logisticsMenu} contextLabel="Borneo Circular Logistik"><PageHeader title="Optimasi Rute" description="Optimasi prototype mempertimbangkan urgensi, jarak, volume, dan kapasitas kendaraan. Bukan algoritma produksi nyata." action={<button disabled={route.optimized} onClick={doOptimize} className="btn-primary disabled:opacity-50"><Route size={18}/>{route.optimized?'Rute Teroptimasi':'Optimalkan Rute'}</button>}/><div className="mb-6"><RouteSummary stops={route.stops.length} distance={`${route.optimized?route.distanceAfter:route.distanceBefore} km`} capacity={`${Math.round(route.stops.reduce((s,x)=>s+x.volume,0)/route.capacity*100)}%`} status={route.optimized?'Rute teroptimasi':'Belum dioptimasi'}/></div><div className="grid gap-6 lg:grid-cols-2"><RouteDiagram title="Sebelum optimasi" items={beforeOrder} total={`${route.distanceBefore} km`} active={false}/><RouteDiagram title="Setelah optimasi" items={route.optimized?route.stops:[]} total={route.optimized?`${route.distanceAfter} km`:'Tekan tombol optimasi'} active={route.optimized}/></div>{route.optimized&&<div className="mt-6 grid gap-4 sm:grid-cols-4">{[['Pengurangan jarak',`${(route.distanceBefore-route.distanceAfter).toFixed(1)} km`],['Pengurangan waktu',`${route.estimatedMinutesBefore-route.estimatedMinutesAfter} menit`],['Efisiensi',`${efficiency}%`],['Kapasitas',`${Math.round(route.stops.reduce((s,x)=>s+x.volume,0)/route.capacity*100)}%`]].map(([label,value])=><div key={label} className="border border-brand-200 bg-brand-100 p-5"><div className="text-xs font-semibold uppercase tracking-[.08em] text-brand-700">{label}</div><div className="mt-2 text-2xl font-bold text-ink">{value}</div><div className="mt-2 text-xs text-muted">Simulasi prototype.</div></div>)}</div>}<InfoBox tone="warning"><strong>Catatan:</strong> hasil hanya menggambarkan konsep route optimization. Jarak dan waktu bukan data navigasi real-time.</InfoBox><Toast message={toast} onClose={()=>setToast('')}/></DashboardLayout>
}

function RouteDiagram({title,items,total,active}) {
  return <section className={`border p-6 ${active?'border-brand-300 bg-brand-50':'border-border bg-white'} shadow-soft`}><div className="flex items-center justify-between"><h2 className="font-bold text-ink">{title}</h2><span className="text-xs text-muted">Simulasi prototype</span></div><div className="mt-10 flex items-center justify-between gap-2">{items.length?items.map((item,index)=><div key={item.batchId} className="contents"><div className={`route-order-node grid h-12 w-12 shrink-0 place-items-center rounded-full font-bold ${active?'bg-brand-500 text-white':'border-2 border-brand-300 bg-white text-brand-700'}`} style={{animationDelay:`${index*160}ms`}}>{index+1}</div>{index<items.length-1&&<div className={`h-0.5 flex-1 ${active?'route-connector bg-brand-400':'bg-border'}`}/>}</div>):Array.from({length:4},(_,index)=><div key={index} className="contents"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-dashed border-border text-muted">?</div>{index<3&&<div className="h-0.5 flex-1 bg-border"/>}</div>)}</div>{items.length>0&&<div className="mt-7 grid gap-2">{items.map((item,index)=><div key={item.batchId} className="flex items-center justify-between rounded-xl border border-border bg-white px-3 py-2 text-xs"><span className="font-semibold text-ink">{index+1}. {item.name}</span><span className="text-muted">{item.volume} L · {item.urgency}</span></div>)}</div>}<div className="mt-8 border-t border-border pt-4 text-sm text-muted">Total estimasi: <strong className="text-ink">{total}</strong></div></section>
}
