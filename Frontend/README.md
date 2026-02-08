# Masjid Raya Frontend

Frontend web portal untuk Masjid Raya, dibangun dengan React, Vite, dan TailwindCSS. Menyediakan interface publik dan admin untuk mengelola konten masjid.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Linting**: ESLint

## Features

### Public Pages

- **Home**: Halaman utama dengan informasi masjid
- **Offline Mode**: Dukungan akses saat server offline (Data Cadangan)
- **Real-time**: Auto-refresh data (Polling setiap 5 detik)
- **About**: Tentang masjid
- **Events**: Daftar kegiatan masjid
- **Donation**: Informasi donasi dan cara berdonasi
- **Contact**: Informasi kontak dan lokasi masjid

### Admin Pages

- **Dashboard**: Overview admin & Ringkasan Keuangan
- **Login**: Autentikasi admin
- **Manage Prayer Times**: Kelola waktu sholat (Support Bulk Edit)
- **Manage Events**: Kelola kegiatan masjid
- **Manage Finance**: Kelola transaksi keuangan
- **Manage Donation**: Kelola informasi donasi
- **Edit Contact**: Edit informasi kontak
- **Edit About**: Edit konten tentang masjid
- **Profile Settings**: Pengaturan profile admin

## Setup

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Buat file `.env` di root folder Frontend (opsional):

   ```
   VITE_API_BASE_URL=http://localhost:5001/api
   ```

3. **Run Development**:

   ```bash
   npm run dev
   ```

4. **Build Production**:

   ```bash
   npm run build
   npm run preview
   ```

5. **Linting**:
   ```bash
   npm run lint
   ```

## Project Structure

```
Frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Layouts/        # Layout components (Public/Admin)
│   │   └── UI/             # UI components (Button, etc.)
│   ├── context/            # React contexts (App, Auth)
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   └── public/         # Public pages
│   ├── services/           # API services
│   ├── types.tsx           # TypeScript types
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.js      # TailwindCSS configuration
```

## API Integration

Frontend terintegrasi dengan Backend API melalui Axios. Base URL dapat dikonfigurasi via environment variable `VITE_API_BASE_URL`.

## Authentication

Admin authentication menggunakan JWT token yang disimpan di localStorage. Context `AuthContext` mengelola state authentication di seluruh aplikasi.

## Styling

Menggunakan TailwindCSS untuk styling. Konfigurasi tersedia di `tailwind.config.js`.

## Development Notes

- Hot reload aktif selama development
- TypeScript strict mode enabled
- ESLint untuk code quality
- Responsive design dengan TailwindCSS
