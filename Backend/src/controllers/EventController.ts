import { Request, Response } from 'express';
import { Event } from '../models/Event';

export const getEvents = async (req: any, res: any) => {
  try {
    const events = await Event.findAll({
        order: [['date', 'ASC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

export const createEvent = async (req: any, res: any) => {
  try {
    const { title, date, time, description, image } = req.body;
    
    if (image) {
        console.log(`[CreateEvent] Image received. Length: ${image.length} chars.`);
    }

    const event = await Event.create({
      title,
      date,
      time,
      description,
      image: image || null
    } as any);
    
    res.status(201).json(event);
  } catch (error: any) {
    console.error("❌ CREATE EVENT ERROR:", error);
    
    if (error?.parent?.code === 'ER_NET_PACKET_TOO_LARGE') {
         return res.status(413).json({ 
             message: 'Ukuran gambar terlalu besar. Server menolak request.' 
         });
    }

    res.status(500).json({ 
        message: 'Gagal membuat kegiatan.', 
        error: error.message || 'Internal Server Error' 
    });
  }
};

export const updateEvent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Logging Request Masuk
    console.log(`[UpdateEvent] ID: ${id}`);
    
    const { title, date, time, description, image } = req.body;

    // Pastikan ID valid
    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }

    const event = await Event.findByPk(id);
    if (!event) {
        console.error(`[UpdateEvent] Event with ID ${id} not found.`);
        return res.status(404).json({ message: 'Event not found' });
    }

    // Update Manual Field per Field
    event.title = title;
    event.date = date;
    event.time = time;
    event.description = description;

    // Hanya update image jika dikirim
    if (image !== undefined) {
        console.log(`[UpdateEvent] Updating image for ID ${id}. New length: ${image ? image.length : '0 (Empty)'}`);
        event.image = image;
    }

    // Gunakan save() agar trigger Sequelize berjalan normal
    await event.save();
    
    // Ambil data terbaru dari DB untuk memastikan response benar
    await event.reload();

    console.log(`[UpdateEvent] Success for ID ${id}`);
    res.json(event);
  } catch (error: any) {
    console.error("❌ UPDATE EVENT ERROR:", error);

    if (error?.parent?.code === 'ER_NET_PACKET_TOO_LARGE') {
        return res.status(413).json({ 
            message: 'Ukuran gambar terlalu besar. Server menolak request.' 
        });
    }

    res.status(500).json({ 
        message: 'Gagal update kegiatan.', 
        error: error.message || 'Internal Server Error' 
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

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};