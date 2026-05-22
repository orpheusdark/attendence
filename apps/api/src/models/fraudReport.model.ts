import mongoose from 'mongoose';
import { createBaseSchema } from './base.model.js';

export interface FraudReportDocument {
  sessionId: mongoose.Types.ObjectId;
  attendanceRecordId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  reason: string;
  riskScore: number;
  signals: Record<string, number>;
  status: 'open' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: mongoose.Types.ObjectId;
}

const fraudReportSchema = createBaseSchema<FraudReportDocument>({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true, index: true },
  attendanceRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceRecord' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reason: { type: String, required: true },
  riskScore: { type: Number, required: true },
  signals: { type: Object, default: {} },
  status: { type: String, default: 'open', enum: ['open', 'reviewed', 'resolved', 'dismissed'], index: true },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const FraudReportModel = mongoose.model<FraudReportDocument>('FraudReport', fraudReportSchema);