import axios from 'axios';
import type { AnalyticsOverview, ApiUser, AttendanceRecordDto, AttendanceSessionDto, DepartmentComparisonRow, LoginResponse, NotificationDto } from '@attendance/shared';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export const TOKEN_KEY = 'attendance.token';
export const REFRESH_KEY = 'attendance.refresh';

export function getAccessToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function setRefreshToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(REFRESH_KEY, token);
  } else {
    window.localStorage.removeItem(REFRESH_KEY);
  }
}

export const api = axios.create({ baseURL });

api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(payload: { email: string; password: string; deviceId: string }) {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  setAccessToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  return data;
}

export async function getMe() {
  const { data } = await api.get<{ user: ApiUser }>('/auth/me');
  return data.user;
}

export async function getAnalyticsOverview() {
  const { data } = await api.get<AnalyticsOverview>('/analytics/overview');
  return data;
}

export async function getLiveSummary() {
  const { data } = await api.get<{ live: AnalyticsOverview['live'] }>('/analytics/live');
  return data.live;
}

export async function getAttendanceMomentum() {
  const { data } = await api.get<{ data: Array<{ _id: { day: number }; confirmed: number; flagged: number }> }>('/analytics/momentum');
  return data.data;
}

export async function getDepartmentComparison() {
  const { data } = await api.get<{ data: DepartmentComparisonRow[] }>('/analytics/comparison');
  return data.data;
}

export async function getFraudHeatmap() {
  const { data } = await api.get<{ data: Array<{ _id: { reason: string; status: string }; count: number; averageRisk: number }> }>('/analytics/heatmap');
  return data.data;
}

export async function getSessions() {
  const { data } = await api.get<{ items: AttendanceSessionDto[] }>('/attendance/sessions');
  return data.items;
}

export async function getAuditLogs() {
  const { data } = await api.get<{ items: Array<{ _id: string; action: string; entityType: string; severity: string; createdAt: string; metadata: Record<string, unknown> }> }>('/admin/audit-logs');
  return data.items;
}

export async function getHealth() {
  const { data } = await api.get<{ status: string; devices: number; audits: number }>('/admin/health');
  return data;
}

export async function getNotifications() {
  const { data } = await api.get<{ items: NotificationDto[] }>('/notifications');
  return data.items;
}

export async function getCurrentAttendance() {
  const { data } = await api.get<{ items: AttendanceRecordDto[] }>('/attendance/sessions');
  return data.items;
}

export async function startSession(payload: { subjectId: string; classroomName: string; departmentId?: string; semester?: string; batch?: string }) {
  const { data } = await api.post<{ session: AttendanceSessionDto; qr: { token: string; tokenHash: string; payload: Record<string, unknown> } }>('/attendance/sessions', payload);
  return data;
}

export async function scanAttendance(payload: {
  sessionId: string;
  studentId: string;
  deviceId: string;
  deviceFingerprintHash: string;
  ipAddress: string;
  latitude: number;
  longitude: number;
  qrToken: string;
}) {
  const { data } = await api.post<AttendanceRecordDto>('/attendance/scan', payload);
  return data;
}

export async function confirmAttendance(payload: { sessionId: string; studentId: string; reverseToken: string; confirmationMethod: 'reverse-qr' | 'ble' | 'manual' }) {
  const { data } = await api.post<AttendanceRecordDto>('/attendance/confirm', payload);
  return data;
}
