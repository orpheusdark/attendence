import mongoose from 'mongoose';
import { createBaseSchema } from './base.model.js';

export interface AttendanceSessionDocument {
  teacherId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  classroomName: string;
  semester?: string;
  batch?: string;
  qrTokenHash: string;
  sessionSecret: string;
  qrExpiresAt: Date;
  startsAt: Date;
  endsAt?: Date;
  status: 'scheduled' | 'active' | 'paused' | 'closed';
  geofenceId?: mongoose.Types.ObjectId;
  beaconId?: mongoose.Types.ObjectId;
  attendanceCount: number;
  confirmedCount: number;
}

const attendanceSessionSchema = createBaseSchema<AttendanceSessionDocument>({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  classroomName: { type: String, required: true, trim: true },
  semester: { type: String },
  batch: { type: String },
  qrTokenHash: { type: String, required: true, index: true },
  sessionSecret: { type: String, required: true },
  qrExpiresAt: { type: Date, required: true, index: true },
  startsAt: { type: Date, required: true, default: Date.now },
  endsAt: { type: Date },
  status: { type: String, default: 'active', enum: ['scheduled', 'active', 'paused', 'closed'], index: true },
  geofenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'GeofenceConfig' },
  beaconId: { type: mongoose.Schema.Types.ObjectId, ref: 'BeaconConfig' },
  attendanceCount: { type: Number, default: 0 },
  confirmedCount: { type: Number, default: 0 }
});

attendanceSessionSchema.index({ teacherId: 1, subjectId: 1, status: 1 });

export const AttendanceSessionModel = mongoose.model<AttendanceSessionDocument>('AttendanceSession', attendanceSessionSchema);