import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { listNotifications, markNotificationRead } from '../controllers/notification.controller.js';

export const notificationRouter = Router();

notificationRouter.get('/', authenticate, listNotifications);
notificationRouter.patch('/:id/read', authenticate, markNotificationRead);