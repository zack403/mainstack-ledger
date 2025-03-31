import mongoose from 'mongoose';
import { config } from './env.config';
import logger from '../utils/logger.util';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {});
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
