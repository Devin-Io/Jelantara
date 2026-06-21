import {
  Activity,
  BadgeDollarSign,
  Building2,
  BusFront,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardList,
  Database,
  Droplets,
  Factory,
  FileCheck2,
  Gauge,
  Globe2,
  Leaf,
  MapPinned,
  Network,
  Plane,
  Recycle,
  Route,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Truck,
  UsersRound,
  WalletCards,
} from 'lucide-react'

export const navLinks = [
  ['Beranda', '#beranda'],
  ['Tentang', '#tentang'],
  ['Cara Kerja', '#cara-kerja'],
  ['Fitur', '#fitur'],
  ['Dampak', '#dampak'],
  ['Mitra', '#mitra'],
]

export const productStats = [
  { value: '27.983', label: 'SPPG telah beroperasi', detail: 'Data yang digunakan dalam esai' },
  { value: '500–590 L', label: 'Potensi UCO per SPPG per bulan', detail: 'Estimasi berdasarkan sumber esai' },
  { value: '±6 juta L', label: 'Potensi UCO per bulan di Pulau Jawa', detail: 'Estimasi dari jaringan SPPG Pulau Jawa' },
  { value: '715 kt', label: 'Potensi UCO Indonesia per tahun', detail: 'Potensi pengumpulan nasional' },
  { value: '20–40%', label: 'Tingkat pengumpulan saat ini', detail: 'Menunjukkan ruang peningkatan sistem' },
  { value: 'hingga 80%', label: 'Potensi penurunan emisi', detail: 'Dibandingkan avtur fosil sepanjang siklus hidup' },
]

export const problems = [
  ['Pasokan tersebar', 'Minyak jelantah berasal dari banyak titik SPPG dengan pola produksi yang berbeda.', MapPinned],
  ['Pencatatan terpisah', 'Volume, kondisi wadah, dan status pengumpulan belum berada dalam satu sistem.', Database],
  ['Rute tidak efisien', 'Penjemputan manual berisiko menambah jarak, waktu, dan biaya operasional.', Route],
  ['Mutu belum terverifikasi', 'Kualitas visual UCO perlu pemeriksaan awal sebelum penyaluran lebih lanjut.', ScanLine],
  ['Traceability terbatas', 'Chain of custody sulit dibuktikan jika proses masih mengandalkan dokumen manual.', FileCheck2],
  ['Potensi tidak terserap', 'Tanpa visibilitas pasokan, industri sulit memperoleh bahan baku yang stabil.', Factory],
]

export const features = [
  {
    category: 'Volume Tracking',
    title: 'Smart Volume Logging',
    text: 'Pencatatan volume melalui QR Code, input operator, dan simulasi integrasi sensor wadah.',
    icon: ClipboardList,
    href: '/operator/catat-volume',
  },
  {
    category: 'Quality Screening',
    title: 'AI Quality Verification',
    text: 'Pemeriksaan awal warna dan kekeruhan citra UCO yang dipadukan dengan input lapangan.',
    icon: Sparkles,
    href: '/logistik/verifikasi',
  },
  {
    category: 'Route Planning',
    title: 'Smart Route Optimization',
    text: 'Penyusunan rute berdasarkan lokasi, volume, urgensi, dan kapasitas armada.',
    icon: Route,
    href: '/logistik/rute',
  },
  {
    category: 'Incentive Engine',
    title: 'Transparent Incentive',
    text: 'Simulasi perhitungan insentif berdasarkan volume dan grade mutu yang terverifikasi.',
    icon: BadgeDollarSign,
    href: '/operator/insentif',
  },
  {
    category: 'Traceability Record',
    title: 'Traceability & Chain of Custody',
    text: 'Jejak digital batch dari sumber SPPG hingga penerimaan fasilitas pengolahan.',
    icon: ShieldCheck,
    href: '/traceability',
  },
]

export const workflow = [
  ['01', 'Catat volume', 'Operator SPPG mencatat volume UCO dan kondisi wadah.', Droplets],
  ['02', 'Susun jadwal', 'Sistem menyusun prioritas dan rute penjemputan.', Route],
  ['03', 'Verifikasi awal', 'Petugas logistik memeriksa mutu awal di lokasi.', ScanLine],
  ['04', 'Terima di fasilitas', 'Batch diterima oleh mitra fasilitas pengolahan.', Factory],
  ['05', 'Terbitkan rekam jejak', 'Insentif dan sustainability record simulasi disiapkan.', FileCheck2],
]

