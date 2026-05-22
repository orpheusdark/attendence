import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotificationModel } from '../models/notification.model.js';

export const listNotifications = asyncHandler(async (request: Request, response: Response) => {
  const items = await NotificationModel.find({ recipientId: request.user?._id, isDeleted: false }).sort({ createdAt: -1 }).limit(50);
  response.json({ items });
});

export const markNotificationRead = asyncHandler(async (request: Request, response: Response) => {
  const notification = await NotificationModel.findOneAndUpdate(
    { _id: request.params.id, recipientId: request.user?._id },
    { readAt: new Date() },
    { new: true }
  );
  response.json({ notification });
});