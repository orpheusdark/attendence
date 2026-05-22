import { Queue } from 'bullmq';
import { redisClient } from '../config/redis.js';

export const qrRefreshQueue = new Queue('qr-refresh', { connection: redisClient as never });

export async function scheduleQrRefresh(sessionId: string) {
  await qrRefreshQueue.add('refresh', { sessionId }, { repeat: { every: 25_000 }, removeOnComplete: true });
}