import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.util';

export const requestContext = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const requestId = uuidv4();
  req.context = { requestId };
  logger.info('Request started', {
    requestId,
    method: req.method,
    path: req.url,
  });
  next();
};
