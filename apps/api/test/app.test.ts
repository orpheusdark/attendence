import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('app shell', () => {
  it('responds to health checks', async () => {
    const response = await request(createApp()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('serves the OpenAPI docs endpoint when the spec exists', async () => {
    const response = await request(createApp()).get('/docs/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('swagger');
  });
});
