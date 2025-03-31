import dotenv from 'dotenv';
import { cleanEnv, str, port, url } from 'envalid';
import logger from '../utils/logger.util';

dotenv.config();

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  PORT: port({ default: 5000, desc: 'Server port number' }),
  MONGO_URI: url({ desc: 'MongoDB connection string' }),
});

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  mongoUri: env.MONGO_URI,
} as const;

logger.info('Environment variables validated successfully');
