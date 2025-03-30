import { Request, Response } from 'express';
import logger from '../utils/logger.util';
import { ResponseUtil } from '../utils/response.util';

export class AppError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.status = status;
    this.name = 'AppError';
    Error.captureStackTrace?.(this, AppError);
  }
}

export const errorHandler = (err: Error, req: Request, res: Response) => {
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.status} - ${err.message}`, {
      path: req.path,
      method: req.method,
    });
    ResponseUtil.error(res, err.status, err.message);
  } else {
    logger.error('Unexpected error', {
      ...req.context,
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
    ResponseUtil.error(res, 500, 'Internal Server Error');
  }
};
