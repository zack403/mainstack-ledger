import mongoose from 'mongoose';
import { config } from './env.config';
import logger from '../utils/logger.util';

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
