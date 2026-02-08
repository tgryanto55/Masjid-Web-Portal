# Masjid Raya Backend API

Server-side application yang menangani logika bisnis, komunikasi database (MySQL), autentikasi, dan penyimpanan file untuk Masjid Web Portal. Dibangun menggunakan **Node.js, Express, dan TypeScript**.

## 🛠️ Tech Stack & Features

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL dengan **Sequelize ORM** (Model-based)
- **Authentication**: JWT (JSON Web Token) dengan middleware proteksi route.
- **File Upload**: 
  - **Multer**: Menangani upload file fisik (seperti poster kegiatan) ke folder `src/uploads`.
  - **Base64**: Mendukung penyimpanan gambar kecil (QRIS, Profil) langsung sebagai string base64 di database.
- **Security**: 
  - **Helmet**: Mengamankan HTTP headers.
  - **Rate Limiting**: Mencegah brute-force / DDoS (1000 req/15 min).
  - **Bcrypt**: Hashing password admin.
  - **CORS**: Mengizinkan akses dari domain Frontend tertentu.
- **Performance**: Compression (Gzip) untuk respons API yang lebih cepat.

## 📂 Struktur Folder

```
Backend/
├── dist/                   # Hasil Compile TypeScript (Production Build)
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
│   ├── uploads/            # Folder Statis untuk Gambar Kegiatan
│   ├── index.ts            # Entry Point Aplikasi
│   └── seed.ts             # Data Awal (Seeding)
│   
├── .env                    # Variabel Lingkungan
├── package.json            # Daftar Dependensi
└── tsconfig.json           # Konfigurasi TypeScript
```

## 📡 API Endpoints

Semua endpoint diawali dengan `/api`.

### 🔓 Public Routes (Tanpa Token)

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
Buat file `.env` di root folder Backend:

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=masjid_raya
JWT_SECRET=rahasia_super_aman_123
CORS_ORIGIN=http://localhost:5173
```

### Static Files Serving
Folder `src/uploads` disajikan secara statis. Gambar kegiatan dapat diakses melalui URL:
`http://localhost:5001/uploads/nama-file.jpg`

## 🚀 Script Penting

### Menjalankan Server

#### Development (Hot Reload)
Gunakan mode ini saat mengembangkan aplikasi.
```bash
npm run dev
```

#### Production
Compile TypeScript ke JavaScript terlebih dahulu, lalu jalankan.
```bash
npm run build
npm start
```
**Catatan:** Backend tidak memiliki perintah `npm run preview`. Gunakan `npm start` untuk menjalankan hasil build.

### Database Migration
Database akan otomatis dibuat dan disinkronisasi saat server pertama kali dijalankan (Auto-Migration).
