import { z } from 'zod';

export const roles = ['student', 'teacher', 'hod', 'admin'] as const;
export type Role = (typeof roles)[number];

export const attendanceStatusValues = ['pending', 'confirmed', 'flagged', 'rejected'] as const;
export type AttendanceStatus = (typeof attendanceStatusValues)[number];

export const sessionStatusValues = ['scheduled', 'active', 'paused', 'closed'] as const;
export type SessionStatus = (typeof sessionStatusValues)[number];

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  departmentId?: string;
  studentId?: string;
  employeeId?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface LiveSummary {
  activeSessions: number;
  confirmed: number;
  flagged: number;
  openFraud: number;
}

export interface AttendanceMetricPoint {
  label: string;
  confirmed: number;
  flagged: number;
}

export interface FraudMetricPoint {
  reason: string;
  count: number;
  averageRisk: number;
}

export interface DepartmentComparisonRow {
  departmentId?: string;
  sessions: number;
  attendanceCount: number;
  confirmedCount: number;
  confirmedRate: number;
}

export interface AnalyticsOverview {
  attendance: Array<{ _id: string; total: number }>;
  fraud: Array<{ _id: string; count: number; averageRisk: number }>;
  live: LiveSummary;
}

export interface LoginResponse {
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
}

export interface AttendanceSessionDto {
  _id: string;
  classroomName: string;
  status: SessionStatus;
  subjectId: string;
  teacherId: string;
  qrExpiresAt: string;
  attendanceCount: number;
  confirmedCount: number;
}

export interface AttendanceRecordDto {
  _id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  riskScore: number;
  confirmationMethod?: 'reverse-qr' | 'ble' | 'manual';
  scanAt: string;
  confirmedAt?: string;
}

export interface NotificationDto {
  _id: string;
  title: string;
  body: string;
  type: 'attendance' | 'fraud' | 'system' | 'announcement';
  createdAt: string;
  readAt?: string;
}

export interface SessionEventPayload {
  sessionId: string;
  [key: string]: unknown;
}
