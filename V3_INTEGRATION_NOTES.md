# JELANTARA Integrated Interactive Prototype V3

## Fokus perubahan

Versi V3 menutup kesenjangan utama versi sebelumnya: data dashboard tidak lagi berdiri sendiri. Seluruh role memakai satu global state berbasis React Context + `useReducer`, disimpan otomatis ke `localStorage`.

## Global state

- `container`
- `volumeRecords`
- `batches`
- `pickupSchedules`
- `logisticsRoutes`
- `qualityResults`
- `incentiveTransactions`
- `traceabilityEvents`
- `notifications`
- `activities`
- `processingReceipts`

## Hubungan antarmodul

1. Operator menyimpan pencatatan volume.
2. Sistem membuat Batch ID dan record traceability.
3. Jika kapasitas wadah minimal 85%, jadwal dan titik rute dibuat.
4. Dashboard logistik menjalankan state machine perjalanan.
5. Verifikasi mutu disimpan berdasarkan Batch ID.
6. Penjemputan memperbarui kapasitas kendaraan dan event traceability.
7. Batch dikirim ke antrean fasilitas.
8. Fasilitas mengonfirmasi kedatangan, memeriksa dokumen, dan menerima batch.
9. Penerimaan membuat transaksi insentif berstatus `processing`.
10. Traceability dapat difinalisasi menjadi Sustainability Record simulasi.
11. Administrator membaca semua perubahan dari state yang sama.

## Alur demo yang disarankan

### Operator

1. Login sebagai `operator@jelantara.id`.
2. Buka **Catat Volume**.
3. Tekan **Simulasi scan QR**.
4. Tekan **Ambil data sensor**.
5. Isi volume, misalnya 24 liter.
6. Simpan pencatatan.
7. Periksa Ringkasan, Riwayat UCO, dan Jadwal Penjemputan.

### Logistik

1. Login sebagai `logistik@jelantara.id`.
2. Buka Ringkasan Logistik.
3. Tekan **Mulai Rute**.
4. Tekan **Tandai Tiba**.
5. Tekan **Verifikasi Mutu**.
6. Pilih sampel demo, analisis, lalu simpan.
7. Kembali ke Ringkasan Logistik.
8. Tekan **Selesaikan Penjemputan**.
9. Ulangi untuk titik berikutnya atau gunakan data awal.
10. Setelah seluruh titik selesai, tekan **Kirim ke Fasilitas**.

### Fasilitas

1. Login sebagai `pengolahan@jelantara.id`.
2. Konfirmasi kedatangan.
3. Periksa dokumen.
4. Terima batch.
5. Nilai insentif dan traceability akan ikut diperbarui.

### Administrator dan traceability

1. Login sebagai `admin@jelantara.id`.
2. Lihat Overview Administrator.
3. Buka Traceability dan cari Batch ID.
4. Setelah batch diterima, tekan **Finalisasi Dokumen**.
5. Buka Sustainability Record simulasi.
6. Pada menu Insentif, admin dapat menyimulasikan pembayaran.

## Bagian yang tetap simulasi

- QR scanner.
- Pembacaan sensor.
- Computer vision untuk mutu.
- Optimasi rute dan angka efisiensi.
- Lokasi/peta.
- Harga dasar serta nominal insentif.
- Fasilitas pengolahan dan proses penerimaan.
- Sustainability Record.
- Tidak ada integrasi nyata dengan BGN, kementerian, Pertamina, regulator, laboratorium, atau lembaga sertifikasi.
