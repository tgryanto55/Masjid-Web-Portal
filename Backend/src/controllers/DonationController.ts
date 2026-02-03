import { Request, Response } from 'express';
import { DonationInfo } from '../models/DonationInfo';

export const getDonationInfo = async (req: any, res: any) => {
  try {
    let info = await DonationInfo.findOne();
    if (!info) {
      info = await DonationInfo.create({
          bankName: 'Bank Syariah Indonesia (BSI)',
          accountNumber: '1234 5678 90',
          accountName: 'DKM Masjid Raya',
          confirmationPhone: '+62 812-3456-7890',
          qrisImage: ''
      } as any);
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donation info', error });
  }
};

export const updateDonationInfo = async (req: any, res: any) => {
  try {
    const { bankName, accountNumber, accountName, qrisImage, confirmationPhone } = req.body;
    
    let info = await DonationInfo.findOne();

    if (info) {
      await info.update({
        bankName,
        accountNumber,
        accountName,
        qrisImage: qrisImage || '', // Simpan string langsung
        confirmationPhone
      } as any);
    } else {
      info = await DonationInfo.create({
        bankName,
        accountNumber,
        accountName,
        qrisImage: qrisImage || '', // Simpan string langsung
        confirmationPhone
      } as any);
    }
    
    res.json(info);
  } catch (error: any) {
    console.error("❌ UPDATE DONATION ERROR:", error);

    if (error?.parent?.code === 'ER_NET_PACKET_TOO_LARGE') {
        return res.status(413).json({ 
            message: 'Ukuran gambar QRIS terlalu besar. Mohon kompres gambar.' 
        });
    }

    res.status(500).json({ message: 'Error updating donation info', error });
  }
};