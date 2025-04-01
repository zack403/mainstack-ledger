import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface IAuditTrail extends Document {
  auditId: string;
  entity: string;
  entityId: string;
  action: string;
  performedBy: string;
  ipAddress: string;
  userAgent?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: Record<string, any>;
  requestId: string;
  timestamp: Date;
}

const AuditTrailSchema = new Schema<IAuditTrail>(
  {
    auditId: {
      type: String,
      required: true,
      unique: true,
      default: () => `aud-${uuidv4()}`,
    },
    entity: { type: String, required: true, index: true },
    entityId: { type: String, required: true, index: true, ref: 'Account' },
    action: {
      type: String,
      required: true,
    },
    performedBy: { type: String, required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String },
    details: { type: Schema.Types.Mixed, default: {} },
    requestId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AuditTrailSchema.index({ entity: 1, entityId: 1, timestamp: -1 });
AuditTrailSchema.index({ requestId: 1 });

export const AuditTrailModel = model<IAuditTrail>('AuditLog', AuditTrailSchema);
