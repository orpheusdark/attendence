import mongoose from 'mongoose';
import { createBaseSchema } from './base.model.js';

export interface DepartmentDocument {
  name: string;
  code: string;
  headId?: mongoose.Types.ObjectId;
}

const departmentSchema = createBaseSchema<DepartmentDocument>({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  headId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const DepartmentModel = mongoose.model<DepartmentDocument>('Department', departmentSchema);