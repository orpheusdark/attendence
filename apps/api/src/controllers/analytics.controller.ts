import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { analyticsService } from '../services/analytics.service.js';

export const overview = asyncHandler(async (_request: Request, response: Response) => {
  const [attendance, fraud, live] = await Promise.all([
    analyticsService.attendanceOverview(),
    analyticsService.fraudOverview(),
    analyticsService.liveSummary()
  ]);
  response.json({ attendance, fraud, live });
});

export const trends = asyncHandler(async (request: Request, response: Response) => {
  const departmentId = typeof request.query.departmentId === 'string' ? request.query.departmentId : undefined;
  const data = await analyticsService.departmentTrends(departmentId);
  response.json({ data });
});

export const liveSummary = asyncHandler(async (_request: Request, response: Response) => {
  const live = await analyticsService.liveSummary();
  response.json({ live });
});

export const momentum = asyncHandler(async (_request: Request, response: Response) => {
  const data = await analyticsService.attendanceMomentum();
  response.json({ data });
});

export const heatmap = asyncHandler(async (_request: Request, response: Response) => {
  const data = await analyticsService.fraudHeatmap();
  response.json({ data });
});

export const comparison = asyncHandler(async (_request: Request, response: Response) => {
  const data = await analyticsService.departmentComparison();
  response.json({ data });
});