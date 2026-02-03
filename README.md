# Masjid Raya Portal

Portal web lengkap untuk Masjid Raya, terdiri dari Backend API dan Frontend web application. Sistem ini memungkinkan pengelolaan konten masjid secara digital, termasuk waktu sholat, kegiatan, keuangan, donasi, dan informasi kontak.

## 📋 Deskripsi Proyek

Masjid Raya Portal adalah aplikasi web modern yang dibangun untuk membantu pengelolaan masjid secara efisien. Sistem ini terdiri dari:

- **Backend API**: RESTful API dengan Node.js, Express, dan MySQL untuk mengelola data masjid
- **Frontend Web**: Interface pengguna dengan React dan TailwindCSS untuk publik dan admin

## 🏗️ Arsitektur

```
masjid-raya/
├── Backend/          # API Server (Node.js + Express + MySQL)
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database models (Sequelize)
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication & security
│   │   └── config/         # Database configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── Frontend/         # Web Application (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   └── services/       # API integration
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
└── README.md         # This file
```

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Security**: bcryptjs, Helmet, express-rate-limit

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## ✨ Features

### Publik
- ✅ Halaman Home dengan informasi masjid
- ✅ Waktu Sholat
- ✅ Daftar Kegiatan Masjid
- ✅ Informasi Donasi (Bank & QRIS)
- ✅ Informasi Kontak & Lokasi
- ✅ Responsive Design

### Admin Panel
- 🔐 Authentication dengan JWT
- 📊 Dashboard Overview
- 🕌 Kelola Waktu Sholat
- 📅 Kelola Kegiatan Masjid
- 💰 Kelola Transaksi Keuangan
- 💳 Kelola Informasi Donasi
- 📞 Edit Informasi Kontak
- 📝 Edit Konten Tentang Masjid
- 👤 Pengaturan Profile Admin

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16 atau lebih baru)
- MySQL Server
- npm atau yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd masjid-raya
```

### 2. Setup Backend
```bash
cd Backend
npm install

# Buat file .env
cp .env.example .env
# Edit .env dengan konfigurasi database Anda

# Setup Database
# Buat database MySQL: masjid_raya

# Run Backend
npm run dev
```

### 3. Setup Frontend
```bash
cd ../Frontend
npm install

# Buat file .env (opsional)
echo "VITE_API_BASE_URL=http://localhost:5001/api" > .env

# Run Frontend
npm run dev
```

### 4. Akses Aplikasi
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=masjid_raya
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5001/api
```

## 👤 Default Admin Account

- **Email**: admin@masjid.com
- **Password**: admin123

## 📡 API Endpoints

Lihat dokumentasi lengkap di [Backend/README.md](Backend/README.md)

## 🎨 Development

### Backend
```bash
cd Backend
npm run dev     # Development dengan nodemon
npm run build   # Build untuk production
npm start       # Run production build
```

### Frontend
```bash
cd Frontend
npm run dev     # Development server
npm run build   # Build untuk production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

## 📊 Database Schema

Sistem menggunakan auto-migration Sequelize. Data awal (seeding) akan dibuat otomatis saat pertama kali run.

### Tabel Utama:
- `users` - Data admin
- `prayer_times` - Waktu sholat
- `events` - Kegiatan masjid
- `transactions` - Transaksi keuangan
- `donation_infos` - Info donasi
- `contact_infos` - Info kontak

## 🔒 Security Features

- JWT Authentication
- Password hashing dengan bcryptjs
- Rate limiting (1000 req/15min)
- Helmet untuk HTTP security headers
- CORS configuration
- Input validation

## 📱 Responsive Design

Frontend dirancang responsive untuk desktop, tablet, dan mobile menggunakan TailwindCSS.

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 🤖 AI Assistance

Proyek ini dikembangkan dengan bantuan Google AI Studio (Gemini) untuk membantu dalam coding, debugging, dan optimisasi kode. AI digunakan sebagai alat pendukung development, bukan sebagai pengganti kreativitas dan keputusan developer.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

Untuk pertanyaan atau dukungan, hubungi tim development atau buat issue di repository.</content>
<parameter name="filePath">c:\PROJECT_CODINGAN\masjid-raya\README.md