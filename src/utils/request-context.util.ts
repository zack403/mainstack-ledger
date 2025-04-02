import { Request } from 'express';
import { AppError } from '../middlewares/error-handler.middleware';

export function extractRequestContext(req: Request): {
  userId: string;
  requestId: string;
  idempotencyKey: string;
} {
  const userId = req.context?.userId as string;
  const requestId = req.context?.requestId as string;
  const idempotencyKey = req.headers['x-idempotency-key'] as string;
  if (!idempotencyKey)
    throw new AppError(400, 'Missing x-idempotency-key header');
  return { userId, requestId, idempotencyKey };
}
