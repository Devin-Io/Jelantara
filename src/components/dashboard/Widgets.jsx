import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, MapPin, Truck } from 'lucide-react'
import { StatusBadge } from '../common/UI'

export function ChartCard({ title, subtitle, action, children }) {
  return <section className="premium-card border border-border bg-white p-5 shadow-soft"><div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="font-bold text-ink">{title}</h3>{subtitle&&<p className="mt-1 text-xs text-muted">{subtitle}</p>}</div>{action}</div>{children}</section>
}

export function QualityScore({ score = 88, grade = 'Grade A' }) {
  const [display,setDisplay]=useState(0)
  useEffect(()=>{let frame;const start=performance.now();const tick=(now)=>{const progress=Math.min(1,(now-start)/900);setDisplay(Math.round(score*(1-Math.pow(1-progress,3))));if(progress<1)frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[score])
  const circumference=2*Math.PI*42;const offset=circumference-(display/100)*circumference
  return <div className="flex items-center gap-5"><div className="relative h-28 w-28"><svg className="-rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#E1F5EE" strokeWidth="9"/><circle cx="50" cy="50" r="42" fill="none" stroke="#1D9E75" strokeWidth="9" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="quality-ring transition-all duration-300"/></svg><div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-2xl font-bold text-ink">{display}</div><div className="text-[10px] text-muted">dari 100</div></div></div></div><div><StatusBadge tone={grade==='Grade A'?'success':grade==='Grade B'?'warning':'error'}>{grade}</StatusBadge><p className="mt-3 max-w-xs text-sm leading-6 text-muted">Skor pemeriksaan awal berbasis data simulasi prototype.</p></div></div>
}

export function TraceabilityTracker({ stages, onSelect }) {
  return <div className="space-y-0">{stages.map(([label,time,done],index)=><button type="button" key={`${label}-${index}`} onClick={()=>onSelect?.(index)} className={`trace-stage relative flex w-full gap-4 pb-7 text-left last:pb-0 ${onSelect?'cursor-pointer rounded-xl hover:bg-brand-50/70':''}`} style={{animationDelay:`${index*90}ms`}}>{index<stages.length-1&&<div className={`absolute left-[13px] top-7 h-[calc(100%-8px)] w-0.5 overflow-hidden ${done?'bg-brand-300':'bg-border'}`}>{done&&<span className="trace-line-progress block h-full w-full bg-brand-500"/>}</div>}<div className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full ${done?'bg-brand-500 text-white':'active-stage border-2 border-border bg-white text-muted'}`}>{done?<CheckCircle2 size={16}/>:<Circle size={12}/>}</div><div className="-mt-0.5"><div className={`text-sm font-semibold ${done?'text-ink':'text-muted'}`}>{label}</div><div className="mt-1 text-xs text-muted">{time}</div></div></button>)}</div>
}

export function RouteSummary({ stops=4,distance='26,5 km',capacity='76%',status='Belum dimulai' }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Titik penjemputan',`${stops} lokasi`,MapPin],['Jarak estimasi',distance,Truck],['Kapasitas terpakai',capacity,CheckCircle2],['Status rute',status,Circle]].map(([label,value,Icon])=><div key={label} className="premium-card border border-border bg-soft p-4"><Icon className="mb-4 text-brand-600" size={20}/><div className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{label}</div><div className="mt-1 font-bold text-ink">{value}</div></div>)}</div>
}
