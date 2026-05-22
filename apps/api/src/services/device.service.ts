import { DeviceFingerprintModel } from '../models/deviceFingerprint.model.js';
import { hashValue } from '../utils/crypto.js';

export class DeviceService {
  fingerprint(input: {
    userId: string;
    deviceId: string;
    osVersion?: string | undefined;
    appVersion?: string | undefined;
    ipAddress: string;
    userAgent?: string | undefined;
  }) {
    return hashValue([input.userId, input.deviceId, input.osVersion ?? '', input.appVersion ?? '', input.ipAddress, input.userAgent ?? ''].join('|'));
  }

  async upsert(input: {
    userId: string;
    deviceId: string;
    osVersion?: string | undefined;
    appVersion?: string | undefined;
    ipAddress: string;
    userAgent?: string | undefined;
  }) {
    const fingerprintHash = this.fingerprint(input);
    return DeviceFingerprintModel.findOneAndUpdate(
      { userId: input.userId, deviceId: input.deviceId },
      {
        ...input,
        fingerprintHash,
        lastSeenAt: new Date()
      },
      { new: true, upsert: true }
    );
  }
}

export const deviceService = new DeviceService();