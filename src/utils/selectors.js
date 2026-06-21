export const activeStatuses = ['recorded','scheduled','picked_up','quality_verified','in_transit']

export function getBatchById(state, batchId) { return state.batches.find((item) => item.batchId === batchId) }
export function getBatchesByStatus(state, statuses) { const list = Array.isArray(statuses) ? statuses : [statuses]; return state.batches.filter((item) => list.includes(item.status)) }
export function getActivePickups(state) { return state.pickupSchedules.filter((item) => !['completed','cancelled'].includes(item.status)) }
export function getDocumentsByBatch(state, batchId) { return state.documents.filter((item) => item.batchId === batchId) }
export function getFleetUtilization(state) { return state.fleet.map((item) => ({ ...item, utilization:item.capacity ? Math.round(item.currentLoad / item.capacity * 100) : 0 })) }
export function getFacilityQueue(state) { return state.processingReceipts.map((receipt) => ({ ...receipt, batch:getBatchById(state, receipt.batchId) })).filter((item) => item.batch) }
export function getQualityDistribution(state) { return ['Grade A','Grade B','Grade C'].map((grade) => ({ grade, count:state.qualityResults.filter((item) => item.grade === grade).length })) }
export function getTraceabilityCompleteness(state, batchId) { const count = new Set(state.traceabilityEvents.filter((event) => event.batchId === batchId).map((event) => event.type)).size; return Math.min(100, Math.round(count / 7 * 100)) }
export function getIncentiveSummary(state) { return state.incentiveTransactions.reduce((acc,item) => ({ total:acc.total + item.total, pending:acc.pending + (item.status !== 'paid' ? item.total : 0), paid:acc.paid + (item.status === 'paid' ? item.total : 0) }), { total:0,pending:0,paid:0 }) }
export function getSppgPerformance(state) {
  return state.sppgProfiles.map((profile) => {
    const records = state.volumeRecords.filter((item) => item.sppgId === profile.id)
    const batches = state.batches.filter((item) => item.sppgId === profile.id)
    return { ...profile, volume:records.reduce((sum,item)=>sum+item.volume,0), activeBatches:batches.filter((item)=>activeStatuses.includes(item.status)).length, lastPickup:state.pickupSchedules.find((item)=>batches.some((batch)=>batch.batchId===item.batchId))?.scheduledAt || null, participation:Math.min(100, 60 + records.length * 4) }
  })
}
export function getLogisticsPerformance(state) {
  return state.logisticsPartners.map((partner) => {
    const routes = state.logisticsRoutes
    const completed = routes.reduce((sum,route)=>sum+route.stops.filter((stop)=>stop.status==='completed').length,0)
    const total = routes.reduce((sum,route)=>sum+route.stops.length,0)
    return { ...partner, fleetCount:state.fleet.length, activeFleet:state.fleet.filter((item)=>['assigned','in_transit','full'].includes(item.status)).length, completed, delayed:state.incidents.length, totalVolume:state.fleet.reduce((sum,item)=>sum+item.currentLoad,0), completionRate:total?Math.round(completed/total*100):0 }
  })
}