export const stakeholders = [
  ['SPPG', Droplets],
  ['Badan Gizi Nasional', Building2],
  ['Mitra logistik', Truck],
  ['Fasilitas pengolahan SAF', Factory],
  ['Kementerian / regulator', ShieldCheck],
  ['Lembaga sertifikasi', FileCheck2],
]

export const impactGroups = [
  {
    title: 'Lingkungan',
    icon: Leaf,
    items: ['Mengurangi pembuangan ke saluran air dan tanah', 'Mendukung bahan bakar penerbangan berbasis limbah', 'Membantu pengurangan emisi'],
  },
  {
    title: 'Ekonomi',
    icon: WalletCards,
    items: ['Memberikan nilai ekonomi pada minyak jelantah', 'Menyediakan insentif yang transparan', 'Membuka ekosistem circular economy'],
  },
  {
    title: 'Operasional',
    icon: ChartNoAxesCombined,
    items: ['Meningkatkan visibilitas pasokan', 'Mengurangi rute yang tidak efisien', 'Mempermudah audit dan traceability'],
  },
]

export const implementation = [
  {
    step: 'Tahap 1',
    title: 'Validasi dan Persiapan',
    items: ['Pemetaan kebutuhan', 'Validasi proses operasional', 'Pengembangan MVP', 'Penetapan standar pencatatan'],
  },
  {
    step: 'Tahap 2',
    title: 'Pilot Project Pulau Jawa',
    items: ['Implementasi pada klaster terpilih', 'Pengujian volume dan penjemputan', 'Verifikasi mutu awal', 'Evaluasi kesiapan operator'],
  },
  {
    step: 'Tahap 3',
    title: 'Integrasi Mitra',
    items: ['Integrasi mitra logistik', 'Integrasi fasilitas pengolahan', 'Penyempurnaan skema insentif', 'Standardisasi traceability'],
  },
  {
    step: 'Tahap 4',
    title: 'Replikasi Nasional',
    items: ['Perluasan ke wilayah lain', 'Penguatan infrastruktur', 'Analitik nasional', 'Integrasi regulator dan lembaga sertifikasi'],
  },
]

export const swot = {
  Strengths: ['Integrasi AI dan traceability', 'Transparansi insentif', 'Skalabilitas untuk banyak SPPG', 'Dukungan kemitraan multipihak'],
  Weaknesses: ['Ketergantungan pada literasi digital', 'Infrastruktur internet tidak merata', 'Verifikasi visual belum menggantikan laboratorium', 'Membutuhkan investasi awal'],
  Opportunities: ['Kebijakan bioavtur nasional', 'Skala Program MBG', 'Permintaan bahan baku SAF', 'Momentum transisi energi dan net-zero'],
  Threats: ['Fluktuasi permintaan UCO', 'Resistensi adopsi teknologi', 'Jalur pengumpulan informal', 'Tantangan standardisasi operasional'],
}

export const weeklyVolume = [
  { name: 'Sen', volume: 18 },
  { name: 'Sel', volume: 22 },
  { name: 'Rab', volume: 21 },
  { name: 'Kam', volume: 26 },
  { name: 'Jum', volume: 24 },
  { name: 'Sab', volume: 17 },
  { name: 'Min', volume: 14 },
]

export const monthlyVolume = [
  { name: 'Jan', volume: 422 },
  { name: 'Feb', volume: 448 },
  { name: 'Mar', volume: 476 },
  { name: 'Apr', volume: 503 },
  { name: 'Mei', volume: 528 },
  { name: 'Jun', volume: 552 },
]

