import mongoose from 'mongoose';
import { createBaseSchema } from './base.model.js';

export interface GeofenceConfigDocument {
  classroomName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  departmentId?: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  isActive: boolean;
}

const geofenceSchema = createBaseSchema<GeofenceConfigDocument>({
  classroomName: { type: String, required: true, trim: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radiusMeters: { type: Number, required: true, default: 75 },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  isActive: { type: Boolean, default: true }
});

geofenceSchema.index({ classroomName: 1, departmentId: 1 });

export const GeofenceConfigModel = mongoose.model<GeofenceConfigDocument>('GeofenceConfig', geofenceSchema);