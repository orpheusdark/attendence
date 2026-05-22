import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuditLogModel } from '../models/auditLog.model.js';
import { DeviceFingerprintModel } from '../models/deviceFingerprint.model.js';

export const auditLogs = asyncHandler(async (_request: Request, response: Response) => {
  const items = await AuditLogModel.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(200);
  response.json({ items });
});

export const systemHealth = asyncHandler(async (_request: Request, response: Response) => {
  const [devices, audits] = await Promise.all([
    DeviceFingerprintModel.countDocuments({ isDeleted: false }),
    AuditLogModel.countDocuments({ isDeleted: false })
  ]);
  response.json({ status: 'ok', devices, audits });
});