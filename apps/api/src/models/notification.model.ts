import mongoose from 'mongoose';
import { createBaseSchema } from './base.model.js';

export interface NotificationDocument {
  recipientId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  type: 'attendance' | 'fraud' | 'system' | 'announcement';
  readAt?: Date;
  channels: Array<'in-app' | 'push' | 'email'>;
  metadata: Record<string, unknown>;
}

const notificationSchema = createBaseSchema<NotificationDocument>({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, required: true, enum: ['attendance', 'fraud', 'system', 'announcement'], index: true },
  readAt: { type: Date },
  channels: [{ type: String, enum: ['in-app', 'push', 'email'] }],
  metadata: { type: Object, default: {} }
});

notificationSchema.index({ recipientId: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<NotificationDocument>('Notification', notificationSchema);