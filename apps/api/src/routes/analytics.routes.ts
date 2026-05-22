import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { comparison, heatmap, liveSummary, momentum, overview, trends } from '../controllers/analytics.controller.js';

export const analyticsRouter = Router();

analyticsRouter.get('/overview', authenticate, authorize('hod', 'admin'), overview);
analyticsRouter.get('/trends', authenticate, authorize('hod', 'admin', 'teacher'), trends);
analyticsRouter.get('/live', authenticate, authorize('hod', 'admin', 'teacher'), liveSummary);
analyticsRouter.get('/momentum', authenticate, authorize('hod', 'admin'), momentum);
analyticsRouter.get('/heatmap', authenticate, authorize('hod', 'admin'), heatmap);
analyticsRouter.get('/comparison', authenticate, authorize('hod', 'admin'), comparison);