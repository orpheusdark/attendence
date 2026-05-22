import { AttendanceRecordModel, type AttendanceRecordDocument } from '../models/attendanceRecord.model.js';
import { AttendanceSessionModel, type AttendanceSessionDocument } from '../models/attendanceSession.model.js';
import { BaseRepository } from './base.repository.js';

class AttendanceSessionRepository extends BaseRepository<AttendanceSessionDocument> {
  constructor() {
    super(AttendanceSessionModel);
  }
}

class AttendanceRecordRepository extends BaseRepository<AttendanceRecordDocument> {
  constructor() {
    super(AttendanceRecordModel);
  }

  findBySessionAndStudent(sessionId: string, studentId: string) {
    return this.model.findOne({ sessionId, studentId, isDeleted: false });
  }
}

export const attendanceSessionRepository = new AttendanceSessionRepository();
export const attendanceRecordRepository = new AttendanceRecordRepository();