import type { NextFunction, Request, Response } from 'express';

export function deviceMiddleware(request: Request, _response: Response, next: NextFunction) {
  const deviceId = request.header('x-device-id');
  if (deviceId) {
    request.deviceFingerprint = deviceId;
  }
  next();
}