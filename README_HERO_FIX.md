# JELANTARA Hero Refinement V4.1

Perbaikan khusus pada hero landing page:

- Menghapus floating pill `Wadah 76% terisi` yang terasa menggantung.
- Mengubah indikator wadah menjadi panel telemetry lengkap.
- Menampilkan 456 dari 600 liter, persentase 76%, progress bar, dan marker ambang prioritas 85%.
- Memperbesar kolom visual sistem agar seimbang dengan headline.
- Menata ulang telemetry menjadi Batch, Tahap Aktif, dan Rekam Jejak.
- Memindahkan status chain of custody ke strip internal yang lebih kontekstual.
- Menambahkan tombol pause/lanjutkan untuk simulasi otomatis.
- Memperbaiki hierarchy, spacing, radius, dan responsivitas mobile.

## Pemasangan patch

1. Hentikan `npm run dev` dengan `Ctrl + C`.
2. Salin folder `src` dari patch ke folder project utama.
3. Pilih **Replace the files in the destination**.
4. Jalankan kembali:

```bash
npm run dev
```

5. Hard refresh browser dengan `Ctrl + Shift + R`.

Tidak ada dependency baru dan tidak perlu menjalankan `npm install`.
