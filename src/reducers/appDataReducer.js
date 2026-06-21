import { calculateIncentive } from '../utils/incentiveUtils'

const now = () => new Date().toISOString()
const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`
const event = (batchId, type, label, actor, location, description) => ({ id:uid('EVT'), batchId, type, label, actor, location, description, timestamp:now() })
const activity = (type, title, detail) => ({ id:uid('ACT'), type, title, detail, timestamp:now() })
const notification = (title, message) => ({ id:uid('NOTIF'), title, message, read:false, timestamp:now() })
const documentRecord = (batchId, ownerRole, type, title, parties, status='issued') => ({ id:uid('DOC'), batchId, ownerRole, type, title, status, version:'1.0', parties, createdAt:now() })

function updateBatch(state, batchId, patch) {
  return state.batches.map((batch) => batch.batchId === batchId ? { ...batch, ...patch, updatedAt:now() } : batch)
}
function updateRouteStop(routes, batchId, patch) {
  return routes.map((route) => ({ ...route, stops:route.stops.map((stop) => stop.batchId === batchId ? { ...stop, ...patch } : stop) }))
}
function replaceFleet(fleet, id, patch) { return fleet.map((item)=>item.id===id?{...item,...patch}:item) }

export function appDataReducer(state, action) {
  switch (action.type) {
    case 'ADD_VOLUME_RECORD': {
      const { record, batch, schedule, routeStop, nextContainerVolume } = action.payload
      const route = state.logisticsRoutes[0]
      const shouldSchedule = Boolean(schedule)
      const updatedRoute = shouldSchedule ? { ...route, stops:[routeStop, ...route.stops.map((stop)=>stop.status==='active'?{...stop,status:'waiting'}:stop)], currentStopIndex:0, journeyStatus:'ready' } : route
      const docs = [documentRecord(batch.batchId,'operator','Bukti Pencatatan Volume',`Bukti Pencatatan Volume ${batch.batchId}`,batch.sppgName)]
      if (schedule) docs.push(documentRecord(batch.batchId,'operator','Jadwal Penjemputan',`Jadwal Penjemputan ${batch.batchId}`,`${batch.sppgName} · ${schedule.partner}`))
      return {
        ...state,
        container:{...state.container,currentVolume:nextContainerVolume,lastReadAt:now()},
        volumeRecords:[record,...state.volumeRecords], batches:[batch,...state.batches],
        pickupSchedules:schedule?[schedule,...state.pickupSchedules]:state.pickupSchedules,
        logisticsRoutes:[updatedRoute,...state.logisticsRoutes.slice(1)], documents:[...docs,...state.documents],
        traceabilityEvents:[event(batch.batchId,'recorded','Dicatat oleh SPPG','Operator SPPG',batch.location,`Volume ${batch.volume} liter dicatat.`),...(schedule?[event(batch.batchId,'scheduled','Dijadwalkan','Mesin Rute JELANTARA',batch.location,'Batch masuk jadwal penjemputan.')]:[]),...state.traceabilityEvents],
        notifications:[notification('Batch baru dibuat',`${batch.batchId} berhasil dibuat.${schedule?' Penjemputan prioritas dijadwalkan.':''}`),...state.notifications],
        activities:[activity('recorded',`Volume ${batch.volume} liter dicatat`,`Batch ${batch.batchId} dibuat.`),...state.activities],
      }
    }
    case 'UPDATE_SENSOR': return {...state,container:{...state.container,currentVolume:action.payload.value,sensorStatus:'connected',lastReadAt:now()}}
    case 'UPDATE_PROFILE': {
      const profile=action.payload
      return {...state,sppgProfiles:state.sppgProfiles.map((item)=>item.id===profile.id?{...profile,changeHistory:[{id:uid('PRH'),label:'Profil diperbarui',actor:profile.operatorName,timestamp:now()},...(item.changeHistory||[])]}:item),activities:[activity('profile_updated','Profil SPPG diperbarui',`${profile.name} menyimpan perubahan profil.`),...state.activities]}
    }
    case 'TOGGLE_PROFILE_SENSOR': return {...state,sppgProfiles:state.sppgProfiles.map((item)=>item.id===action.payload.id?{...item,sensorStatus:item.sensorStatus==='connected'?'disconnected':'connected'}:item)}
    case 'REGENERATE_QR': return {...state,sppgProfiles:state.sppgProfiles.map((item)=>item.id===action.payload.id?{...item,qrStatus:'active',qrGeneratedAt:now()}:item),activities:[activity('qr_regenerated','QR SPPG diregenerasi',action.payload.id),...state.activities]}
    case 'OPTIMIZE_ROUTE': {
      const route=state.logisticsRoutes[0]
      const optimized=[...route.stops].sort((a,b)=>({Tinggi:0,Sedang:1,Rendah:2}[a.urgency]-({Tinggi:0,Sedang:1,Rendah:2}[b.urgency])||a.distance-b.distance)).map((stop,index)=>({...stop,order:index+1,x:[12,42,66,88,94][index]||stop.x,y:[76,45,56,18,8][index]||stop.y,status:index===0?'active':'waiting'}))
      return {...state,logisticsRoutes:[{...route,optimized:true,stops:optimized,currentStopIndex:0,journeyStatus:'ready'},...state.logisticsRoutes.slice(1)],activities:[activity('route_optimized','Rute dioptimalkan',`Jarak berubah dari ${route.distanceBefore} km menjadi ${route.distanceAfter} km.`),...state.activities]}
    }
    case 'ASSIGN_PICKUP': {
      const {batchId,vehicle,driver}=action.payload
      const fleetItem=state.fleet.find((item)=>item.plate===vehicle)
      return {...state,batches:updateBatch(state,batchId,{vehicle}),pickupSchedules:state.pickupSchedules.map((item)=>item.batchId===batchId?{...item,vehicle,driver,status:'armada_assigned'}:item),fleet:fleetItem?replaceFleet(state.fleet,fleetItem.id,{driver,status:'assigned'}):state.fleet,activities:[activity('pickup_assigned','Armada ditugaskan',`${vehicle} dan ${driver} ditugaskan untuk ${batchId}.`),...state.activities]}
    }
    case 'START_ROUTE': {
      const route=state.logisticsRoutes[0]; const active=route.stops[route.currentStopIndex]; if(!active)return state
      return {...state,logisticsRoutes:[{...route,journeyStatus:'started',startedAt:route.startedAt||now(),stops:route.stops.map((s,i)=>i===route.currentStopIndex?{...s,status:'active'}:s)},...state.logisticsRoutes.slice(1)],pickupSchedules:state.pickupSchedules.map((p)=>p.batchId===active.batchId?{...p,status:'en_route'}:p),fleet:state.fleet.map((item)=>item.plate===route.vehicle?{...item,status:'in_transit'}:item),notifications:[notification('Rute dimulai',`Armada ${route.vehicle} menuju ${active.name}.`),...state.notifications],activities:[activity('route_started','Rute logistik dimulai',`Armada ${route.vehicle} menuju ${active.name}.`),...state.activities]}
    }
    case 'MARK_ARRIVED': {
      const route=state.logisticsRoutes[0]; const active=route.stops[route.currentStopIndex]; if(!active)return state
      return {...state,logisticsRoutes:[{...route,journeyStatus:'arrived',arrivedAt:now(),stops:route.stops.map((s)=>s.batchId===active.batchId?{...s,status:'arrived'}:s)},...state.logisticsRoutes.slice(1)],pickupSchedules:state.pickupSchedules.map((p)=>p.batchId===active.batchId?{...p,status:'arrived',arrivedAt:now()}:p),activities:[activity('arrived',`Armada tiba di ${active.name}`,`Batch ${active.batchId} siap diverifikasi.`),...state.activities],notifications:[notification('Armada tiba',`Verifikasi mutu ${active.batchId} dapat dimulai.`),...state.notifications]}
    }
    case 'BEGIN_QUALITY': {
      const batchId=action.payload?.batchId||state.logisticsRoutes[0]?.stops[state.logisticsRoutes[0]?.currentStopIndex]?.batchId
      return {...state,logisticsRoutes:updateRouteStop(state.logisticsRoutes,batchId,{status:'verifying'}).map((route,index)=>index===0?{...route,journeyStatus:'quality_check'}:route)}
    }
    case 'SAVE_QUALITY': {
      const result=action.payload
      return {...state,qualityResults:[result,...state.qualityResults.filter((x)=>x.batchId!==result.batchId)],batches:updateBatch(state,result.batchId,{qualityGrade:result.grade,qualityScore:result.score,status:'quality_verified'}),logisticsRoutes:updateRouteStop(state.logisticsRoutes,result.batchId,{status:'verified',grade:result.grade,score:result.score}),documents:[documentRecord(result.batchId,'logistics','Hasil Verifikasi Mutu',`Hasil Verifikasi Mutu ${result.batchId}`,'Petugas Logistik · SPPG'),...state.documents],traceabilityEvents:[event(result.batchId,'quality_verified','Diverifikasi',result.officer||'Petugas Logistik',result.location||'Lokasi SPPG',`Pemeriksaan awal menghasilkan ${result.grade}, skor ${result.score}.`),...state.traceabilityEvents],activities:[activity('quality_verified','Verifikasi mutu selesai',`Batch ${result.batchId} memperoleh ${result.grade}.`),...state.activities],notifications:[notification('Verifikasi selesai',`${result.batchId} memperoleh ${result.grade}.`),...state.notifications]}
    }
    case 'COMPLETE_PICKUP': {
      const route=state.logisticsRoutes[0]; const index=route.currentStopIndex; const active=route.stops[index]; if(!active)return state
      const hasNext=index<route.stops.length-1; const nextIndex=hasNext?index+1:index
      const stops=route.stops.map((stop,i)=>i===index?{...stop,status:'completed'}:hasNext&&i===nextIndex?{...stop,status:'active'}:stop)
      const newLoad=Math.min(route.capacity,route.vehicleLoad+active.volume)
      return {...state,logisticsRoutes:[{...route,stops,currentStopIndex:nextIndex,vehicleLoad:newLoad,journeyStatus:hasNext?'next_stop':'completed',completedAt:hasNext?route.completedAt:now()},...state.logisticsRoutes.slice(1)],batches:updateBatch(state,active.batchId,{status:hasNext?'picked_up':'in_transit'}),pickupSchedules:state.pickupSchedules.map((p)=>p.batchId===active.batchId?{...p,status:'completed',completedAt:now()}:p),fleet:state.fleet.map((item)=>item.plate===route.vehicle?{...item,currentLoad:Math.min(item.capacity,item.currentLoad+active.volume),batches:[...new Set([...(item.batches||[]),active.batchId])],status:newLoad>=route.capacity?'full':'in_transit'}:item),documents:[documentRecord(active.batchId,'logistics','Berita Acara Penjemputan',`Berita Acara Penjemputan ${active.batchId}`,`${active.name} · Borneo Circular Logistik`),documentRecord(active.batchId,'logistics','Manifest Batch',`Manifest Batch ${active.batchId}`,'Borneo Circular Logistik'),...state.documents],traceabilityEvents:[event(active.batchId,'picked_up','Dijemput','Borneo Circular Logistik',active.name,`Batch ${active.volume} liter dimuat ke ${route.vehicle}.`),...state.traceabilityEvents],activities:[activity('picked_up',`Penjemputan ${active.name} selesai`,hasNext?`Lanjut ke ${stops[nextIndex].name}.`:'Armada siap menuju fasilitas.'),...state.activities]}
    }
    case 'MARK_PICKUP_ISSUE': {
      const {batchId,reason}=action.payload
      return {...state,incidents:[{id:uid('INC'),batchId,reason,status:'open',timestamp:now()},...state.incidents],pickupSchedules:state.pickupSchedules.map((item)=>item.batchId===batchId?{...item,status:'issue',issueReason:reason}:item),activities:[activity('pickup_issue','Kendala penjemputan dicatat',`${batchId}: ${reason}`),...state.activities]}
    }
    case 'CANCEL_PICKUP': {
      const {batchId,reason}=action.payload
      return {...state,batches:updateBatch(state,batchId,{status:'recorded'}),pickupSchedules:state.pickupSchedules.map((item)=>item.batchId===batchId?{...item,status:'cancelled',cancelReason:reason}:item),logisticsRoutes:updateRouteStop(state.logisticsRoutes,batchId,{status:'cancelled'}),activities:[activity('pickup_cancelled','Penjemputan dibatalkan',`${batchId}: ${reason}`),...state.activities]}
    }
    case 'SEND_TO_FACILITY': {
      const route=state.logisticsRoutes[0]; const ids=route.stops.filter((s)=>s.status==='completed').map((s)=>s.batchId)
      return {...state,logisticsRoutes:[{...route,journeyStatus:'delivering'},...state.logisticsRoutes.slice(1)],batches:state.batches.map((b)=>ids.includes(b.batchId)?{...b,status:'in_transit',updatedAt:now()}:b),processingReceipts:[...ids.filter((id)=>!state.processingReceipts.some((r)=>r.batchId===id)).map((batchId)=>({id:uid('RCV'),batchId,arrivalConfirmed:false,documentsChecked:false,status:'en_route',arrivedAt:null,acceptedAt:null})),...state.processingReceipts],activities:[activity('delivering','Armada menuju fasilitas',`${ids.length} batch dikirim.`),...state.activities],notifications:[notification('Pengiriman ke fasilitas',`${ids.length} batch masuk antrean fasilitas.`),...state.notifications]}
    }
    case 'CONFIRM_FACILITY_ARRIVAL': {
      const batchId=action.payload.batchId
      return {...state,processingReceipts:state.processingReceipts.map((r)=>r.batchId===batchId?{...r,arrivalConfirmed:true,status:'arrived',arrivedAt:now()}:r),activities:[activity('facility_arrival','Kedatangan dikonfirmasi',`Batch ${batchId} tiba di fasilitas.`),...state.activities]}
    }
    case 'CHECK_DOCUMENTS': {
      const batchId=action.payload.batchId
      return {...state,processingReceipts:state.processingReceipts.map((r)=>r.batchId===batchId?{...r,documentsChecked:true,status:'documents_checked'}:r),activities:[activity('documents_checked','Dokumen diperiksa',`Dokumen ${batchId} dinyatakan lengkap.`),...state.activities]}
    }
    case 'SAVE_FACILITY_REVIEW': {
      const review=action.payload
      return {...state,facilityReviews:[review,...state.facilityReviews.filter((item)=>item.batchId!==review.batchId)],qualityResults:state.qualityResults.map((item)=>item.batchId===review.batchId?{...item,score:review.reviewScore,grade:review.reviewGrade,facilityReviewedAt:review.timestamp}:item),batches:updateBatch(state,review.batchId,{qualityScore:review.reviewScore,qualityGrade:review.reviewGrade}),processingReceipts:state.processingReceipts.map((r)=>r.batchId===review.batchId?{...r,status:review.status==='additional_review'?'review_requested':'quality_approved'}:r),documents:[documentRecord(review.batchId,'facility','Quality Review',`Quality Review ${review.batchId}`,'Fasilitas Pengolahan Mitra'),...state.documents],activities:[activity('facility_quality_review','Quality review disimpan',`${review.batchId} menjadi ${review.reviewGrade}.`),...state.activities]}
    }
    case 'REQUEST_REVIEW': {
      const batchId=action.payload.batchId
      return {...state,processingReceipts:state.processingReceipts.map((r)=>r.batchId===batchId?{...r,status:'review_requested'}:r),activities:[activity('review_requested','Pemeriksaan tambahan diminta',`Batch ${batchId} memerlukan review.`),...state.activities]}
    }
    case 'REJECT_BATCH': {
      const {batchId,reason}=action.payload
      return {...state,batches:updateBatch(state,batchId,{status:'rejected'}),processingReceipts:state.processingReceipts.map((r)=>r.batchId===batchId?{...r,status:'rejected',rejectionReason:reason}:r),documents:[documentRecord(batchId,'facility','Catatan Penolakan',`Catatan Penolakan ${batchId}`,'Fasilitas Pengolahan Mitra','final'),...state.documents],activities:[activity('batch_rejected','Batch ditolak',`${batchId}: ${reason}`),...state.activities]}
    }
    case 'ACCEPT_BATCH': {
      const {batchId,acceptance={}}=action.payload; const batch=state.batches.find((b)=>b.batchId===batchId); if(!batch)return state
      const quality=state.qualityResults.find((q)=>q.batchId===batchId); const calc=calculateIncentive(batch.volume,batch.qualityGrade||'Grade B',quality?.contamination,state.settings)
      const existing=state.incentiveTransactions.find((x)=>x.batchId===batchId)
      const incentive=existing||{id:uid('PAY'),batchId,volume:batch.volume,grade:batch.qualityGrade||'Grade B',baseRate:calc.baseRate,bonus:calc.bonus,deduction:calc.deduction,total:calc.total,status:'processing',createdAt:now(),paidAt:null}
      return {...state,batches:updateBatch(state,batchId,{status:'received'}),processingReceipts:state.processingReceipts.map((r)=>r.batchId===batchId?{...r,...acceptance,status:'accepted',acceptedAt:now()}:r),incentiveTransactions:existing?state.incentiveTransactions:[incentive,...state.incentiveTransactions],documents:[documentRecord(batchId,'facility','Berita Acara Penerimaan',`Berita Acara Penerimaan ${batchId}`,'Logistik · Fasilitas','final'),documentRecord(batchId,'facility','Batch Receipt',`Batch Receipt ${batchId}`,'Fasilitas Pengolahan Mitra','final'),...state.documents],traceabilityEvents:[event(batchId,'received','Diterima fasilitas','Mitra Fasilitas Pengolahan',state.settings.defaultFacility,'Batch diterima fasilitas.'),...state.traceabilityEvents],activities:[activity('received','Batch diterima fasilitas',`${batchId} diterima dan insentif diproses.`),...state.activities],notifications:[notification('Batch diterima',`${batchId} diterima fasilitas.`),...state.notifications]}
    }
    case 'COMPLETE_DOCUMENT': {
      const batchId=action.payload.batchId
      return {...state,batches:updateBatch(state,batchId,{status:'document_completed'}),documents:[documentRecord(batchId,'all','Sustainability Record',`Sustainability Record ${batchId}`,'SPPG · Logistik · Fasilitas','final'),...state.documents],traceabilityEvents:[event(batchId,'document_completed','Dokumen selesai','Administrator JELANTARA','Sistem JELANTARA','Sustainability record simulasi difinalisasi.'),...state.traceabilityEvents],activities:[activity('document_completed','Dokumen selesai',`${batchId} memiliki sustainability record.`),...state.activities]}
    }
    case 'MARK_INCENTIVE_PAID': {
      const batchId=action.payload.batchId
      return {...state,incentiveTransactions:state.incentiveTransactions.map((x)=>x.batchId===batchId?{...x,status:'paid',paidAt:now()}:x),documents:[documentRecord(batchId,'operator','Receipt Pembayaran',`Receipt Pembayaran ${batchId}`,'JELANTARA · SPPG','paid'),...state.documents],activities:[activity('paid','Insentif dibayar',`Pembayaran ${batchId} selesai.`),...state.activities]}
    }
    case 'UPSERT_FLEET': {
      const item=action.payload; const exists=state.fleet.some((x)=>x.id===item.id)
      return {...state,fleet:exists?state.fleet.map((x)=>x.id===item.id?item:x):[item,...state.fleet],activities:[activity('fleet_updated',exists?'Armada diperbarui':'Armada ditambahkan',item.plate),...state.activities]}
    }
    case 'SET_FLEET_STATUS': return {...state,fleet:replaceFleet(state.fleet,action.payload.id,{status:action.payload.status,notes:action.payload.notes??state.fleet.find((x)=>x.id===action.payload.id)?.notes})}
    case 'TOGGLE_ENTITY_STATUS': {
      const {entity,id}=action.payload; const key=entity==='sppg'?'sppgProfiles':entity==='logistics'?'logisticsPartners':'facilities'
      return {...state,[key]:state[key].map((item)=>item.id===id?{...item,status:item.status==='active'?'inactive':'active',accountStatus:item.accountStatus==='active'?'inactive':'active'}:item)}
    }
    case 'SAVE_SETTINGS': return {...state,settings:{...state.settings,...action.payload},settingsHistory:[{id:uid('SETH'),label:'Pengaturan sistem diperbarui',actor:'Administrator',timestamp:now()},...state.settingsHistory]}
    case 'RESET_SETTINGS': return {...state,settings:action.payload,settingsHistory:[{id:uid('SETH'),label:'Pengaturan dikembalikan ke nilai awal',actor:'Administrator',timestamp:now()},...state.settingsHistory]}
    case 'CLEAR_ACTIVITIES': return {...state,activities:[]}
    case 'MARK_NOTIFICATIONS_READ': return {...state,notifications:state.notifications.map((n)=>({...n,read:true}))}
    case 'RESET_DATA': return action.payload
    default: return state
  }
}
