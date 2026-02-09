# Masjid Raya Portal

Portal web modern dan komprehensif untuk Masjid Raya, dirancang untuk memudahkan manajemen operasional masjid dan memberikan informasi real-time kepada jamaah. Sistem ini menggabungkan **Frontend React 19** yang responsif dengan **Backend Node.js/Express** yang kuat.

## 🌟 Fitur Utama

### 🕌 Halaman Publik (Jamaah)
Didesain dengan pendekatan *Glassmorphism* dan *Clean UI* untuk kenyamanan visual jamaah.

- **Jadwal Sholat & Imsakiyah**: 
  - Tampilan waktu sholat 5 waktu + Imsak & Sahur (opsional saat Ramadhan).
  - *Countdown* waktu sholat berikutnya secara real-time.
  - Tanda waktu sholat otomatis aktif sesuai jam sistem.
- **Kegiatan Masjid**:
  - Daftar agenda kegiatan dengan poster visual.
  - Detail kegiatan (waktu, deskripsi, lokasi).
- **Informasi Donasi**:
  - Tampilan rekening bank dengan fitur *One-Click Copy*.
  - Integrasi **QRIS** untuk kemudahan infaq digital.
  - Link otomatis ke WhatsApp admin untuk konfirmasi donasi.
- **Profil & Kontak**:
  - Sejarah, Visi, dan Misi masjid.
  - Peta lokasi terintegrasi (Google Maps Embed).
  - Tautan langsung ke media sosial (Facebook, Instagram, YouTube).

### ⚙️ Admin Panel (Pengurus)
Dashboard admin yang powerful untuk mengelola seluruh konten website.

- **Dashboard Ringkasan**:
  - Statistik saldo kas masjid (Pemasukan vs Pengeluaran).
  - Agenda kegiatan mendatang.
  - Ringkasan jadwal sholat hari ini.
- **Manajemen Keuangan (Finance)**:
  - Pencatatan Pemasukan (Infaq, Hibah, dll) dan Pengeluaran (Operasional, Pembangunan).
  - **Visualisasi Data**: Chart ringkasan keuangan.
  - Tabel riwayat transaksi dengan fitur *Pagination*.
  - Modal keamanan sebelum menghapus data transaksi.
- **Manajemen Kegiatan (Events)**:
  - CRUD (Create, Read, Update, Delete) kegiatan masjid.
  - **Hybrid Image System**: Upload poster kegiatan (disimpan lokal via Multer dengan kompresi otomatis).
- **Manajemen Jadwal Sholat**:
  - **Bulk Edit**: Fitur edit masal untuk mengubah waktu sholat seminggu/sebulan sekaligus dengan cepat.
  - Toggle aktif/nonaktif untuk waktu-waktu opsional (Imsak, Syuruq, Dhuha).
- **Pengaturan Profil Masjid**:
  - Edit Sejarah, Visi, dan Misi dengan editor teks sederhana (Bullet/Numbering support).
  - Upload foto profil masjid (Base64 storage).
- **Kelola Info Donasi & Kontak**:
  - Update nomor rekening, nama bank, dan upload QRIS.
  - Ubah alamat, jam operasional, dan link media sosial.

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4 (Modern utility-first CSS)
- **Routing**: React Router 7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Custom reusable components (Button, Modal, Card)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Sequelize (dengan TypeScript support)
- **Authentication**: JWT (JSON Web Token)
- **File Handling**: 
  - **Multer**: Untuk upload file fisik (Poster Kegiatan).
  - **Base64**: Untuk gambar kecil/icon (QRIS, Foto Profil).
- **Security**: Helmet, Rate Limiting, CORS, BCrypt.

## 📂 Struktur Proyek

```
Masjid-Web-Portal/
├── Backend/                 # Server-side Application
│   ├── src/
│   │   ├── controllers/     # Logika bisnis (Finance, Event, PrayerTime, dll)
│   │   ├── models/          # Definisi Tabel Database (Sequelize)
│   │   ├── routes/          # API Endpoints
│   │   ├── middleware/      # Auth & File Upload Middleware
│   │   └── uploads/         # Folder penyimpanan gambar fisik
│   ├── dist/                # [NEW] Hasil Build Backend (run `npm start` from here)
│   ├── public/              # File statis
│   └── ...
├── Frontend/                # Client-side Application
│   ├── dist/                # [NEW] Hasil Build Frontend (Static Assets)
│   ├── src/
│   │   ├── components/      # Komponen UI (Layout, Navbar, Cards)
│   │   ├── pages/           # Halaman (Admin & Public)
│   │   ├── context/         # Global State (Auth, App Data)
│   │   └── services/        # API Integration logic
│   └── ...
└── README.md                # Dokumentasi Proyek
```

## 🚀 Cara Menjalankan

### Persyaratan Sistem
## 🚀 Cara Menjalankan (Unified)

Project ini menduduki struktur monorepo sederhana yang mendukung eksekusi serentak dari root folder.

### 1. Persiapan Environment
Penting untuk mengatur variabel lingkungan sebelum menjalankan aplikasi.
- Copy file `Backend/.env.example` menjadi `Backend/.env`.
- Sesuaikan konfigurasi database (Host, User, Password, DB Name) di dalam `Backend/.env`.

### 2. Install Semua Dependencies
Jalankan perintah ini di root folder:
```bash
npm install
npm run install-all
```

### 3. Development Mode
Menjalankan Frontend dan Backend secara bersamaan dengan fitur *Hot Reload*:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001`

### 4. Build & Production Preview
Build semua project untuk produksi:
```bash
npm run build
```

Jalankan semua project dari hasil build:
```bash
npm start
```

---

## 🛠️ Setup Manual (Alternative)
Jika ingin menjalankan secara terpisah:

### Backend
```bash
cd Backend
npm install
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## 👤 Akun Demo Default
- **Email**: `admin@masjid.com`
- **Password**: `admin123`

## ✨ Development Approach
Proyek ini dibangun dengan pendekatan **AI-First Development** menggunakan **Google Antigravity**. Dokumentasi ini diperbarui secara berkala untuk mencerminkan perkembangan fitur terbaru.

---

## 🤝 Kontribusi
Silakan fork repository ini dan buat Pull Request. Pastikan untuk memperbarui dokumentasi jika ada perubahan signifikan pada struktur database atau API.

## 📄 Lisensi
MIT License
