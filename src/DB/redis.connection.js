import { createClient } from 'redis';
import { REDIS_URI } from '../config/index.js';

export const client = createClient({
  url: REDIS_URI,
});

client.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

export const connectRedis = async () => {
  try {
    await client.connect();
    console.log('Successfully connected to Redis');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
