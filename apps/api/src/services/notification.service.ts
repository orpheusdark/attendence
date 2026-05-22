import { NotificationModel } from '../models/notification.model.js';

export class NotificationService {
  async createNotification(input: {
    recipientId: string;
    title: string;
    body: string;
    type: 'attendance' | 'fraud' | 'system' | 'announcement';
    channels?: Array<'in-app' | 'push' | 'email'>;
    metadata?: Record<string, unknown>;
  }) {
    return NotificationModel.create({
      ...input,
      channels: input.channels ?? ['in-app'],
      metadata: input.metadata ?? {}
    });
  }
}

export const notificationService = new NotificationService();