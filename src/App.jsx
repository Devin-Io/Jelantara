import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { adminMenu } from './data/content'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const OperatorDashboard = lazy(() => import('./pages/OperatorPages').then((m) => ({ default: m.OperatorDashboard })))
const OperatorHistoryPage = lazy(() => import('./pages/OperatorPages').then((m) => ({ default: m.OperatorHistoryPage })))
const OperatorSchedulePage = lazy(() => import('./pages/OperatorPages').then((m) => ({ default: m.OperatorSchedulePage })))
const OperatorIncentivePage = lazy(() => import('./pages/OperatorPages').then((m) => ({ default: m.OperatorIncentivePage })))
const VolumeLogPage = lazy(() => import('./pages/OperatorPages').then((m) => ({ default: m.VolumeLogPage })))
const OperatorDocumentsPage = lazy(() => import('./pages/OperatorExtendedPages').then((m)=>({default:m.OperatorDocumentsPage})))
const OperatorProfilePage = lazy(() => import('./pages/OperatorExtendedPages').then((m)=>({default:m.OperatorProfilePage})))
const LogisticsDashboard = lazy(() => import('./pages/LogisticsPages').then((m) => ({ default: m.LogisticsDashboard })))
const RouteOptimizationPage = lazy(() => import('./pages/LogisticsPages').then((m) => ({ default: m.RouteOptimizationPage })))
const LogisticsPickupPage = lazy(() => import('./pages/LogisticsExtendedPages').then((m)=>({default:m.LogisticsPickupPage})))
const FleetManagementPage = lazy(() => import('./pages/LogisticsExtendedPages').then((m)=>({default:m.FleetManagementPage})))
const LogisticsHistoryPage = lazy(() => import('./pages/LogisticsExtendedPages').then((m)=>({default:m.LogisticsHistoryPage})))
const LogisticsDocumentsPage = lazy(() => import('./pages/LogisticsExtendedPages').then((m)=>({default:m.LogisticsDocumentsPage})))
const QualityVerificationPage = lazy(() => import('./pages/SharedModules').then((m) => ({ default: m.QualityVerificationPage })))
const TraceabilityPage = lazy(() => import('./pages/SharedModules').then((m) => ({ default: m.TraceabilityPage })))
const IncentivePage = lazy(() => import('./pages/SharedModules'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const AdminSppgPage = lazy(() => import('./pages/AdminExtendedPages').then((m)=>({default:m.AdminSppgPage})))
const AdminLogisticsPage = lazy(() => import('./pages/AdminExtendedPages').then((m)=>({default:m.AdminLogisticsPage})))
const AdminFacilitiesPage = lazy(() => import('./pages/AdminExtendedPages').then((m)=>({default:m.AdminFacilitiesPage})))
const AdminBatchesPage = lazy(() => import('./pages/AdminExtendedPages').then((m)=>({default:m.AdminBatchesPage})))
const AdminQualityPage = lazy(() => import('./pages/AdminExtendedPages').then((m)=>({default:m.AdminQualityPage})))
const AdminReportsPage = lazy(() => import('./pages/AdminExtendedPages').then((m)=>({default:m.AdminReportsPage})))
const AdminSettingsPage = lazy(() => import('./pages/AdminExtendedPages').then((m)=>({default:m.AdminSettingsPage})))
const ProcessingPage = lazy(() => import('./pages/ProcessingPage'))
const IncomingBatchPage = lazy(() => import('./pages/ProcessingExtendedPages').then((m)=>({default:m.IncomingBatchPage})))
const FacilityAcceptancePage = lazy(() => import('./pages/ProcessingExtendedPages').then((m)=>({default:m.FacilityAcceptancePage})))
const FacilityQualityReviewPage = lazy(() => import('./pages/ProcessingExtendedPages').then((m)=>({default:m.FacilityQualityReviewPage})))
const FacilityDocumentsPage = lazy(() => import('./pages/ProcessingExtendedPages').then((m)=>({default:m.FacilityDocumentsPage})))
const ReferencesPage = lazy(() => import('./pages/ReferencesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function LoadingScreen() {
  return <div className="grid min-h-screen place-items-center bg-soft"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500"/><div className="mt-4 text-sm font-semibold text-muted">Memuat JELANTARA...</div></div></div>
}

export default function App() {
  const location = useLocation()
  return <Suspense fallback={<LoadingScreen/>}><div key={location.pathname} className="route-enter"><Routes location={location}>
    <Route path="/" element={<LandingPage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/referensi" element={<ReferencesPage/>}/>
    <Route path="/operator" element={<OperatorDashboard/>}/><Route path="/operator/catat-volume" element={<VolumeLogPage/>}/><Route path="/operator/jadwal" element={<OperatorSchedulePage/>}/><Route path="/operator/riwayat" element={<OperatorHistoryPage/>}/><Route path="/operator/insentif" element={<OperatorIncentivePage/>}/><Route path="/operator/dokumen" element={<OperatorDocumentsPage/>}/><Route path="/operator/profil" element={<OperatorProfilePage/>}/>
    <Route path="/logistik" element={<LogisticsDashboard/>}/><Route path="/logistik/rute" element={<RouteOptimizationPage/>}/><Route path="/logistik/penjemputan" element={<LogisticsPickupPage/>}/><Route path="/logistik/verifikasi" element={<QualityVerificationPage/>}/><Route path="/logistik/armada" element={<FleetManagementPage/>}/><Route path="/logistik/riwayat" element={<LogisticsHistoryPage/>}/><Route path="/logistik/dokumen" element={<LogisticsDocumentsPage/>}/>
    <Route path="/pengolahan" element={<ProcessingPage/>}/><Route path="/pengolahan/batch" element={<IncomingBatchPage/>}/><Route path="/pengolahan/penerimaan" element={<FacilityAcceptancePage/>}/><Route path="/pengolahan/quality" element={<FacilityQualityReviewPage/>}/><Route path="/pengolahan/dokumen" element={<FacilityDocumentsPage/>}/>
    <Route path="/traceability" element={<TraceabilityPage menu={adminMenu} contextLabel="Traceability Viewer"/>}/>
    <Route path="/admin" element={<AdminPage/>}/><Route path="/admin/sppg" element={<AdminSppgPage/>}/><Route path="/admin/logistik" element={<AdminLogisticsPage/>}/><Route path="/admin/fasilitas" element={<AdminFacilitiesPage/>}/><Route path="/admin/batch" element={<AdminBatchesPage/>}/><Route path="/admin/quality" element={<AdminQualityPage/>}/><Route path="/admin/insentif" element={<IncentivePage menu={adminMenu} contextLabel="Administrator JELANTARA"/>}/><Route path="/admin/laporan" element={<AdminReportsPage/>}/><Route path="/admin/pengaturan" element={<AdminSettingsPage/>}/>
    <Route path="/dashboard" element={<Navigate to="/login" replace/>}/><Route path="*" element={<NotFoundPage/>}/>
  </Routes></div></Suspense>
}
