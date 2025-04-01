import { Request, Response, NextFunction } from 'express';
import { AppError } from './error-handler.middleware';
import { TokenUtil } from '../utils/token.util';
import logger from '../utils/logger.util';

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new AppError(401, 'No token provided');

  try {
    const decoded = TokenUtil.verifyToken(token);
    req.context = {
      requestId: req.context?.requestId ?? 'unknown',
      ...decoded,
    };
    next();
  } catch (error) {
    logger.error('Token validation failed', {
      error,
      requestId: req.context?.requestId,
    });
    throw new AppError(401, 'Invalid or expired token');
  }
};
