import { connect } from 'mongoose';
import { MONGODB_URI } from '../../config/config.service.js';

export const connectDB = async () => {
  try {
    await connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
