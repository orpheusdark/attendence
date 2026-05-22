import crypto from 'crypto';
import { env } from '../config/env.js';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(env.QR_ENCRYPTION_KEY.slice(0, 32));

export function encryptPayload(payload: unknown): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const content = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, content]).toString('base64url');
}

export function decryptPayload<T>(token: string): T {
  const buffer = Buffer.from(token, 'base64url');
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const content = buffer.subarray(28);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);
  const json = Buffer.concat([decipher.update(content), decipher.final()]).toString('utf8');
  return JSON.parse(json) as T;
}

export function hashValue(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}