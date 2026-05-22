import type { HydratedDocument } from 'mongoose';
import type { UserDocument } from '../models/user.model.js';

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<UserDocument>;
      deviceFingerprint?: string;
    }
  }
}

export {};