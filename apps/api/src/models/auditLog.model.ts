import mongoose from 'mongoose';
import { createBaseSchema } from './base.model.js';

export interface AuditLogDocument {
  actorId?: mongoose.Types.ObjectId;
  actorRole?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata: Record<string, unknown>;
  ipAddress?: string;
  deviceId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const auditLogSchema = createBaseSchema<AuditLogDocument>({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorRole: { type: String },
  action: { type: String, required: true, index: true },
  entityType: { type: String, required: true, index: true },
  entityId: { type: String, index: true },
  metadata: { type: Object, default: {} },
  ipAddress: { type: String },
  deviceId: { type: String },
  severity: { type: String, default: 'low', enum: ['low', 'medium', 'high', 'critical'] }
});

auditLogSchema.index({ createdAt: -1 });

export const AuditLogModel = mongoose.model<AuditLogDocument>('AuditLog', auditLogSchema);