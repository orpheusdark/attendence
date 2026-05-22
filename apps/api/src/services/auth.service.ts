import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';
import { deviceService } from './device.service.js';
import { redisClient } from '../config/redis.js';

type JwtPayload = {
  sub: string;
  role: string;
  deviceId: string;
};

export class AuthService {
  async register(input: { name: string; email: string; password: string; role: 'student' | 'teacher' | 'hod' | 'admin' }) {
    const passwordHash = await bcrypt.hash(input.password, 12);
    return userRepository.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role,
      subjectIds: [],
      status: 'active'
    });
  }

  async login(input: { email: string; password: string; deviceId: string; ipAddress: string; userAgent?: string | undefined; osVersion?: string | undefined; appVersion?: string | undefined }) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordValid) {
      throw new Error('Invalid credentials');
    }

    const device = await deviceService.upsert({
      userId: String(user._id),
      deviceId: input.deviceId,
      ipAddress: input.ipAddress,
      ...(input.userAgent ? { userAgent: input.userAgent } : {}),
      ...(input.osVersion ? { osVersion: input.osVersion } : {}),
      ...(input.appVersion ? { appVersion: input.appVersion } : {})
    });

    user.lastLoginAt = new Date();
    await user.save();

    const payload: JwtPayload = { sub: String(user._id), role: user.role, deviceId: input.deviceId };
    const accessTokenOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions;
    const refreshTokenOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions;
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, accessTokenOptions);
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshTokenOptions);

    await redisClient.set(`session:${String(user._id)}:${input.deviceId}`, JSON.stringify({ refreshToken, ipAddress: input.ipAddress }), { EX: 60 * 60 * 24 * 30 });

    return { user, accessToken, refreshToken, device };
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  }

  async invalidateSession(userId: string, deviceId: string) {
    await redisClient.del(`session:${userId}:${deviceId}`);
  }
}

export const authService = new AuthService();