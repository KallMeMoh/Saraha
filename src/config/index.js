import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '../..');

config({
  path: join(ROOT_DIR, `.env`),
  quiet: true,
});

const getRequiredEnvVar = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing ${key} environment variable`);
  return value;
};

export const NODE_ENV = getRequiredEnvVar('NODE_ENV');

export const PORT = process.env['PORT'] || 3000;

export const MONGODB_URI = getRequiredEnvVar('MONGODB_URI');

export const SALT_ROUNDS = parseInt(getRequiredEnvVar('SALT_ROUNDS')) || 10;

export const ENCRYPTION_KEY = getRequiredEnvVar('ENCRYPTION_KEY');
export const ENCRYPTION_ALGO = getRequiredEnvVar('ENCRYPTION_ALGO');

export const USER_ACCESS_SIGNATURE = getRequiredEnvVar('USER_ACCESS_SECRET');
export const USER_REFRESH_SIGNATURE = getRequiredEnvVar('USER_REFRESH_SECRET');

export const ADMIN_ACCESS_SIGNATURE = getRequiredEnvVar('ADMIN_ACCESS_SECRET');
export const ADMIN_REFRESH_SIGNATURE = getRequiredEnvVar(
  'ADMIN_REFRESH_SECRET',
);

export const SMTP_USER = getRequiredEnvVar('SMTP_USER');
export const SMTP_PASS = getRequiredEnvVar('SMTP_PASS');

export const CLIENT_ID = getRequiredEnvVar('CLIENT_ID');
// export const CLIENT_SECRET = getRequiredEnvVar('CLIENT_SECRET');
