import { useContext } from 'react'
import { AppDataContext } from '../context/AppDataContext'
import { initialAppData } from '../data/initialState'
import { generateBatchId } from '../utils/batchUtils'

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) throw new Error('useAppData harus digunakan di dalam AppDataProvider')
  const { state, dispatch } = context

  const addVolumeRecord = ({ sppgId, date, volume, capacity, condition, notes }) => {
    const profile = state.sppgProfiles.find((item)=>item.id===sppgId) || state.sppgProfiles[0]
    const batchId = generateBatchId(state.batches, new Date(date))
    const timestamp = new Date().toISOString()
    const nextContainerVolume = Math.min(Number(capacity), state.container.currentVolume + Number(volume))
    const percent = Math.round((nextContainerVolume / Number(capacity)) * 100)
    const scheduled = percent >= Number(state.settings.pickupPriorityThreshold)
    const record = { id:`VOL-${Date.now()}`,batchId,sppgId,date,volume:Number(volume),condition,notes,createdAt:timestamp }
    const batch = { batchId,sppgId,sppgName:profile?.name||'SPPG Banjarbaru Utara',location:`${profile?.city||'Banjarbaru'}, ${profile?.province||'Kalimantan Selatan'}`,volume:Number(volume),containerCapacity:Number(capacity),qualityGrade:null,qualityScore:null,logisticsPartner:state.settings.defaultLogistics,vehicle:'Belum ditugaskan',processingFacility:state.settings.defaultFacility,status:scheduled?'scheduled':'recorded',createdAt:timestamp,updatedAt:timestamp }
    const schedule = scheduled ? { id:`PICK-${Date.now()}`,batchId,scheduledAt:new Date(Date.now()+24*60*60*1000).toISOString(),window:'09.00–10.30 WITA',partner:state.settings.defaultLogistics,vehicle:'Belum ditugaskan',driver:'Belum ditugaskan',status:'scheduled' } : null
    const routeStop = scheduled ? { stopId:`STOP-${Date.now()}`,batchId,name:batch.sppgName,volume:Number(volume),urgency:'Tinggi',distance:4.2,status:'waiting',x:12,y:76 } : null
    dispatch({type:'ADD_VOLUME_RECORD',payload:{record,batch,schedule,routeStop,nextContainerVolume}})
    return { batchId, scheduled }
  }

  return {
    state, dispatch, addVolumeRecord,
    updateSensor:(value)=>dispatch({type:'UPDATE_SENSOR',payload:{value}}),
    updateProfile:(profile)=>dispatch({type:'UPDATE_PROFILE',payload:profile}),
    toggleProfileSensor:(id)=>dispatch({type:'TOGGLE_PROFILE_SENSOR',payload:{id}}),
    regenerateQr:(id)=>dispatch({type:'REGENERATE_QR',payload:{id}}),
    optimizeRoute:()=>dispatch({type:'OPTIMIZE_ROUTE'}),
    assignPickup:(payload)=>dispatch({type:'ASSIGN_PICKUP',payload}),
    startRoute:()=>dispatch({type:'START_ROUTE'}),
    markArrived:()=>dispatch({type:'MARK_ARRIVED'}),
    beginQuality:(batchId)=>dispatch({type:'BEGIN_QUALITY',payload:{batchId}}),
    saveQuality:(result)=>dispatch({type:'SAVE_QUALITY',payload:result}),
    completePickup:()=>dispatch({type:'COMPLETE_PICKUP'}),
    markPickupIssue:(batchId,reason)=>dispatch({type:'MARK_PICKUP_ISSUE',payload:{batchId,reason}}),
    cancelPickup:(batchId,reason)=>dispatch({type:'CANCEL_PICKUP',payload:{batchId,reason}}),
    sendToFacility:()=>dispatch({type:'SEND_TO_FACILITY'}),
    confirmFacilityArrival:(batchId)=>dispatch({type:'CONFIRM_FACILITY_ARRIVAL',payload:{batchId}}),
    checkDocuments:(batchId)=>dispatch({type:'CHECK_DOCUMENTS',payload:{batchId}}),
    saveFacilityReview:(review)=>dispatch({type:'SAVE_FACILITY_REVIEW',payload:review}),
    acceptBatch:(batchId,acceptance)=>dispatch({type:'ACCEPT_BATCH',payload:{batchId,acceptance}}),
    rejectBatch:(batchId,reason)=>dispatch({type:'REJECT_BATCH',payload:{batchId,reason}}),
    requestReview:(batchId)=>dispatch({type:'REQUEST_REVIEW',payload:{batchId}}),
    completeDocument:(batchId)=>dispatch({type:'COMPLETE_DOCUMENT',payload:{batchId}}),
    markIncentivePaid:(batchId)=>dispatch({type:'MARK_INCENTIVE_PAID',payload:{batchId}}),
    upsertFleet:(item)=>dispatch({type:'UPSERT_FLEET',payload:item}),
    setFleetStatus:(id,status,notes)=>dispatch({type:'SET_FLEET_STATUS',payload:{id,status,notes}}),
    toggleEntityStatus:(entity,id)=>dispatch({type:'TOGGLE_ENTITY_STATUS',payload:{entity,id}}),
    saveSettings:(settings)=>dispatch({type:'SAVE_SETTINGS',payload:settings}),
    resetSettings:()=>dispatch({type:'RESET_SETTINGS',payload:structuredClone(initialAppData.settings)}),
    clearActivities:()=>dispatch({type:'CLEAR_ACTIVITIES'}),
    markNotificationsRead:()=>dispatch({type:'MARK_NOTIFICATIONS_READ'}),
    resetData:()=>dispatch({type:'RESET_DATA',payload:structuredClone(initialAppData)}),
  }
}
