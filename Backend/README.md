# Masjid Raya Backend API

Server-side application yang menangani logika bisnis, komunikasi database (MySQL), autentikasi, dan penyimpanan file untuk Masjid Web Portal. Dibangun menggunakan **Node.js, Express, dan TypeScript**.

## 🛠️ Tech Stack & Features

### [v1.0.2] Highlights
- **Public Data Batching**: Endpoint baru `/api/public-data` untuk efisiensi pengambilan data kolektif.
- **Rate Limit Adjustments**: Peningkatan keamanan dan stabilitas koneksi.
- **Sequelize MySQL**: Manajemen basis data relasional yang handal.
- **Smart Batching**: Menggabungkan beberapa permintaan data publik menjadi satu respons API untuk efisiensi.
- **File Upload**: 
  - **Multer**: Menangani upload file fisik (seperti poster kegiatan) ke folder `public/uploads`.
  - **Base64**: Mendukung penyimpanan gambar kecil (QRIS, Profil) langsung sebagai string base64 di database.
- **Security**: 
  - **Helmet**: Mengamankan HTTP headers.
  - **Rate Limiting**: Mencegah brute-force / DDoS (2000 req/15 min).
  - **Bcrypt**: Hashing password admin.
  - **CORS**: Mengizinkan akses dari domain Frontend tertentu.
- **Performance**: Compression (Gzip) untuk respons API yang lebih cepat.

## 📂 Struktur Folder

```
Backend/
├── dist/                   # Hasil Compile TypeScript (Production Build)
├── public/uploads/            # Folder Statis untuk Gambar Kegiatan
├── src/
│   ├── config/             # Konfigurasi Database (Sequelize)
│   ├── controllers/        # Logika Bisnis (Controller Layer)
│   │   ├── AuthController.ts       # Login, Update Profile
│   │   ├── EventController.ts      # CRUD Kegiatan + Upload Image
│   │   ├── FinanceController.ts    # Transaksi Keuangan
│   │   ├── PrayerTimeController.ts # Jadwal Sholat (Bulk Update)
│   │   └── ...
│   ├── models/             # Definisi Tabel (Model Layer)
│   │   ├── User.ts
│   │   ├── Event.ts
│   │   ├── Transaction.ts
│   │   └── ...
│   ├── routes/             # Definisi Endpoint API
│   ├── middleware/         # Middleware (Auth, Upload, Error Handling)
│   └── index.ts            # Entry Point Aplikasi
├── .env                    # Variabel Lingkungan
├── package.json            # Daftar Dependensi
└── tsconfig.json           # Konfigurasi TypeScript
```

## 📡 API Endpoints

Semua endpoint diawali dengan `/api`.

### 🔓 Public Routes (Tanpa Token)

- `GET /public-data` : **[RECOMMENDED]** Mengambil seluruh data publik (prayers, events, finance, dll) dalam satu batch.
- `GET /prayer-times` : Mengambil daftar waktu sholat.
- `GET /events` : Mengambil daftar kegiatan masjid (termasuk link gambar).
- `GET /finance` : Mengambil data transaksi keuangan.
- `GET /donation-info` : Mengambil info rekening & donasi.
- `GET /contact-info` : Mengambil profil & kontak masjid.
- `GET /about-info` : Mengambil sejarah, visi, dan misi.
- `POST /auth/login` : Login admin (Return: JWT Token).

### 🔒 Protected Routes (Butuh Header `Authorization: Bearer <token>`)

#### Manajemen Waktu Sholat
- `PUT /prayer-times/:id` : Update satu waktu sholat (Jam & Status Aktif/Nonaktif).

#### Manajemen Kegiatan (Multipart Form-Data)
- `POST /events` : Tambah kegiatan baru (+ Upload Gambar).
- `PUT /events/:id` : Update kegiatan (+ Ganti Gambar opsional).
- `DELETE /events/:id` : Hapus kegiatan.

#### Manajemen Keuangan
- `POST /finance` : Tambah transaksi baru (Pemasukan/Pengeluaran).
- `DELETE /finance/:id` : Hapus transaksi.

#### Manajemen Info Masjid
- `PUT /donation-info` : Update info rekening, bank, & QRIS.
- `PUT /contact-info` : Update alamat, telepon & medsos.
- `PUT /about-info` : Update sejarah, visi, misi & foto profil.
- `PUT /auth/profile` : Update email/password admin.

## 💾 Database Schema (Sequelize Models)

Sistem menggunakan **Auto-Migration** (`{ alter: true }` atau `{ force: false }`). Tabel akan otomatis dibuat/diupdate saat server dijalankan.

### Tabel Utama:
1. **Users**: `id, name, email, password`
2. **PrayerTimes**: `id, name, time, isActive`
3. **Events**: `id, title, date, time, description, image (path)`
4. **Transactions**: `id, title, amount, type (income/expense), category, date`
5. **GoalInfos**: (Optional/Future) Info target pembangunan.
6. **DonationInfos**: `bankName, accountNumber, accountName, qrisImage (base64)`
7. **ContactInfos**: `address, phone, email, mapEmbedLink`
8. **AboutInfos**: `history, vision, mission, image (base64)`

## ⚙️ Setup & Konfigurasi

### Environment Variables (.env)
Aplikasi ini membutuhkan file `.env` untuk konfigurasi koneksi database dan keamanan.
1. Copy file `.env.example` menjadi `.env`.
2. Buka `.env` dan sesuaikan nilainya:

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=masjid_raya_db
JWT_SECRET=GANTI_DENGAN_SECRET_YANG_KUAT
```

### Static Files Serving
Folder `public/uploads` disajikan secara statis. Gambar kegiatan dapat diakses melalui URL:
`http://localhost:5001/uploads/nama-file.jpg`

## 🚀 Script Penting

Disarankan untuk menjalankan perintah dari **Root Folder** untuk kemudahan. Namun, jika ingin menjalankan secara terpisah di folder Backend:

#### Development (Hot Reload)
```bash
npm run dev
```

#### Production Build & Start
```bash
npm run build
npm start
```

---
**Catatan:** Untuk instruksi instalasi lengkap secara unified, silakan lihat [Root README](../README.md).
