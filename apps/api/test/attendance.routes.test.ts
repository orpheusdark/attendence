import { afterEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { authService } from '../src/services/auth.service.js';
import { UserModel } from '../src/models/user.model.js';
import { attendanceService } from '../src/services/attendance.service.js';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('attendance routes', () => {
  it('creates a scan record', async () => {
    jest.spyOn(authService, 'verifyAccessToken').mockReturnValue({ sub: 'user-1', role: 'admin', deviceId: 'dev-1' });
    jest.spyOn(UserModel, 'findById').mockResolvedValue({ _id: 'user-1', role: 'admin', status: 'active' } as never);
    jest.spyOn(attendanceService, 'scanAttendance').mockResolvedValue({ _id: 'rec-1', status: 'pending' } as never);

    const response = await request(createApp())
      .post('/api/v1/attendance/scan')
      .set('Authorization', 'Bearer test-token')
      .send({
        sessionId: 'session-1',
        studentId: 'student-1',
        deviceId: 'device-123456',
        deviceFingerprintHash: 'fp-1',
        ipAddress: '127.0.0.1',
        latitude: 12.34,
        longitude: 56.78,
        qrToken: 'qr-token'
      });

    expect(response.status).toBe(201);
    expect(response.body._id).toBe('rec-1');
    expect(attendanceService.scanAttendance).toHaveBeenCalledWith({
      sessionId: 'session-1',
      studentId: 'student-1',
      deviceId: 'device-123456',
      deviceFingerprintHash: 'fp-1',
      ipAddress: '127.0.0.1',
      latitude: 12.34,
      longitude: 56.78,
      qrToken: 'qr-token'
    });
  });

  it('validates scan payload and returns 500 for invalid data', async () => {
    jest.spyOn(authService, 'verifyAccessToken').mockReturnValue({ sub: 'user-1', role: 'admin', deviceId: 'dev-1' });
    jest.spyOn(UserModel, 'findById').mockResolvedValue({ _id: 'user-1', role: 'admin', status: 'active' } as never);

    const response = await request(createApp())
      .post('/api/v1/attendance/scan')
      .set('Authorization', 'Bearer test-token')
      .send({
        sessionId: 'session-1',
        studentId: 'student-1',
        deviceId: 'short',
        deviceFingerprintHash: 'fp-1',
        ipAddress: '127.0.0.1',
        latitude: 12.34,
        longitude: 56.78,
        qrToken: 'qr-token'
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toContain('String must contain at least 6 character(s)');
  });

  it('confirms attendance', async () => {
    jest.spyOn(authService, 'verifyAccessToken').mockReturnValue({ sub: 'user-1', role: 'admin', deviceId: 'dev-1' });
    jest.spyOn(UserModel, 'findById').mockResolvedValue({ _id: 'user-1', role: 'admin', status: 'active' } as never);
    jest.spyOn(attendanceService, 'confirmAttendance').mockResolvedValue({ _id: 'rec-1', status: 'confirmed' } as never);

    const response = await request(createApp())
      .post('/api/v1/attendance/confirm')
      .set('Authorization', 'Bearer test-token')
      .send({
        sessionId: 'session-1',
        studentId: 'student-1',
        reverseToken: 'reverse-token',
        confirmationMethod: 'manual'
      });

    expect(response.status).toBe(200);
    expect(response.body._id).toBe('rec-1');
    expect(attendanceService.confirmAttendance).toHaveBeenCalledWith({
      sessionId: 'session-1',
      studentId: 'student-1',
      reverseToken: 'reverse-token',
      confirmationMethod: 'manual'
    });
  });
});
