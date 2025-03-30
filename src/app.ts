import express, { Request, Response, Application, NextFunction } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import './config/env.config';
import logger from './utils/logger.util';
import { errorHandler } from './middlewares/error-handler.middleware';
import { requestContext } from './middlewares/context.middleware';
import { ResponseUtil } from './utils/response.util';

dotenv.config();

const app: Application = express();

app.use(helmet());
app.use(express.json());
app.use(requestContext);

// Basic request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info('Request received', { method: req.method, path: req.url });
  next();
});

app.get('/', (_req: Request, res: Response) => {
  ResponseUtil.success(res, {
    status: 200,
    data: { name: 'Mainstack Ledger API', version: '1.0' },
  });
});
app.get('/health', (_req: Request, res: Response) => {
  ResponseUtil.success(res, {
    status: 200,
    data: { status: 'API is healthy' },
  });
});

app.use((req: Request, res: Response) => {
  logger.warn('No endpoint matches that URL', {
    requestId: req.context?.requestId,
    path: req.path,
  });
  ResponseUtil.error(res, 404, 'Not Found');
});

app.use(errorHandler);

export default app;
