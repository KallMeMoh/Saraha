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

export const JWT_SECRET = process.env.JWT_SECRET;
