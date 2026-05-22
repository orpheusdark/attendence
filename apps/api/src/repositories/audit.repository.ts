import { AuditLogModel, type AuditLogDocument } from '../models/auditLog.model.js';
import { BaseRepository } from './base.repository.js';

class AuditRepository extends BaseRepository<AuditLogDocument> {
  constructor() {
    super(AuditLogModel);
  }
}

export const auditRepository = new AuditRepository();