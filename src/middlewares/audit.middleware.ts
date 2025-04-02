import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.util';
import { AuditTrailModel } from '../models/audit-trail.model';

export const auditInterceptor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalJson = res.json;
  res.json = function (body) {
    if (res.statusCode < 400) {
      const userId = req.context?.userId || body.data.userId || 'anonymous';
      const entityId =
        (body?.data &&
          Object.keys(body.data).find((key) =>
            key.toLowerCase().endsWith('id')
          ) &&
          body.data[
            Object.keys(body.data).find((key) =>
              key.toLowerCase().endsWith('id')
            )!
          ]) ||
        req.body.entityId ||
        req.params.id ||
        req.params.accountId ||
        userId;
      const pathSegments = req.originalUrl.split('/').filter(Boolean);
      const entity =
        pathSegments[2] === 'auth' ? 'User' : pathSegments[2] || 'Unknown';
      const rawAction = pathSegments[3] || req.method.toLowerCase();
      const action = `${rawAction}_${entity.toLowerCase()}`;

      AuditTrailModel.create({
        entity,
        entityId,
        action,
        performedBy: userId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: body?.data || req.body,
        requestId: req.context?.requestId,
      }).catch((error) => logger.error('Audit log failed', { error }));
    }
    return originalJson.call(this, body);
  };
  next();
};
