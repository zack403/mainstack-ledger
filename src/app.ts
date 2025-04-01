import 'reflect-metadata';
import express, { Request, Response, Application, NextFunction } from 'express';
import './container';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/env.config';
import logger from './utils/logger.util';
import { AppError, errorHandler } from './middlewares/error-handler.middleware';
import { requestContext } from './middlewares/context.middleware';
import { ResponseUtil } from './utils/response.util';
import router from './routes';
import { auditInterceptor } from './middlewares/audit.middleware';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app: Application = express();

app.use(helmet());
app.use(express.json());
app.use(requestContext);
app.use(auditInterceptor);

// Basic request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info('Request received', { method: req.method, path: req.url });
  next();
});

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

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

app.use('/api/v1', router);

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.warn('No endpoint matches that URL', {
    requestId: req.context?.requestId,
    path: req.path,
  });
  next(new AppError(404, 'Not Found'));
});

app.use(errorHandler);

export default app;
