# Masjid Raya Frontend Framework

Dokumentasi lengkap untuk sisi Frontend aplikasi Masjid Web Portal. Aplikasi ini dibangun dengan teknologi modern untuk memastikan performa tinggi, aksesibilitas, dan kemudahan penggunaan baik untuk jamaah maupun admin.

## 🛠️ Tech Stack & Libraries

- **Core**: React 19 (Versi terbaru dengan peningkatan performa rendering)
- **Build Tool**: Vite (Lightning fast HMR & Build)
- **Language**: TypeScript (Type safety & Developer experience)
- **Styling**: Tailwind CSS 4 (Utility-first CSS framework)
- **Routing**: React Router 7 (Manajemen navigasi client-side)
- **State Management**: React Context API (`AppContext`, `AuthContext`)
- **HTTP Client**: Axios (Komunikasi dengan Backend API)
- **Icons**: Lucide React (Koleksi icon modern & ringan)
- **Linting**: ESLint (Menjaga kualitas kode)

## 📂 Struktur Folder

```
Frontend/
├── public/                 # Aset statis (favicon, manifest, robots.txt)
├── src/
│   ├── components/         
│   │   ├── Layouts/        # Layout utama (PublicLayout, AdminLayout)
│   │   └── UI/             # Komponen reusable (Button, Modal, Card, Input)
│   ├── context/            # Global State Managers
│   │   ├── AppContext.tsx  # Data aplikasi (Events, PrayerTimes, Finance)
│   │   └── AuthContext.tsx # Autentikasi Admin (Login, Logout, Token)
│   ├── pages/
│   │   ├── admin/          # Halaman Dashboard & Manajemen (Protected)
│   │   └── public/         # Halaman untuk Jamaah (Open Access)
│   ├── services/           # Logika API (AuthService, EventService, dll)
│   ├── utils/              # Fungsi bantuan (Format tanggal, Rupiah, dll)
│   ├── types.tsx           # Definisi tipe TypeScript
│   ├── App.tsx             # Entry point & Route definitions
│   └── main.tsx            # Rendering root react
├── dist/                   # Hasil Build Produksi (Static Files)
├── package.json            # Daftar dependensi
└── vite.config.ts          # Konfigurasi Vite
```

## 🌟 Fitur Halaman

### 🕌 Halaman Publik (Public Pages)

Semua halaman publik dirancang dengan gaya *Glassmorphism*, responsif penuh, dan ramah pengguna.

1. **Beranda (Home)**
   - **Hero Section**: Sambutan visual dengan latar belakang animasi halus.
   - **Jadwal Sholat**: Widget waktu sholat hari ini dengan *highlight* sholat berikutnya.
   - **Countdown**: Hitung mundur otomatis menuju waktu adzan selanjutnya.

2. **Kegiatan (Events)**
   - **Daftar Agenda**: Menampilkan kartu kegiatan masjid yang akan datang.
   - **Filter**: (Opsional) Filter berdasarkan kategori kegiatan.
   - **Detail Modal**: Klik kartu untuk melihat detail lengkap + poster besar.

3. **Donasi (Donation)**
   - **Info Rekening**: Menampilkan Bank, No. Rekening, dan Atas Nama.
   - **Copy to Clipboard**: Salin nomor rekening dengan satu klik.
   - **QRIS**: Tampilan QR Code untuk scan donasi via E-Wallet.
   - **Konfirmasi**: Tombol langsung ke WhatsApp admin untuk konfirmasi transfer.

4. **Kontak (Contact)**
   - **Info Kontak**: Alamat, Telepon, Email, dan Jam Operasional.
   - **Peta Lokasi**: Embed Google Maps interaktif.
   - **Media Sosial**: Tautan ke Facebook, Instagram, YouTube.

### ⚙️ Halaman Admin (Admin Pages) (Protected)

Halaman ini hanya bisa diakses setelah login. Dilengkapi dengan *Sidebar Navigation* yang responsif.

1. **Dashboard**
   - Ringkasan cepat: Saldo Kas, Jumlah Kegiatan, Waktu Sholat.
   - Grafik/Visualisasi data keuangan sederhana.

2. **Keuangan (Manage Finance)**
   - **Pencatatan**: Input Pemasukan & Pengeluaran dengan kategori.
   - **Tabel Riwayat**: Daftar transaksi dengan fitur *Pagination*.
   - **Ringkasan**: Kartu total pemasukan, pengeluaran, dan saldo akhir.
   - **Keamanan**: Modal konfirmasi sebelum menghapus data transaksi.

3. **Kegiatan (Manage Events)**
   - **CRUD**: Tambah, Edit, Hapus kegiatan.
   - **Upload Poster**: Mendukung upload gambar (file fisik) dengan kompresi otomatis di sisi server (via backend).
   - **Preview**: Lihat preview gambar sebelum disimpan.

4. **Jadwal Sholat (Manage Prayer Times)**
   - **Bulk Edit**: Mode edit masal untuk mengubah banyak waktu sekaligus tanpa refresh.
   - **Custom Times**: Aktifkan/Nonaktifkan waktu opsional seperti Imsak atau Dhuha.

5. **Info Masjid (Edit Profile & Contact)**
   - **Identitas**: Ubah nama masjid, deskripsi, sejarah.
   - **Visi Misi**: Editor teks dengan dukungan *bullet points* dan *numbering*.


## 🚀 Pengembangan (Scripts)

Disarankan untuk menjalankan perintah dari **Root Folder** untuk kemudahan (Fullstack). Namun, jika ingin menjalankan secara terpisah di folder Frontend:

### Menjalankan Development (HMR)
```bash
npm run dev
```

### Build untuk Produksi
```bash
npm run build
```

### Linting & Kualitas Kode
```bash
npm run lint
```

---
**Catatan:** Untuk instruksi instalasi lengkap secara unified, silakan lihat [Root README](../README.md).

## 🎨 Theme Configuration

Konfigurasi warna dan font diatur dalam `src/index.css` (Tailwind CSS v4). Tema utama menggunakan palet **Emerald** untuk nuansa Islami yang segar dan tenang.
