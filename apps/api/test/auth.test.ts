import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('health', () => {
  it('responds with ok', async () => {
    const response = await request(createApp()).get('/health');
    expect(response.status).toBe(200);
  });
});