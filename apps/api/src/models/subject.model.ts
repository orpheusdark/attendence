import mongoose from 'mongoose';
import { createBaseSchema } from './base.model.js';

export interface SubjectDocument {
  name: string;
  code: string;
  departmentId: mongoose.Types.ObjectId;
  semester?: string;
  batch?: string;
}

const subjectSchema = createBaseSchema<SubjectDocument>({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
  semester: { type: String },
  batch: { type: String }
});

subjectSchema.index({ departmentId: 1, semester: 1 });

export const SubjectModel = mongoose.model<SubjectDocument>('Subject', subjectSchema);