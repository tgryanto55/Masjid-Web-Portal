# Masjid Raya Backend

Backend API untuk portal web Masjid Raya, dibangun dengan Node.js, Express, dan TypeScript. Menggunakan Sequelize sebagai ORM untuk database MySQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL dengan Sequelize ORM
- **Authentication**: JWT (JSON Web Token)
- **Security**: bcryptjs untuk hashing password, Helmet untuk HTTP headers, express-rate-limit untuk rate limiting
- **Performance**: compression (Gzip)
- **Other**: CORS, dotenv, multer (file upload)

## Features

- **Authentication**: Login admin dengan JWT
- **Prayer Times**: Kelola waktu sholat (Support Bulk Update)
- **Events**: Kelola kegiatan masjid
- **Finance**: Kelola transaksi keuangan (income/expense)
- **Donation**: Informasi donasi (bank, QRIS)
- **Contact**: Informasi kontak masjid
- **About**: Informasi profil masjid (Sejarah, Visi, Misi)
- **Auto Seeding**: Data awal (User, Jadwal, Transaksi, dll) otomatis dibuat saat startup
- **Safe Sync**: Sinkronisasi database tanpa menghapus data yang ada

## Setup

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Buat file `.env` di root folder Backend:

   ```
   PORT=5001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=masjid_raya
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=* # Atau http://localhost:5173 untuk production
   ```

3. **Database**:
   - Pastikan MySQL server berjalan
   - Buat database `masjid_raya`
   - Server akan otomatis sync schema dan seed data saat startup

4. **Run Development**:

   ```bash
   npm run dev
   ```

5. **Build Production**:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Public Routes

- `GET /api/prayer-times` - Ambil waktu sholat
- `GET /api/events` - Ambil daftar kegiatan
- `GET /api/finance` - Ambil transaksi keuangan
- `GET /api/donation-info` - Ambil info donasi
- `GET /api/contact-info` - Ambil info kontak
- `GET /api/about` - Ambil info tentang masjid
- `POST /api/auth/login` - Login admin

### Protected Routes (Require JWT Token)

- `PUT /api/auth/profile` - Update profile admin
- `PUT /api/prayer-times/:id` - Update waktu sholat
- `POST /api/events` - Buat kegiatan baru
- `PUT /api/events/:id` - Update kegiatan
- `DELETE /api/events/:id` - Hapus kegiatan
- `POST /api/finance` - Buat transaksi baru
- `DELETE /api/finance/:id` - Hapus transaksi
- `PUT /api/donation-info` - Update info donasi
- `PUT /api/contact-info` - Update info kontak
- `PUT /api/about` - Update info tentang masjid

## Default Admin Account

- Email: admin@masjid.com
- Password: admin123

## Notes

- Server berjalan di port 5001 secara default
- Database sync dilakukan secara otomatis dengan mode safe (tanpa alter)
- Seeding data dilakukan otomatis jika database kosong
- Rate limiting: 1000 request per 15 menit per IP</content>
- **File Upload**: Limit payload 50MB (Base64/Multipart)
- **Static Files**: Gambar diakses via `/uploads`
  <parameter name="filePath">c:\PROJECT_CODINGAN\masjid-raya\Backend\README.md
