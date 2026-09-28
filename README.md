# Portfolio — Rahma Adisty Muffid Azzahra

Website portfolio statis (HTML + CSS + JS biasa — bukan PHP, karena GitHub Pages
hanya melayani file statis).

## Struktur
- `index.html` — Beranda (hero, about, skills, preview experience, featured project, certificates coverflow, contact)
- `experience.html` — Work Experience & Volunteering (timeline lengkap)
- `projects.html` — Semua project
- `gallery.html` — Visual Design Showcase (social media, poster, logo & illustration)
- `css/style.css` — Semua styling & warna
- `js/script.js` — Menu mobile + logika carousel certificate

## Belum ada asetnya (masih placeholder, ganti kalau sudah ada filenya)
- Certificates: MySkill Data Analyst Fundamentals (2 sertifikat) & Junior Web Programming (surat keterangan)
- Experience & Volunteering: sertifikat Pencegahan Stunting, Tryout Online SNBT, Fasilkom Goes to School
- Gallery: semua gambar social media, poster, logo, illustration

## Ganti gambar
Semua gambar sekarang masih placeholder dari `placehold.co` (kotak warna + teks).
Cari `<img src="https://placehold.co/...">` di ketiga file HTML, lalu ganti
`src`-nya dengan path gambar asli, misalnya:

```html
<img src="images/roblox-1.jpg" alt="...">
```

Taruh file gambar aslinya di folder `images/`.

## Deploy ke GitHub Pages
1. Buat repository baru di GitHub, misalnya `username.github.io` (atau nama bebas).
2. Upload semua isi folder ini (jangan folder `portfolio`-nya, tapi isinya) ke root repo.
3. Buka **Settings → Pages**, pilih branch `main` dan folder `/root`, lalu Save.
4. Tunggu beberapa menit, website akan aktif di `https://username.github.io/`
   (atau `https://username.github.io/nama-repo/` kalau bukan repo utama).

## Kustomisasi warna
Palet warna ada di `css/style.css` bagian paling atas (`:root`):
`--cream`, `--pink`, `--rose`, `--wine`, `--plum`.
