import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../models/user.model.js';

export function authorize(...roles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ message: 'Insufficient role' });
    }

    next();
  };
}