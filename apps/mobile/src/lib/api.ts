import axios from 'axios';
import type { AnalyticsOverview, ApiUser, AttendanceRecordDto, AttendanceSessionDto, LiveSummary, LoginResponse, NotificationDto } from '@attendance/shared';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

let token: string | null = null;

export function setToken(value: string | null) {
  token = value;
}

export function getToken() {
  return token;
}

const client = axios.create({ baseURL });

client.interceptors.request.use(config => {
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(payload: { email: string; password: string; deviceId: string }) {
  const { data } = await client.post<LoginResponse>('/auth/login', payload);
  token = data.accessToken;
  return data;
}

export async function getMe() {
  const { data } = await client.get<{ user: ApiUser }>('/auth/me');
  return data.user;
}

export async function getOverview() {
  const { data } = await client.get<AnalyticsOverview>('/analytics/overview');
  return data;
}

export async function getLiveSummary() {
  const { data } = await client.get<{ live: LiveSummary }>('/analytics/live');
  return data.live;
}

export async function getSessions() {
  const { data } = await client.get<{ items: AttendanceSessionDto[] }>('/attendance/sessions');
  return data.items;
}

export async function getNotifications() {
  const { data } = await client.get<{ items: NotificationDto[] }>('/notifications');
  return data.items;
}

export async function getAttendanceHistory() {
  const { data } = await client.get<{ items: AttendanceRecordDto[] }>('/attendance/sessions');
  return data.items;
}
