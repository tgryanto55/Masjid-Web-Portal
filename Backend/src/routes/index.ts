import { Router } from 'express';
import { getPrayerTimes, updatePrayerTime } from '../controllers/PrayerTimeController';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/EventController';
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/FinanceController';
import { getDonationInfo, updateDonationInfo } from '../controllers/DonationController';
import { getContactInfo, updateContactInfo } from '../controllers/ContactController';
import { login, updateProfile } from '../controllers/AuthController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// === PUBLIC ROUTES (Bisa diakses siapa saja) ===
router.get('/prayer-times', getPrayerTimes);
router.get('/events', getEvents);
router.get('/finance', getTransactions); 
router.get('/donation-info', getDonationInfo);
router.get('/contact-info', getContactInfo); // New Route
router.post('/auth/login', login as any);

// === PROTECTED ROUTES (Harus Login / Punya Token) ===
router.put('/auth/profile', verifyToken, updateProfile);

router.put('/prayer-times/:id', verifyToken, updatePrayerTime);

// Event Routes
router.post('/events', verifyToken, createEvent);
router.put('/events/:id', verifyToken, updateEvent); // Update Event Route
router.delete('/events/:id', verifyToken, deleteEvent);

router.post('/finance', verifyToken, createTransaction);
router.delete('/finance/:id', verifyToken, deleteTransaction);

router.put('/donation-info', verifyToken, updateDonationInfo);
router.put('/contact-info', verifyToken, updateContactInfo); // New Route

export default router;