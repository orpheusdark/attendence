import mongoose from 'mongoose';
import { createBaseSchema } from './base.model.js';

export interface DeviceFingerprintDocument {
  userId: mongoose.Types.ObjectId;
  deviceId: string;
  osVersion?: string;
  appVersion?: string;
  ipAddress: string;
  userAgent?: string;
  fingerprintHash: string;
  lastSeenAt: Date;
  riskScore: number;
  isTrusted: boolean;
}

const deviceFingerprintSchema = createBaseSchema<DeviceFingerprintDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  deviceId: { type: String, required: true, index: true },
  osVersion: { type: String },
  appVersion: { type: String },
  ipAddress: { type: String, required: true },
  userAgent: { type: String },
  fingerprintHash: { type: String, required: true, unique: true, index: true },
  lastSeenAt: { type: Date, default: Date.now },
  riskScore: { type: Number, default: 0 },
  isTrusted: { type: Boolean, default: false }
});

deviceFingerprintSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

export const DeviceFingerprintModel = mongoose.model<DeviceFingerprintDocument>('DeviceFingerprint', deviceFingerprintSchema);