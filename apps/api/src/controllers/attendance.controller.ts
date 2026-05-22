import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { attendanceService } from '../services/attendance.service.js';
import { confirmAttendanceSchema, scanAttendanceSchema, startSessionSchema } from '../validators/attendance.validator.js';

export const startSession = asyncHandler(async (request: Request, response: Response) => {
  const data = startSessionSchema.parse(request.body);
  const result = await attendanceService.startSession({
    teacherId: String(request.user?._id),
    subjectId: data.subjectId,
    classroomName: data.classroomName,
    ...(data.departmentId ? { departmentId: data.departmentId } : {}),
    ...(data.semester ? { semester: data.semester } : {}),
    ...(data.batch ? { batch: data.batch } : {})
  });
  response.status(201).json(result);
});

export const scanAttendance = asyncHandler(async (request: Request, response: Response) => {
  const data = scanAttendanceSchema.parse(request.body);
  const record = await attendanceService.scanAttendance(data);
  response.status(201).json(record);
});

export const confirmAttendance = asyncHandler(async (request: Request, response: Response) => {
  const data = confirmAttendanceSchema.parse(request.body);
  const record = await attendanceService.confirmAttendance(data);
  response.json(record);
});

export const sessionHistory = asyncHandler(async (_request: Request, response: Response) => {
  response.json({ items: [] });
});