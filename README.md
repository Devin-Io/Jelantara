# JELANTARA — Jelantah Nusantara

Prototype website multipage untuk gagasan **JELANTARA: Platform Digital Terintegrasi Kecerdasan Buatan untuk Pendistribusian Jelantah Dapur MBG Menuju Ekosistem Bioavtur Berkelanjutan**.

## Menjalankan Project

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

## Akun Dummy

Password seluruh akun: `jelantara123`

| Peran | Email |
|---|---|
| Operator SPPG | `operator@jelantara.id` |
| Mitra Logistik | `logistik@jelantara.id` |
| Mitra Pengolahan | `pengolahan@jelantara.id` |
| Administrator | `admin@jelantara.id` |

## Struktur Utama

```text
src/
  assets/placeholders/
  components/
    common/
    dashboard/
  context/
  data/
  pages/
  App.jsx
  main.jsx
  index.css
```

## Fitur yang Sudah Dibuat

- Landing page lengkap berdasarkan esai.
- Login dan quick role selector.
- Dashboard Operator SPPG.
- Pencatatan volume dengan validasi, QR/sensor simulasi, localStorage, dan toast.
- Riwayat UCO dengan search, filter, sorting, pagination, dan modal detail.
- Dashboard mitra logistik dan peta/route diagram tanpa API berbayar.
- AI Quality Verification dengan upload, preview, loading, dan dummy logic.
- Route Optimization sebelum/sesudah optimasi.
- Kalkulator insentif, invoice modal, status pembayaran, dan dummy receipt.
- Traceability tracker tujuh tahap dan Sustainability Record simulasi.
- Dashboard mitra pengolahan.
- Dashboard administrator dengan Recharts dan tabel monitoring.
- Halaman referensi gagasan.
- Responsive sidebar/drawer dan mobile navigation.
- Komponen reusable: Navbar, Footer, Sidebar, PageHeader, StatCard, StatusBadge, DataTable, EmptyState, PlaceholderImage, Modal, Toast, ChartCard, TraceabilityTracker, QualityScore, RouteSummary, SectionHeading.

## Mengganti Gambar Placeholder

Simpan aset ke:

```text
src/assets/placeholders/
```

Panduan nama file terdapat pada `src/assets/placeholders/README.md`. Impor aset ke komponen yang saat ini memakai `PlaceholderImage`.

## Bagian yang Masih Simulasi

- Autentikasi dan role.
- Data dashboard.
- Integrasi sensor dan QR.
- Analisis mutu berbasis AI.
- Optimasi rute.
- Nominal insentif dan pembayaran.
- Peta distribusi.
- Sustainability Record.
- Integrasi pemerintah, industri, regulator, dan lembaga sertifikasi.

## Saran Pengembangan Berikutnya

1. Hubungkan backend dan basis data.
2. Tambahkan autentikasi aman serta role-based access control.
3. Integrasikan perangkat sensor dan QR nyata.
4. Validasi model computer vision dengan ahli serta pengujian laboratorium.
5. Terapkan solver Vehicle Routing Problem.
6. Integrasikan sistem pembayaran yang disepakati.
7. Susun format dokumen traceability bersama auditor/sertifikator.
8. Lakukan pilot project terbatas dan usability testing dengan operator lapangan.

Lihat `PRODUCT_NOTES.md` untuk pemahaman produk, sitemap, user flow, dan design system. Lihat `AUDIT.md` untuk audit akhir.
