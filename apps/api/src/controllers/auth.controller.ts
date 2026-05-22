import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../services/auth.service.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
import { auditService } from '../services/audit.service.js';

export const register = asyncHandler(async (request: Request, response: Response) => {
  const data = registerSchema.parse(request.body);
  const user = await authService.register(data);
  await auditService.log({ action: 'auth.register', entityType: 'User', entityId: String(user._id), metadata: { role: user.role } });
  response.status(201).json({ user });
});

export const login = asyncHandler(async (request: Request, response: Response) => {
  const data = loginSchema.parse(request.body);
  const result = await authService.login({
    ipAddress: request.ip || request.socket.remoteAddress || '127.0.0.1',
    ...data,
    deviceId: data.deviceId,
    ...(request.header('user-agent') ? { userAgent: request.header('user-agent') } : {})
  });

  await auditService.log({ action: 'auth.login', entityType: 'User', entityId: String(result.user._id), metadata: { deviceId: data.deviceId } });
  response.json({ user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken });
});

export const profile = asyncHandler(async (request: Request, response: Response) => {
  response.json({ user: request.user });
});

export const logout = asyncHandler(async (request: Request, response: Response) => {
  if (request.user && request.deviceFingerprint) {
    await authService.invalidateSession(String(request.user._id), request.deviceFingerprint);
  }
  response.json({ message: 'Logged out' });
});