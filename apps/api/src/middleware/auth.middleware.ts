import type { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { UserModel } from '../models/user.model.js';

export async function authenticate(request: Request, response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Missing access token' });
  }

  try {
    const payload = authService.verifyAccessToken(header.slice(7));
    const user = await UserModel.findById(payload.sub);
    if (!user || user.status !== 'active') {
      return response.status(401).json({ message: 'Invalid session' });
    }

    request.user = user;
    request.deviceFingerprint = payload.deviceId;
    next();
  } catch {
    return response.status(401).json({ message: 'Invalid token' });
  }
}