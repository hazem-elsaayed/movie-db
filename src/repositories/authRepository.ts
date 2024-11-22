import { User } from '../models/user.js';
import { IAuthRepository } from '../utils/interfaces.js';

export class AuthRepository implements IAuthRepository {
  public async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  public async createUser(
    email: string,
    hashedPassword: string,
    username: string
  ): Promise<User> {
    return await User.create({
      email,
      password: hashedPassword,
      username,
    });
  }
}
