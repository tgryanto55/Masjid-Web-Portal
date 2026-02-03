import { Request, Response } from 'express';
import { ContactInfo } from '../models/ContactInfo';

export const getContactInfo = async (req: any, res: any) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) {
      return res.status(404).json({ message: 'Contact info not found' });
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact info', error });
  }
};

export const updateContactInfo = async (req: any, res: any) => {
  try {
    const { address, mapEmbedLink, phone, email, operationalHours, facebook, instagram, youtube } = req.body;
    
    let info = await ContactInfo.findOne();

    if (info) {
      await info.update({
        address,
        mapEmbedLink,
        phone,
        email,
        operationalHours,
        facebook,
        instagram,
        youtube
      });
    } else {
      info = await ContactInfo.create({
        address,
        mapEmbedLink,
        phone,
        email,
        operationalHours,
        facebook,
        instagram,
        youtube
      });
    }

    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact info', error });
  }
};