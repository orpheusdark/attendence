import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { registerSockets } from './sockets/index.js';
import { startWorkers } from './workers/bullmq.worker.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  await Promise.all([connectDatabase(), connectRedis()]);

  const app = createApp();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.APP_ORIGIN,
      credentials: true
    }
  });

  registerSockets(io);
  startWorkers();

  server.listen(env.PORT, () => {
    logger.info('API server running', { port: env.PORT });
  });
}

bootstrap().catch(error => {
  logger.error('Fatal bootstrap failure', { error });
  process.exit(1);
});