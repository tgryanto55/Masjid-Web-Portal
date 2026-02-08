import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: any, res: any, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET) as any;
    req.userId = verified.id;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};