import { AppError } from './error-handler.middleware';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: z.ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.reduce(
        (acc, e) => {
          const path = e.path.length > 0 ? e.path.join('.') : 'unknown';
          acc[path] = e.message;
          return acc;
        },
        {} as Record<string, string>
      );
      return next(new AppError(422, 'Validation failed', { errors }));
    }
    req.body = result.data;
    next();
  };
