import { UserModel } from '../models/user.model';

export class UserRepository {
  async create(user: { email: string; password: string }) {
    return UserModel.create(user);
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  async findByEmailForLogin(email: string) {
    return UserModel.findOne({ email }).select('+password');
  }
}
