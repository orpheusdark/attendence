import { UserModel, type UserDocument } from '../models/user.model.js';
import { BaseRepository } from './base.repository.js';

class UserRepository extends BaseRepository<UserDocument> {
  constructor() {
    super(UserModel);
  }

  findByEmail(email: string) {
    return this.model.findOne({ email: email.toLowerCase(), isDeleted: false });
  }
}

export const userRepository = new UserRepository();