import { z } from 'zod';

export const startSessionSchema = z.object({
  subjectId: z.string().min(1),
  departmentId: z.string().optional(),
  classroomName: z.string().min(1),
  semester: z.string().optional(),
  batch: z.string().optional()
});

export const scanAttendanceSchema = z.object({
  sessionId: z.string().min(1),
  studentId: z.string().min(1),
  deviceId: z.string().min(6),
  deviceFingerprintHash: z.string().min(1),
  ipAddress: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  qrToken: z.string().min(1)
});

export const confirmAttendanceSchema = z.object({
  sessionId: z.string().min(1),
  studentId: z.string().min(1),
  reverseToken: z.string().min(1),
  confirmationMethod: z.enum(['reverse-qr', 'ble', 'manual'])
});