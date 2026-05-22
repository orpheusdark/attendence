import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.js';

export function errorMiddleware(error: unknown, request: Request, response: Response, _next: NextFunction) {
  const message = error instanceof Error ? error.message : 'Unexpected server error';
  logger.error(message, { error, path: request.path });
  response.status(500).json({ message });
}