export const operatorHistory = [
  { id: 'UCO-2606-001', date: '18 Jun 2026', volume: 92, quality: 'Grade A', pickup: 'Dijadwalkan', partner: 'Borneo Circular Logistik', incentive: 'Processing' },
  { id: 'UCO-2606-002', date: '15 Jun 2026', volume: 86, quality: 'Grade A', pickup: 'Selesai', partner: 'Borneo Circular Logistik', incentive: 'Paid' },
  { id: 'UCO-2606-003', date: '11 Jun 2026', volume: 71, quality: 'Grade B', pickup: 'Selesai', partner: 'Nusa Angkut Hijau', incentive: 'Paid' },
  { id: 'UCO-2606-004', date: '07 Jun 2026', volume: 78, quality: 'Grade A', pickup: 'Selesai', partner: 'Borneo Circular Logistik', incentive: 'Paid' },
  { id: 'UCO-2605-011', date: '29 Mei 2026', volume: 84, quality: 'Grade B', pickup: 'Selesai', partner: 'Nusa Angkut Hijau', incentive: 'Paid' },
  { id: 'UCO-2605-010', date: '24 Mei 2026', volume: 69, quality: 'Grade C', pickup: 'Selesai', partner: 'Borneo Circular Logistik', incentive: 'Pending' },
  { id: 'UCO-2605-009', date: '19 Mei 2026', volume: 88, quality: 'Grade A', pickup: 'Selesai', partner: 'Borneo Circular Logistik', incentive: 'Paid' },
]

export const routes = [
  { order: 1, name: 'SPPG Banjarbaru Utara', volume: 92, urgency: 'Tinggi', distance: 4.2, status: 'Siap dijemput' },
  { order: 2, name: 'SPPG Landasan Ulin', volume: 78, urgency: 'Sedang', distance: 6.8, status: 'Siap dijemput' },
  { order: 3, name: 'SPPG Cempaka', volume: 66, urgency: 'Sedang', distance: 8.1, status: 'Menunggu' },
  { order: 4, name: 'SPPG Liang Anggang', volume: 83, urgency: 'Tinggi', distance: 7.4, status: 'Siap dijemput' },
]

export const traceBatch = {
  id: 'JLT-BJB-2606-0018',
  origin: 'SPPG Banjarbaru Utara',
  location: 'Banjarbaru, Kalimantan Selatan',
  loggedAt: '18 Juni 2026, 08.42 WITA',
  volume: '92 liter',
  quality: 'Grade A — skor awal 88/100',
  officer: 'Raka Pratama',
  vehicle: 'DA 8421 BF',
  pickupAt: '19 Juni 2026, 09.15 WITA',
  destination: 'Fasilitas Pengolahan Mitra — Simulasi',
  reception: 'Diterima untuk pemeriksaan lanjutan',
  stages: [
    ['Dicatat oleh SPPG', '18 Jun · 08.42', true],
    ['Dijadwalkan', '18 Jun · 14.10', true],
    ['Dijemput', '19 Jun · 09.15', true],
    ['Diverifikasi', '19 Jun · 09.32', true],
    ['Dalam perjalanan', '19 Jun · 10.05', true],
    ['Diterima fasilitas', '19 Jun · 12.48', true],
    ['Dokumen selesai', 'Menunggu finalisasi', false],
  ],
}

export const adminTrend = [
  { month: 'Jan', recorded: 42, picked: 34, received: 29 },
  { month: 'Feb', recorded: 48, picked: 39, received: 35 },
  { month: 'Mar', recorded: 56, picked: 46, received: 42 },
  { month: 'Apr', recorded: 63, picked: 55, received: 49 },
  { month: 'Mei', recorded: 72, picked: 64, received: 58 },
  { month: 'Jun', recorded: 84, picked: 75, received: 69 },
]

export const qualityDistribution = [
  { name: 'Grade A', value: 58 },
  { name: 'Grade B', value: 31 },
  { name: 'Grade C', value: 11 },
]

export const monitoringRows = [
  { id: 'JLT-BJB-2606-0018', region: 'Kalimantan Selatan', source: 'SPPG Banjarbaru Utara', volume: 92, status: 'Dalam perjalanan', quality: 'Grade A' },
  { id: 'JLT-SBY-2606-0112', region: 'Jawa Timur', source: 'SPPG Surabaya Barat', volume: 108, status: 'Diterima fasilitas', quality: 'Grade A' },
  { id: 'JLT-SMG-2606-0081', region: 'Jawa Tengah', source: 'SPPG Semarang Selatan', volume: 76, status: 'Diverifikasi', quality: 'Grade B' },
  { id: 'JLT-BDG-2606-0067', region: 'Jawa Barat', source: 'SPPG Bandung Timur', volume: 84, status: 'Dijadwalkan', quality: 'Grade A' },
]

