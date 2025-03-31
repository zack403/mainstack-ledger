import dotenv from 'dotenv';
import app from './app';
import { config } from './config/env.config';
import { connectDB } from './config/db.config';

dotenv.config();

const PORT = config.port || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
startServer();
