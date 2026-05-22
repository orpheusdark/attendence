declare module 'swagger-ui-express' {
  import type { RequestHandler } from 'express';

  export const serve: RequestHandler[];
  export function setup(swaggerDocument: unknown, options?: unknown): RequestHandler;
}