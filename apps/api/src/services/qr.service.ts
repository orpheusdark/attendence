import crypto from 'crypto';
import { QR_REFRESH_SECONDS } from '../config/constants.js';
import { encryptPayload, hashValue } from '../utils/crypto.js';

export interface RollingQrPayload {
  sessionId: string;
  teacherId: string;
  subjectId: string;
  classroomName: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

export class QrService {
  createRollingPayload(input: Omit<RollingQrPayload, 'issuedAt' | 'expiresAt' | 'nonce'>) {
    const issuedAt = Date.now();
    const expiresAt = issuedAt + QR_REFRESH_SECONDS * 1000;
    const nonce = crypto.randomBytes(12).toString('hex');
    const payload: RollingQrPayload = { ...input, issuedAt, expiresAt, nonce };
    return {
      payload,
      token: encryptPayload(payload),
      tokenHash: hashValue(JSON.stringify(payload))
    };
  }

  createReversePayload(input: { sessionId: string; studentId: string; deviceId: string; issuedAt?: number }) {
    const payload = {
      ...input,
      issuedAt: input.issuedAt ?? Date.now(),
      nonce: crypto.randomBytes(16).toString('hex')
    };
    return {
      payload,
      token: encryptPayload(payload),
      tokenHash: hashValue(JSON.stringify(payload))
    };
  }
}

export const qrService = new QrService();