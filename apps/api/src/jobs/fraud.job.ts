import { Queue } from 'bullmq';
import { redisClient } from '../config/redis.js';

export const fraudQueue = new Queue('fraud-review', { connection: redisClient as never });

export async function queueFraudReview(payload: Record<string, unknown>) {
  await fraudQueue.add('review', payload, { removeOnComplete: true, removeOnFail: false });
}