import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { attendanceRouter } from './attendance.routes.js';
import { analyticsRouter } from './analytics.routes.js';
import { notificationRouter } from './notification.routes.js';
import { adminRouter } from './admin.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/attendance', attendanceRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/admin', adminRouter);