import mongoose, { type HydratedDocument } from 'mongoose';
import { createBaseSchema } from './base.model.js';

export type UserRole = 'student' | 'teacher' | 'hod' | 'admin';

export interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  departmentId?: mongoose.Types.ObjectId;
  subjectIds: mongoose.Types.ObjectId[];
  studentId?: string;
  employeeId?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: Date;
  avatarUrl?: string;
}

const userSchema = createBaseSchema<UserDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'teacher', 'hod', 'admin'], index: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  studentId: { type: String, index: true },
  employeeId: { type: String, index: true },
  phone: { type: String },
  status: { type: String, default: 'active', enum: ['active', 'inactive', 'suspended'] },
  lastLoginAt: { type: Date },
  avatarUrl: { type: String }
});

userSchema.index({ role: 1, departmentId: 1 });

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
export type UserHydratedDocument = HydratedDocument<UserDocument>;