import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/index.js';

mongoose.connection.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
