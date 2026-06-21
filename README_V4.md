# JELANTARA V4 — Zero Placeholder Modules

Versi ini menyelesaikan 17 route yang sebelumnya memakai halaman generik. Seluruh route kini menggunakan halaman khusus, membaca global state React Context/useReducer, dan menyimpan perubahan melalui localStorage.

## Pemasangan sebagai patch

1. Hentikan Vite dengan `Ctrl + C`.
2. Salin folder `src` dari paket patch ke project `JELANTARA_Prototype_Source`.
3. Pilih **Replace the files in the destination**.
4. Jalankan `npm run dev`.
5. Lakukan hard refresh dengan `Ctrl + Shift + R`.

Dependency tidak berubah, sehingga patch tidak memerlukan `npm install` ulang.

## Route yang dituntaskan

- `/operator/dokumen`
- `/operator/profil`
- `/logistik/penjemputan`
- `/logistik/armada`
- `/logistik/riwayat`
- `/logistik/dokumen`
- `/pengolahan/batch`
- `/pengolahan/penerimaan`
- `/pengolahan/quality`
- `/pengolahan/dokumen`
- `/admin/sppg`
- `/admin/logistik`
- `/admin/fasilitas`
- `/admin/batch`
- `/admin/quality`
- `/admin/laporan`
- `/admin/pengaturan`

## State baru

- `sppgProfiles`
- `logisticsPartners`
- `facilities`
- `fleet`
- `documents`
- `facilityReviews`
- `incidents`
- `settings`
- `settingsHistory`

## Fitur operasional

- Dokumen dapat dicari, difilter, dipratinjau, dicetak, dan diunduh sebagai Blob.
- Profil SPPG dapat diedit, divalidasi, disimpan, dan memiliki riwayat perubahan.
- Penjemputan memiliki tab status, assign armada, perjalanan, verifikasi, kendala, dan pembatalan.
- Armada dapat ditambah, diedit, diberi status pemeliharaan, dan dipantau kapasitasnya.
- Riwayat logistik dapat difilter, dipaginasi, dilihat detailnya, dan diekspor CSV.
- Fasilitas dapat mengonfirmasi kedatangan, memeriksa dokumen, melakukan quality review, menerima, meminta review, atau menolak batch.
- Admin memiliki monitoring SPPG, logistik, fasilitas, batch, mutu, report builder, dan pengaturan yang memengaruhi alur.
- Landing page dan overview admin tidak lagi menampilkan label aset kosong.

## Menjalankan project lengkap

```bash
npm install
npm run dev
```

Audit production:

```bash
npm run build
```
