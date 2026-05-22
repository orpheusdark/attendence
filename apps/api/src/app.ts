import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { deviceMiddleware } from './middleware/device.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { apiRouter } from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveOpenApiPath() {
  const candidates = [path.join(process.cwd(), 'docs/openapi.yaml'), path.join(__dirname, '../../docs/openapi.yaml')];

  return candidates.find(candidate => fs.existsSync(candidate));
}

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.APP_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));
  app.use(deviceMiddleware);

  const openApiPath = resolveOpenApiPath();
  if (openApiPath && fs.existsSync(openApiPath)) {
    const openApiDoc = fs.readFileSync(openApiPath, 'utf8');
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
  }

  app.get('/health', (_request, response) => response.json({ status: 'ok', service: env.APP_NAME }));
  app.use('/api/v1', apiRouter);
  app.use(errorMiddleware);

  return app;
}