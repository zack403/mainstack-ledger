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
  JWT_EXPIRES_IN: str({ default: '5h' }),
  JWT_PRIVATE_KEY: str({}),
  JWT_PUBLIC_KEY: str({}),
});

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  mongoUri: env.MONGO_URI,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  privateKey: env.JWT_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  publicKey: env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n'),
} as const;

logger.info('Environment variables validated successfully');
