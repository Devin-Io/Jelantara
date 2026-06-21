# JELANTARA Integrated Prototype V3

## Menjalankan project lengkap

```bash
npm install
npm run dev
```

Buka alamat Vite yang tampil pada terminal, biasanya `http://localhost:5173/`.

## Memasang sebagai patch pada project lama

1. Hentikan server dengan `Ctrl + C`.
2. Salin folder `src` dari paket patch.
3. Tempel ke folder `JELANTARA_Prototype_Source`.
4. Pilih **Replace the files in the destination**.
5. Jalankan kembali:

```bash
npm run dev
```

Patch tidak memerlukan `npm install` karena tidak menambah dependency.

## Akun dummy

- Operator: `operator@jelantara.id`
- Logistik: `logistik@jelantara.id`
- Fasilitas: `pengolahan@jelantara.id`
- Administrator: `admin@jelantara.id`
- Password seluruh akun: `jelantara123`

## Reset demo

Gunakan tombol **Reset Data Simulasi** pada sidebar dashboard untuk mengembalikan seluruh state ke kondisi awal.
