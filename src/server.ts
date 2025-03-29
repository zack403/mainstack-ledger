import dotenv from 'dotenv';
import app from './app';
import { config } from './config/env.config';

dotenv.config();

const PORT = config.port || 3000;

const startServer = async () => {
  app.listen(config.port, () => {
      console.log(`Server running on port ${PORT}`);
  });
};
startServer();