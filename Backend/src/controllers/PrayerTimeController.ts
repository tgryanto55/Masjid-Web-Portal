import { Request, Response } from 'express';
import { PrayerTime } from '../models/PrayerTime';

export const getPrayerTimes = async (req: Request, res: Response) => {
  try {
    let prayerTimes = await PrayerTime.findAll();

    // Inisialisasi data default jika belum lengkap
    const requiredNames = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya', 'Jumat', 'Imsak', 'Sahur', 'Berbuka'];
    const existingNames = prayerTimes.map(pt => pt.name);

    let needsRefresh = false;
    for (const name of requiredNames) {
      if (!existingNames.includes(name)) {
        await PrayerTime.create({
          name,
          time: '00:00',
          isActive: !['Jumat', 'Imsak', 'Sahur', 'Berbuka'].includes(name) // Nonaktifkan default untuk tambahan
        });
        needsRefresh = true;
      }
    }

    if (needsRefresh) {
      prayerTimes = await PrayerTime.findAll();
    }

    res.json(prayerTimes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving prayer times', error });
  }
};

export const updatePrayerTime = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { time, isActive } = req.body;

  try {
    const prayerTime = await PrayerTime.findByPk(id);
    if (!prayerTime) {
      return res.status(404).json({ message: 'Prayer time not found' });
    }

    if (time !== undefined) prayerTime.time = time;
    if (isActive !== undefined) prayerTime.isActive = isActive;
    await prayerTime.save();

    res.json(prayerTime);
  } catch (error) {
    res.status(500).json({ message: 'Error updating prayer time', error });
  }
};