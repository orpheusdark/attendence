import mongoose from 'mongoose';
import { createBaseSchema } from './base.model.js';

export interface AttendanceRecordDocument {
  sessionId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'flagged' | 'rejected';
  qrPayloadHash: string;
  reversePayloadHash?: string;
  deviceId: string;
  deviceFingerprintHash: string;
  ipAddress: string;
  latitude: number;
  longitude: number;
  geofenceDistanceMeters: number;
  riskScore: number;
  confirmationMethod?: 'reverse-qr' | 'ble' | 'manual';
  confirmedAt?: Date;
  scanAt: Date;
  notes?: string;
}

const attendanceRecordSchema = createBaseSchema<AttendanceRecordDocument>({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true, index: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'flagged', 'rejected'], index: true },
  qrPayloadHash: { type: String, required: true, index: true },
  reversePayloadHash: { type: String },
  deviceId: { type: String, required: true, index: true },
  deviceFingerprintHash: { type: String, required: true, index: true },
  ipAddress: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  geofenceDistanceMeters: { type: Number, required: true },
  riskScore: { type: Number, required: true, default: 0 },
  confirmationMethod: { type: String, enum: ['reverse-qr', 'ble', 'manual'] },
  confirmedAt: { type: Date },
  scanAt: { type: Date, default: Date.now },
  notes: { type: String }
});

attendanceRecordSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

export const AttendanceRecordModel = mongoose.model<AttendanceRecordDocument>('AttendanceRecord', attendanceRecordSchema);