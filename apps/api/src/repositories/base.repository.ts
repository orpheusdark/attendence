import type { Model } from 'mongoose';

export class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  create(document: Partial<T>) {
    return this.model.create(document);
  }

  findById(id: string) {
    return this.model.findById(id);
  }

  findOne(filter: Record<string, unknown>) {
    return this.model.findOne(filter);
  }

  findMany(filter: Record<string, unknown>) {
    return this.model.find(filter);
  }

  updateOne(filter: Record<string, unknown>, update: Record<string, unknown>) {
    return this.model.updateOne(filter, update);
  }
}