import { Request, Response } from 'express';
import { AboutInfo } from '../models/AboutInfo';

export const getAbout = async (req: any, res: any) => {
    try {
        const about = await AboutInfo.findOne();

        if (!about) {
            return res.status(404).json({ message: 'About info not found' });
        }

        res.json(about);
    } catch (error) {
        console.error("❌ GET ABOUT ERROR:", error);
        res.status(500).json({ message: 'Error fetching about info' });
    }
};

export const updateAbout = async (req: any, res: any) => {
    try {
        const { history, vision, mission, image } = req.body;

        let about = await AboutInfo.findOne();

        if (!about) {
            // Create if doesn't exist
            about = await AboutInfo.create({
                history,
                vision,
                mission,
                image: image || ''
            } as any);
        } else {
            // Update existing
            about.history = history;
            about.vision = vision;
            about.mission = mission;

            if (image) {
                about.image = image;
            }

            await about.save();
        }

        res.json(about);
    } catch (error: any) {
        console.error("❌ UPDATE ABOUT ERROR:", error);
        res.status(500).json({ message: 'Error updating about info' });
    }
};
