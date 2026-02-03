import { Request, Response } from 'express';
import { PrayerTime } from '../models/PrayerTime';

export const getPrayerTimes = async (req: Request, res: Response) => {
  try {
    const prayerTimes = await PrayerTime.findAll();
    res.json(prayerTimes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving prayer times', error });
  }
};

export const updatePrayerTime = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { time } = req.body;
  
  try {
    const prayerTime = await PrayerTime.findByPk(id);
    if (!prayerTime) {
      return res.status(404).json({ message: 'Prayer time not found' });
    }

    prayerTime.time = time;
    await prayerTime.save();
    
    res.json(prayerTime);
  } catch (error) {
    res.status(500).json({ message: 'Error updating prayer time', error });
  }
};