export const references = [
  ['Air Transport Action Group (ATAG)', 'Facts & figures (2025).'],
  ['Badan Gizi Nasional', 'SPPG operasional dan potensi minyak jelantah Program MBG (2026).'],
  ['Ellen MacArthur Foundation', 'Towards the circular economy (2013).'],
  ['European Commission', 'ReFuelEU Aviation (2023).'],
  ['International Air Transport Association (IATA)', '2024 Aviation emissions (2025).'],
  ['International Civil Aviation Organization (ICAO)', 'Long term global aspirational goal (2022).'],
  ['International Council on Clean Transportation (ICCT)', 'UCO potential — Indonesia fact sheet (2022).'],
  ['ISCC System', 'ISCC CORSIA 203: Traceability and chain of custody (2023).'],
  ['Kementerian ESDM Republik Indonesia', 'Penahapan pemanfaatan bahan bakar nabati (2026).'],
  ['Reuters', 'Indonesia’s Pertamina delivers first used cooking oil aviation fuel (2025).'],
  ['United Nations', '2030 Agenda for Sustainable Development (2015).'],
]

export const operatorMenu = [
  ['Ringkasan', '/operator', Gauge],
  ['Catat Volume', '/operator/catat-volume', Droplets],
  ['Jadwal Penjemputan', '/operator/jadwal', Route],
  ['Riwayat UCO', '/operator/riwayat', ClipboardList],
  ['Insentif', '/operator/insentif', WalletCards],
  ['Dokumen', '/operator/dokumen', FileCheck2],
  ['Profil SPPG', '/operator/profil', Building2],
]

export const logisticsMenu = [
  ['Ringkasan', '/logistik', Gauge],
  ['Rute Hari Ini', '/logistik/rute', Route],
  ['Penjemputan', '/logistik/penjemputan', Truck],
  ['Verifikasi Mutu', '/logistik/verifikasi', ScanLine],
  ['Armada', '/logistik/armada', BusFront],
  ['Riwayat', '/logistik/riwayat', ClipboardList],
  ['Dokumen', '/logistik/dokumen', FileCheck2],
]

export const adminMenu = [
  ['Overview', '/admin', Gauge],
  ['SPPG', '/admin/sppg', Droplets],
  ['Mitra Logistik', '/admin/logistik', Truck],
  ['Fasilitas Pengolahan', '/admin/fasilitas', Factory],
  ['Batch UCO', '/admin/batch', Database],
  ['Quality Monitoring', '/admin/quality', ScanLine],
  ['Insentif', '/admin/insentif', WalletCards],
  ['Traceability', '/traceability', ShieldCheck],
  ['Laporan', '/admin/laporan', ClipboardList],
  ['Pengaturan', '/admin/pengaturan', Network],
]

export const processingMenu = [
  ['Ringkasan', '/pengolahan', Gauge],
  ['Batch Masuk', '/pengolahan/batch', Database],
  ['Penerimaan', '/pengolahan/penerimaan', CheckCircle2],
  ['Quality Review', '/pengolahan/quality', ScanLine],
  ['Dokumen', '/pengolahan/dokumen', FileCheck2],
]

export const roleOptions = [
  { role: 'operator', label: 'Operator SPPG', email: 'operator@jelantara.id', icon: Droplets, description: 'Mencatat volume, melihat jadwal, dan memantau insentif.' },
  { role: 'logistics', label: 'Mitra Logistik', email: 'logistik@jelantara.id', icon: Truck, description: 'Menjalankan rute, penjemputan, dan verifikasi mutu awal.' },
  { role: 'processing', label: 'Mitra Pengolahan', email: 'pengolahan@jelantara.id', icon: Factory, description: 'Menerima batch, meninjau data, dan menutup chain of custody.' },
  { role: 'admin', label: 'Administrator', email: 'admin@jelantara.id', icon: ShieldCheck, description: 'Memantau jaringan, kualitas, insentif, dan traceability.' },
]

export const dashboardIcons = {
  Droplets, Truck, Factory, ShieldCheck, Activity, Gauge, Globe2, Plane, Recycle, UsersRound, Database,
}
