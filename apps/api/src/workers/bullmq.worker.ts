import { Worker } from 'bullmq';
import { redisClient } from '../config/redis.js';
import { logger } from '../utils/logger.js';

export function startWorkers() {
  const worker = new Worker(
    'fraud-review',
    async job => {
      logger.info('Processing fraud review job', { jobId: job.id });
    },
    { connection: redisClient as never }
  );

  worker.on('failed', (job, error) => {
    logger.error('Worker failed', { jobId: job?.id, error });
  });

  return worker;
}