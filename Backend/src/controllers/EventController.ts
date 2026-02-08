import { Request, Response } from 'express';
import { Event } from '../models/Event';

export const getEvents = async (req: any, res: any) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'ASC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const createEvent = async (req: any, res: any) => {
  try {
    const { title, date, time, description, image } = req.body;
    let imagePath = image || null;

    if (req.file) {
      // Simpan path relatif agar bisa diakses frontend
      imagePath = '/uploads/' + req.file.filename;
    }

    const event = await Event.create({
      title,
      date,
      time,
      description,
      image: imagePath
    } as any);

    res.status(201).json(event);
  } catch (error: any) {
    console.error("❌ CREATE EVENT ERROR:", error);
    res.status(500).json({
      message: 'Gagal membuat kegiatan.'
    });
  }
};

export const updateEvent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, date, time, description, image } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.title = title;
    event.date = date;
    event.time = time;
    event.description = description;

    // Hanya update image jika ada file baru diupload atau base64 string dikirim
    if (req.file) {
      // TODO: (Optional) Hapus file lama jika ada
      event.image = '/uploads/' + req.file.filename;
    } else if (image) {
      event.image = image;
    }

    await event.save();
    await event.reload();

    res.json(event);
  } catch (error: any) {
    console.error("❌ UPDATE EVENT ERROR:", error);
    res.status(500).json({
      message: 'Gagal update kegiatan.'
    });
  }
};

export const deleteEvent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

  } catch (error) {
    console.error("❌ DELETE EVENT ERROR:", error);
    res.status(500).json({ message: 'Error deleting event' });
  }
};