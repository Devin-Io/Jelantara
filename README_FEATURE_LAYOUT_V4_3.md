# JELANTARA Feature Layout Refinement V4.3

Perbaikan ini memfokuskan ulang section **Lima Modul Utama** agar lebih seimbang, profesional, dan tidak memiliki ruang kosong besar.

## Perubahan utama

- Grid desktop menjadi dua baris yang seimbang:
  - Baris atas: Modul 01 (7 kolom) + Modul 02 (5 kolom)
  - Baris bawah: Modul 03, 04, dan 05 masing-masing 4 kolom
- Modul 01 tetap menjadi featured card, tetapi tidak lagi setinggi dua kartu.
- Semua kartu memakai flex column sehingga CTA selalu sejajar di bagian bawah.
- Setiap modul memiliki mini visual fungsional:
  - volume dan sinkronisasi,
  - quality score,
  - diagram rute,
  - ringkasan formula insentif,
  - progress traceability.
- Decorative shape diperkecil dan diganti aksen top-line yang lebih profesional.
- Responsive:
  - tablet: 2 kolom, Modul 01 memenuhi satu baris,
  - mobile: 1 kolom berurutan.
- Animasi menghormati `prefers-reduced-motion`.

## File yang diubah

- `src/pages/LandingPage.jsx`
- `src/index.css`

## Instalasi patch

1. Hentikan Vite dengan `Ctrl + C`.
2. Salin folder `src` dari patch ke project utama.
3. Pilih **Replace the files in the destination**.
4. Jalankan `npm run dev`.
5. Lakukan hard refresh dengan `Ctrl + Shift + R`.

Tidak diperlukan `npm install` karena tidak ada dependency baru.

## Build

`npm run build` berhasil dengan 2161 modules transformed.
