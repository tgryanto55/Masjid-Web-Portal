import "reflect-metadata";
import { DataType } from 'sequelize-typescript';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import connection from './config/database';
import router from './routes';
import { PrayerTime } from './models/PrayerTime';
import { User } from './models/User';
import { Transaction } from './models/Transaction';
import { DonationInfo } from './models/DonationInfo';
import { ContactInfo } from './models/ContactInfo';
import { AboutInfo } from './models/AboutInfo';
import { Event } from './models/Event';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '5001');


app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}) as any);


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Terlalu banyak request dari IP ini, coba lagi nanti.'
});
app.use(limiter as any);

app.use(compression() as any);


app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}) as any);


app.use(express.json({ limit: '50mb' }) as any);
app.use(express.urlencoded({ limit: '50mb', extended: true }) as any);


import path from 'path';

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));


app.use('/api', router);


const seedDatabase = async () => {
  try {

    const countPrayer = await PrayerTime.count();
    if (countPrayer === 0) {
      console.log('🌱 Seeding Prayer Times...');
      await PrayerTime.bulkCreate([
        { name: 'Subuh', time: '04:30' },
        { name: 'Dzuhur', time: '12:00' },
        { name: 'Ashar', time: '15:15' },
        { name: 'Maghrib', time: '18:00' },
        { name: 'Isya', time: '19:15' },
      ]);
    }


    const countUser = await User.count();
    if (countUser === 0) {
      console.log('🌱 Creating Admin User...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await User.create({
        name: 'Admin Pengurus',
        email: 'admin@masjid.com',
        password: hashedPassword
      } as any);
      console.log('👤 Admin created: admin@masjid.com / admin123');
    }


    const countTrans = await Transaction.count();
    if (countTrans === 0) {
      console.log('🌱 Seeding Transactions...');
      await Transaction.bulkCreate([
        { title: 'Infaq Jumat', amount: 2500000, type: 'income', date: new Date().toISOString().split('T')[0], category: 'Infaq' },
        { title: 'Bayar Listrik Bulan Ini', amount: 500000, type: 'expense', date: new Date().toISOString().split('T')[0], category: 'Operasional' },
        { title: 'Sumbangan Hamba Allah', amount: 1000000, type: 'income', date: new Date().toISOString().split('T')[0], category: 'Infaq' },
      ]);
    }


    const countEvent = await Event.count();
    if (countEvent === 0) {
      console.log('🌱 Seeding Events...');
      await Event.create({
        title: 'Kajian Rutin Sabtu',
        date: 'Setiap Sabtu',
        time: '09:00',
        description: 'Kajian rutin membahas tafsir Al-Quran bersama Ustadz Abdullah. Terbuka untuk umum.',
        image: ''
      } as any);
    }


    const countDonation = await DonationInfo.count();
    if (countDonation === 0) {
      console.log('🌱 Seeding Donation Info...');
      await DonationInfo.create({
        bankName: 'Bank Syariah Indonesia (BSI)',
        accountNumber: '1234 5678 90',
        accountName: 'DKM Masjid Raya',
        confirmationPhone: '+62 812-3456-7890',
        qrisImage: ''
      } as any);
    }


    const countContact = await ContactInfo.count();
    if (countContact === 0) {
      console.log('🌱 Seeding Contact Info...');
      await ContactInfo.create({
        address: 'Jl. Ahmad Yani No. 123, Kecamatan Harmoni, Kota Sejahtera, Indonesia 40123',
        phone: '+62 812-3456-7890',
        email: 'info@masjidraya.com',
        operationalHours: 'Senin - Minggu: 08:00 - 20:00 WIB',
        mapEmbedLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.835496667823!2d107.6186413147728!3d-6.910248094998858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e64c5e8866e5%3A0x262469493332b4b!2sMasjid%20Raya%20Bandung!5e0!3m2!1sen!2sid!4v1646274483984!5m2!1sen!2sid',
        facebook: 'https://facebook.com/masjidraya',
        instagram: 'https://instagram.com/masjidraya',
        youtube: 'https://youtube.com/c/masjidraya'
      } as any);
    }


    const countAbout = await AboutInfo.count();
    if (countAbout === 0) {
      console.log('🌱 Seeding About Info...');
      await AboutInfo.create({
        history: 'Masjid Raya didirikan pada tahun 1990 sebagai pusat kegiatan ibadah dan sosial masyarakat setempat.',
        vision: 'Menjadi pusat peradaban Islam yang memakmurkan masjid.',
        mission: 'Menyelenggarakan ibadah sholat berjamaah yang khusyuk.',
        image: ''
      } as any);
    }

  } catch (err) {
    console.error("Seed Error:", err);
  }
};

const startServer = async () => {
  try {

    try {
      await connection.authenticate();


      connection.addModels([PrayerTime, User, Event, Transaction, DonationInfo, ContactInfo, AboutInfo]);

      console.log('✅ Berhasil terhubung ke database MySQL');


      await connection.sync();
      console.log("✅ Database synced (Safe Mode)");


      try {
        const queryInterface = connection.getQueryInterface();
        const tableDesc = await queryInterface.describeTable('prayer_times');
        if (!tableDesc.isActive) {
          await queryInterface.addColumn('prayer_times', 'isActive', {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: true
          });
          console.log("✅ Column 'isActive' added to 'prayer_times' table");
        }
      } catch (migrationError) {
        console.warn("⚠️ Migration warning (isActive column):", migrationError);
      }

      await seedDatabase();
    } catch (dbError) {
      console.error('⚠️ Gagal terhubung ke database. Server tetap berjalan (Offline Mode).', dbError);
    }

    app.listen(port, '0.0.0.0', () => {
      console.log(`[server]: Server berjalan di http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('❌ Gagal memulai server:', error);
  }
};

startServer();