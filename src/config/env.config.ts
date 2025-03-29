import dotenv from 'dotenv';
import { cleanEnv, str, port } from 'envalid'


dotenv.config();

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
  PORT: port({ default: 5000, desc: 'Server port number' })
});

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT
} as const;

console.log('Environment variables validated successfully');