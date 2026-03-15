import { config } from 'dotenv';
import { resolve } from 'path';

export const NODE_ENV = process.env.NODE_ENV;

config({
  path: resolve(`config/.env.${NODE_ENV}`),
  quiet: true,
});

export const PORT = process.env.PORT || 3000;

export const MONGODB_URI = process.env.MONGODB_URI;

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export const ENCRYPTION_ALGO = process.env.ENCRYPTION_ALGO;

export const USER_ACCESS_SIGNATURE = process.env.USER_ACCESS_SECRET;
export const USER_REFRESH_SIGNATURE = process.env.USER_REFRESH_SECRET;

export const ADMIN_ACCESS_SIGNATURE = process.env.ADMIN_ACCESS_SECRET;
export const ADMIN_REFRESH_SIGNATURE = process.env.ADMIN_REFRESH_SECRET;

export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;

export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
