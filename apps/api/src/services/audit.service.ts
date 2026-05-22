import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import { auditRepository } from '../repositories/audit.repository.js';

export interface AuditEntry {
  actorId?: ObjectId;
  actorRole?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  deviceId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export class AuditService {
  async log(entry: AuditEntry) {
    const document: Record<string, unknown> = {
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      metadata: entry.metadata ?? {},
      severity: entry.severity ?? 'low',
      actorRole: entry.actorRole,
      ipAddress: entry.ipAddress,
      deviceId: entry.deviceId
    };

    if (entry.actorId) {
      document.actorId = entry.actorId as unknown as mongoose.Types.ObjectId;
    }

    return auditRepository.create(document);
  }
}

export const auditService = new AuditService();