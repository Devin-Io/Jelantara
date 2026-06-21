import { useEffect, useMemo, useState } from 'react'
import { Building2, CheckCircle2, Edit3, Printer, QrCode, Radio, Save, X } from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import { InfoBox, Modal, PageHeader, StatusBadge, Toast } from '../components/common/UI'
import { ConfirmDialog, DetailList, DocumentCenter, Field, ProgressBar } from '../components/common/OperationsUI'
import { operatorMenu } from '../data/content'
import { useAppData } from '../hooks/useAppData'
import { formatDateTime } from '../utils/batchUtils'

export function OperatorDocumentsPage() {
  const { state } = useAppData()
  const sppgIds = new Set(state.sppgProfiles.map((item)=>item.id))
  const batchIds = new Set(state.batches.filter((item)=>sppgIds.has(item.sppgId)).map((item)=>item.batchId))
  const documents = state.documents.filter((item)=>batchIds.has(item.batchId) && ['operator','all'].includes(item.ownerRole))
  return <DashboardLayout menu={operatorMenu} contextLabel="SPPG Banjarbaru Utara"><PageHeader title="Dokumen Operator" description="Cari, pratinjau, cetak, dan unduh dokumen yang terbentuk dari aktivitas batch SPPG."/><InfoBox>Dokumen yang ditampilkan merupakan dokumen simulasi prototype dan bukan dokumen operasional atau sertifikasi resmi.</InfoBox><div className="mt-6"><DocumentCenter documents={documents} batches={state.batches} events={state.traceabilityEvents} title="Arsip Dokumen SPPG"/></div></DashboardLayout>
}

