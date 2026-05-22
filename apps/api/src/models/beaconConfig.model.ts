import mongoose from 'mongoose';
import { createBaseSchema } from './base.model.js';

export interface BeaconConfigDocument {
  classroomName: string;
  beaconId: string;
  secretSeed: string;
  isActive: boolean;
  teacherId?: mongoose.Types.ObjectId;
}

const beaconSchema = createBaseSchema<BeaconConfigDocument>({
  classroomName: { type: String, required: true, trim: true },
  beaconId: { type: String, required: true, unique: true, index: true },
  secretSeed: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const BeaconConfigModel = mongoose.model<BeaconConfigDocument>('BeaconConfig', beaconSchema);