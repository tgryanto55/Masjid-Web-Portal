import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

import { PrayerTime } from '../models/PrayerTime';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { AboutInfo } from '../models/AboutInfo';

dotenv.config();

const connection = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,

  models: [PrayerTime, Event, User, AboutInfo],
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default connection;