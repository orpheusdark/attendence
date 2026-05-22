import { createClient } from 'redis';
import { env } from './env.js';

export const redisClient = createClient({ url: env.REDIS_URL });

redisClient.on('error', error => {
  console.error('Redis error', error);
});

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}