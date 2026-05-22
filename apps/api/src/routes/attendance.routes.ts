import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { confirmAttendance, scanAttendance, sessionHistory, startSession } from '../controllers/attendance.controller.js';

export const attendanceRouter = Router();

attendanceRouter.post('/sessions', authenticate, authorize('teacher', 'admin'), startSession);
attendanceRouter.post('/scan', authenticate, scanAttendance);
attendanceRouter.post('/confirm', authenticate, authorize('teacher', 'admin'), confirmAttendance);
attendanceRouter.get('/sessions', authenticate, authorize('teacher', 'hod', 'admin'), sessionHistory);