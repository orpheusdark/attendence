import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';
export const TOKEN_KEY = 'attendance.token';
export const REFRESH_KEY = 'attendance.refresh';
export function getAccessToken() {
    return window.localStorage.getItem(TOKEN_KEY);
}
export function setAccessToken(token) {
    if (token) {
        window.localStorage.setItem(TOKEN_KEY, token);
    }
    else {
        window.localStorage.removeItem(TOKEN_KEY);
    }
}
export function setRefreshToken(token) {
    if (token) {
        window.localStorage.setItem(REFRESH_KEY, token);
    }
    else {
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
export async function login(payload) {
    const { data } = await api.post('/auth/login', payload);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    return data;
}
export async function getMe() {
    const { data } = await api.get('/auth/me');
    return data.user;
}
export async function getAnalyticsOverview() {
    const { data } = await api.get('/analytics/overview');
    return data;
}
export async function getLiveSummary() {
    const { data } = await api.get('/analytics/live');
    return data.live;
}
export async function getAttendanceMomentum() {
    const { data } = await api.get('/analytics/momentum');
    return data.data;
}
export async function getDepartmentComparison() {
    const { data } = await api.get('/analytics/comparison');
    return data.data;
}
export async function getFraudHeatmap() {
    const { data } = await api.get('/analytics/heatmap');
    return data.data;
}
export async function getSessions() {
    const { data } = await api.get('/attendance/sessions');
    return data.items;
}
export async function getAuditLogs() {
    const { data } = await api.get('/admin/audit-logs');
    return data.items;
}
export async function getHealth() {
    const { data } = await api.get('/admin/health');
    return data;
}
export async function getNotifications() {
    const { data } = await api.get('/notifications');
    return data.items;
}
export async function getCurrentAttendance() {
    const { data } = await api.get('/attendance/sessions');
    return data.items;
}
