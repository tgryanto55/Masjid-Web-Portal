import { Request, Response } from 'express';
import { PrayerTime } from '../models/PrayerTime';
import { Event } from '../models/Event';
import { Transaction } from '../models/Transaction';
import { DonationInfo } from '../models/DonationInfo';
import { ContactInfo } from '../models/ContactInfo';
import { AboutInfo } from '../models/AboutInfo';

export const getPublicData = async (req: Request, res: Response) => {
    try {
        const [prayers, events, transactions, donationInfo, contactInfo, aboutInfo] = await Promise.all([
            PrayerTime.findAll({ order: [['time', 'ASC']] }),
            Event.findAll({ limit: 10, order: [['createdAt', 'DESC']] }), // Limit to latest 10
            Transaction.findAll({ limit: 50, order: [['date', 'DESC']] }), // Limit for recent history
            DonationInfo.findOne(),
            ContactInfo.findOne(),
            AboutInfo.findOne(),
        ]);

        res.json({
            prayerTimes: prayers,
            events: events,
            transactions: transactions,
            donationInfo: donationInfo,
            contactInfo: contactInfo,
            about: aboutInfo,
        });
    } catch (error: any) {
        console.error('Error fetching public data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
