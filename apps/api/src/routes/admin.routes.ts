import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { auditLogs, systemHealth } from '../controllers/admin.controller.js';

export const adminRouter = Router();

adminRouter.get('/audit-logs', authenticate, authorize('admin'), auditLogs);
adminRouter.get('/health', authenticate, authorize('admin'), systemHealth);