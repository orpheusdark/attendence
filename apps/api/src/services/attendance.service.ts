import { AttendanceRecordModel } from '../models/attendanceRecord.model.js';
import { AttendanceSessionModel } from '../models/attendanceSession.model.js';
import { GeofenceConfigModel } from '../models/geofenceConfig.model.js';
import { auditService } from './audit.service.js';
import { fraudService, type FraudSignals } from './fraud.service.js';
import { qrService } from './qr.service.js';
import { haversineDistanceMeters } from '../utils/geofence.js';
import { hashValue } from '../utils/crypto.js';
import { emitSessionEvent } from '../sockets/hub.js';

export class AttendanceService {
  async startSession(input: {
    teacherId: string;
    subjectId: string;
    departmentId?: string;
    classroomName: string;
    semester?: string;
    batch?: string;
  }) {
    const session = await AttendanceSessionModel.create({
      teacherId: input.teacherId,
      subjectId: input.subjectId,
      departmentId: input.departmentId,
      classroomName: input.classroomName,
      semester: input.semester,
      batch: input.batch,
      qrTokenHash: 'pending',
      sessionSecret: hashValue(`${input.teacherId}:${input.subjectId}:${Date.now()}`),
      qrExpiresAt: new Date(Date.now() + 25_000),
      status: 'active',
      attendanceCount: 0,
      confirmedCount: 0
    });

    const qr = qrService.createRollingPayload({
      sessionId: String(session._id),
      teacherId: input.teacherId,
      subjectId: input.subjectId,
      classroomName: input.classroomName
    });

    session.qrTokenHash = qr.tokenHash;
    session.qrExpiresAt = new Date(qr.payload.expiresAt);
    await session.save();

    await auditService.log({
      actorRole: 'teacher',
      action: 'attendance.session.started',
      entityType: 'AttendanceSession',
      entityId: String(session._id),
      metadata: { subjectId: input.subjectId, classroomName: input.classroomName },
      severity: 'medium'
    });

    emitSessionEvent('attendance:session.started', {
      sessionId: String(session._id),
      teacherId: input.teacherId,
      subjectId: input.subjectId,
      classroomName: input.classroomName,
      qrToken: qr.token,
      qrExpiresAt: qr.payload.expiresAt
    });

    return { session, qr };
  }

  async scanAttendance(input: {
    sessionId: string;
    studentId: string;
    deviceId: string;
    deviceFingerprintHash: string;
    ipAddress: string;
    latitude: number;
    longitude: number;
    qrToken: string;
    signals?: FraudSignals;
  }) {
    const session = await AttendanceSessionModel.findById(input.sessionId);
    if (!session || session.status !== 'active') {
      throw new Error('Attendance session is not active');
    }

    const geofence = await GeofenceConfigModel.findById(session.geofenceId);
    const distanceMeters = geofence
      ? haversineDistanceMeters(input.latitude, input.longitude, geofence.latitude, geofence.longitude)
      : 0;

    const geofenceViolation = Boolean(geofence && distanceMeters > geofence.radiusMeters);
    const duplicate = await AttendanceRecordModel.findOne({ sessionId: input.sessionId, studentId: input.studentId, isDeleted: false });
    if (duplicate) {
      throw new Error('Duplicate attendance attempt');
    }

    const riskSignals: FraudSignals = {
      outsideGeofence: geofenceViolation,
      ...input.signals
    };
    const { riskScore } = fraudService.score(riskSignals);
    const status = riskScore >= 80 ? 'flagged' : 'pending';

    const record = await AttendanceRecordModel.create({
      sessionId: input.sessionId,
      studentId: input.studentId,
      status,
      qrPayloadHash: hashValue(input.qrToken),
      deviceId: input.deviceId,
      deviceFingerprintHash: input.deviceFingerprintHash,
      ipAddress: input.ipAddress,
      latitude: input.latitude,
      longitude: input.longitude,
      geofenceDistanceMeters: distanceMeters,
      riskScore,
      scanAt: new Date()
    });

    session.attendanceCount += 1;
    await session.save();

    await auditService.log({
      actorRole: 'student',
      action: 'attendance.scan.created',
      entityType: 'AttendanceRecord',
      entityId: String(record._id),
      metadata: { status, distanceMeters, riskScore },
      severity: status === 'flagged' ? 'high' : 'low'
    });

    emitSessionEvent('attendance:scan.created', {
      sessionId: input.sessionId,
      studentId: input.studentId,
      status,
      riskScore,
      distanceMeters
    });

    return record;
  }

  async confirmAttendance(input: {
    sessionId: string;
    studentId: string;
    reverseToken: string;
    confirmationMethod: 'reverse-qr' | 'ble' | 'manual';
    signals?: FraudSignals;
  }) {
    const record = await AttendanceRecordModel.findOne({ sessionId: input.sessionId, studentId: input.studentId, isDeleted: false });
    if (!record) {
      throw new Error('Attendance record not found');
    }

    const { riskScore } = fraudService.score(input.signals ?? {});
    record.reversePayloadHash = hashValue(input.reverseToken);
    record.confirmationMethod = input.confirmationMethod;
    record.confirmedAt = new Date();
    record.status = riskScore >= 80 ? 'flagged' : 'confirmed';
    record.riskScore = Math.max(record.riskScore, riskScore);
    await record.save();

    const session = await AttendanceSessionModel.findById(input.sessionId);
    if (session) {
      session.confirmedCount += 1;
      await session.save();
    }

    await auditService.log({
      actorRole: 'teacher',
      action: 'attendance.confirmed',
      entityType: 'AttendanceRecord',
      entityId: String(record._id),
      metadata: { confirmationMethod: input.confirmationMethod },
      severity: 'low'
    });

    emitSessionEvent('attendance:confirmed', {
      sessionId: input.sessionId,
      studentId: input.studentId,
      confirmationMethod: input.confirmationMethod,
      status: record.status,
      riskScore: record.riskScore
    });

    return record;
  }
}

export const attendanceService = new AttendanceService();