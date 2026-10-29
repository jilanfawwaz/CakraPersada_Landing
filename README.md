# CakraPersada_Landing

Landing page publik `https://guesthousecakrapersada.com` (Indonesia di `/`, Inggris di `/en/`).
Situs statis: tidak ada database, tidak ada JavaScript, tidak ada rahasia di folder ini.

## Isi folder

- `build.mjs`: **semua teks, harga, kontak, dan tautan** (dua bahasa) ada di bagian "ISI". Ubah di sana.
- `src/style.css`: tampilan. `src/img/`: foto dan logo. `src/fonts/`: font Poppins (disimpan sendiri, bukan dari Google).
- `dist/`: hasil build (dibuat otomatis, tidak masuk Git). Folder inilah yang diunggah ke server.
- `Caddy-landing.txt`: blok konfigurasi Caddy untuk domain utama.

## Mengubah isi, lalu memasang

1. Ubah teks/harga di `build.mjs` (harga ada di `ROOMS`, nomor WhatsApp di `WA`, lokasi sekitar di `NEAR`).
2. Bangun ulang: `node build.mjs`
3. Lihat di laptop (opsional): `npx serve dist` lalu buka alamat yang tampil.
4. Unggah ke server:
   ```
   rsync -av --delete -e "ssh -i ~/.ssh/cakrapersada_vps" dist/ deploy@103.103.23.241:/opt/cakrapersada/web/landing/
   ```
   Tidak perlu restart apa pun; halaman langsung berubah.

## Menambah atau mengganti foto

Foto harus dikecilkan dan diubah ke format WebP agar cepat dimuat (maks. lebar 1600 px, plus versi `-800`).
Minta Claude menyiapkannya, atau taruh foto aslinya dan kabari.

## Catatan

- Tanda `<s>` pada harga (harga coret) mengikuti pricelist. Hapus bila promo berakhir.
- Dua bahasa dibuat sebagai dua alamat terpisah (`/` dan `/en/`) agar bisa ditemukan di Google dalam dua bahasa.
