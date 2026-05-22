import mongoose, { type SchemaOptions } from 'mongoose';

export function createBaseSchema<T>(definition: Record<string, any>, options?: SchemaOptions) {
  const schema = new mongoose.Schema(
    {
      ...definition,
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: { type: Date },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    },
    {
      timestamps: true,
      ...options
    }
  );

  schema.pre('save', function markUpdatedAt(next) {
    (this as any).updatedAt = new Date();
    next();
  });

  return schema;
}