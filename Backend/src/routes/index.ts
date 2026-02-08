import { Router } from 'express';
import { getPrayerTimes, updatePrayerTime } from '../controllers/PrayerTimeController';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/EventController';
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/FinanceController';
import { getDonationInfo, updateDonationInfo } from '../controllers/DonationController';
import { getContactInfo, updateContactInfo } from '../controllers/ContactController';
import { getAbout, updateAbout } from '../controllers/AboutController';
import { login, updateProfile } from '../controllers/AuthController';
import { verifyToken } from '../middleware/auth';
import { upload } from '../middleware/multer';

const router = Router();


router.get('/prayer-times', getPrayerTimes);
router.get('/events', getEvents);
router.get('/finance', getTransactions);
router.get('/donation-info', getDonationInfo);
router.get('/contact-info', getContactInfo);
router.get('/about-info', getAbout);
router.post('/auth/login', login as any);


router.put('/auth/profile', verifyToken, updateProfile);

router.put('/prayer-times/:id', verifyToken, updatePrayerTime);


router.post('/events', verifyToken, upload.single('image'), createEvent);
router.put('/events/:id', verifyToken, upload.single('image'), updateEvent);
router.delete('/events/:id', verifyToken, deleteEvent);

router.post('/finance', verifyToken, createTransaction);
router.delete('/finance/:id', verifyToken, deleteTransaction);

router.put('/donation-info', verifyToken, updateDonationInfo);
router.put('/contact-info', verifyToken, updateContactInfo);
router.put('/about-info', verifyToken, updateAbout);

export default router;