const requiredFields=['name','address','city','province','operatorName','phone','email','containerCapacity','containerType','operatingHours','logisticsPartner']
export function OperatorProfilePage() {
  const {state,updateProfile,toggleProfileSensor,regenerateQr}=useAppData()
  const profile=state.sppgProfiles[0]
  const [editing,setEditing]=useState(false); const [draft,setDraft]=useState(profile); const [confirm,setConfirm]=useState(false); const [qrOpen,setQrOpen]=useState(false); const [toast,setToast]=useState(''); const [errors,setErrors]=useState({})
  useEffect(()=>setDraft(profile),[profile])
  const completeness=useMemo(()=>Math.round(requiredFields.filter((key)=>String(draft[key]??'').trim()).length/requiredFields.length*100),[draft])
  const change=(key,value)=>setDraft((current)=>({...current,[key]:value}))
  const validate=()=>{const next={}; requiredFields.forEach((key)=>{if(!String(draft[key]??'').trim())next[key]='Wajib diisi.'}); if(draft.email&&!/^\S+@\S+\.\S+$/.test(draft.email))next.email='Format email tidak valid.'; if(Number(draft.containerCapacity)<100)next.containerCapacity='Kapasitas minimal 100 liter.'; setErrors(next); return !Object.keys(next).length}
  const askSave=()=>{if(validate())setConfirm(true)}
  const save=()=>{updateProfile({...draft,containerCapacity:Number(draft.containerCapacity),completeness});setConfirm(false);setEditing(false);setToast('Profil SPPG berhasil diperbarui dan disimpan pada browser.')}
  const cancel=()=>{setDraft(profile);setEditing(false);setErrors({})}
  return <DashboardLayout menu={operatorMenu} contextLabel={profile.name}>
    <PageHeader title="Profil SPPG" description="Kelola identitas sumber UCO, konfigurasi wadah, operator, sensor, dan QR SPPG." action={!editing?<button className="btn-primary" onClick={()=>setEditing(true)}><Edit3 size={17}/> Edit Profil</button>:null}/>
    <div className="grid gap-6 xl:grid-cols-[.72fr_1.28fr]">
      <aside className="space-y-5"><section className="border border-border bg-white p-6 shadow-soft"><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-2xl font-bold text-brand-700">SB</div><div><h2 className="font-bold text-ink">{profile.name}</h2><p className="mt-1 text-sm text-muted">{profile.id}</p><div className="mt-2"><StatusBadge tone={profile.accountStatus==='active'?'success':'error'}>{profile.accountStatus==='active'?'Akun aktif':'Akun nonaktif'}</StatusBadge></div></div></div><div className="mt-6"><ProgressBar value={completeness} label="Kelengkapan profil"/></div></section>
      <section className="border border-border bg-white p-5 shadow-soft"><h3 className="font-bold text-ink">Perangkat SPPG</h3><div className="mt-4 space-y-3"><div className="flex items-center justify-between rounded-xl bg-soft p-4"><div className="flex items-center gap-3"><Radio className="text-brand-600"/><div><div className="text-sm font-semibold text-ink">Sensor wadah</div><div className="text-xs text-muted">Status koneksi simulasi</div></div></div><button onClick={()=>toggleProfileSensor(profile.id)}><StatusBadge tone={profile.sensorStatus==='connected'?'success':'warning'}>{profile.sensorStatus==='connected'?'Terhubung':'Terputus'}</StatusBadge></button></div><div className="flex items-center justify-between rounded-xl bg-soft p-4"><div className="flex items-center gap-3"><QrCode className="text-brand-600"/><div><div className="text-sm font-semibold text-ink">QR identitas</div><div className="text-xs text-muted">{profile.qrGeneratedAt?`Dibuat ${formatDateTime(profile.qrGeneratedAt)}`:'QR aktif'}</div></div></div><button className="text-sm font-semibold text-brand-700" onClick={()=>setQrOpen(true)}>Tampilkan</button></div></div></section></aside>
      <section className="border border-border bg-white p-6 shadow-soft"><div className="mb-6 flex items-center justify-between"><div><h2 className="font-bold text-ink">Data Identitas dan Operasional</h2><p className="mt-1 text-xs text-muted">Perubahan tersimpan di global state dan localStorage.</p></div>{editing&&<div className="flex gap-2"><button className="btn-secondary !py-2" onClick={cancel}><X size={16}/> Batal</button><button className="btn-primary !py-2" onClick={askSave}><Save size={16}/> Simpan</button></div>}</div>
      <div className="grid gap-5 md:grid-cols-2">{[
        ['id','ID SPPG','text',true],['name','Nama SPPG'],['address','Alamat'],['city','Kabupaten / Kota'],['province','Provinsi'],['coordinates','Koordinat simulasi'],['operatorName','Nama operator'],['phone','Nomor kontak'],['email','Email','email'],['containerCapacity','Kapasitas wadah (liter)','number'],['containerType','Jenis wadah'],['operatingHours','Jadwal operasional'],['logisticsPartner','Mitra logistik'],['registeredAt','Tanggal registrasi','text',true],
      ].map(([key,label,type='text',alwaysDisabled])=><Field key={key} label={label} error={errors[key]}><input type={type} className="input-field disabled:bg-slate-50" value={key==='registeredAt'?formatDateTime(draft[key]):draft[key]??''} disabled={!editing||alwaysDisabled} onChange={(e)=>change(key,e.target.value)}/></Field>)}</div>
      </section>
    </div>
    <section className="mt-6 border border-border bg-white p-6 shadow-soft"><h2 className="font-bold text-ink">Riwayat Perubahan Profil</h2><div className="mt-4 divide-y divide-border">{(profile.changeHistory||[]).map((item)=><div key={item.id} className="flex flex-col justify-between gap-2 py-4 sm:flex-row"><div><div className="text-sm font-semibold text-ink">{item.label}</div><div className="text-xs text-muted">Oleh {item.actor}</div></div><div className="text-xs text-muted">{formatDateTime(item.timestamp)}</div></div>)}</div></section>
    <ConfirmDialog open={confirm} onClose={()=>setConfirm(false)} onConfirm={save} title="Simpan perubahan profil?" description="Perubahan akan digunakan pada pencatatan volume, dokumen, monitoring admin, dan penjadwalan berikutnya." confirmLabel="Simpan Profil"/>
    <Modal open={qrOpen} onClose={()=>setQrOpen(false)} title="QR Identitas SPPG" size="max-w-md"><div className="text-center"><div className="mx-auto grid h-56 w-56 grid-cols-7 gap-1 rounded-2xl border-8 border-white bg-white p-3 shadow-xl">{Array.from({length:49},(_,index)=><span key={index} className={`rounded-sm ${((index*7+index*3)%11)<5?'bg-ink':'bg-brand-100'}`}/>)}</div><div className="mt-4 font-mono text-sm font-bold text-ink">{profile.id}</div><p className="mt-2 text-xs leading-5 text-muted">Kode ini digunakan hanya untuk simulasi identifikasi SPPG pada prototype.</p><div className="mt-5 flex justify-center gap-3"><button className="btn-secondary" onClick={()=>window.print()}><Printer size={17}/> Cetak</button><button className="btn-primary" onClick={()=>{regenerateQr(profile.id);setToast('QR SPPG berhasil diregenerasi.')}}><QrCode size={17}/> Regenerasi</button></div></div></Modal>
    <Toast message={toast} onClose={()=>setToast('')}/>
  </DashboardLayout>
}
