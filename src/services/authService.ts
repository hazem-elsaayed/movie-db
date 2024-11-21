import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/customError';

export class AuthService {
  public async register(email: string, password: string, username: string) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new CustomError('Email already in use', 409);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });
    const { password: _, id, ...userWithoutPasswordAndId } = user.toJSON();
    return userWithoutPasswordAndId;
  }

  public async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new CustomError('Invalid username/password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid username/password', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const { password: _, id, ...userWithoutPasswordAndId } = user.toJSON();
    return { user: userWithoutPasswordAndId, token };
  }

  public validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return decoded;
    } catch (error) {
      throw new CustomError('Invalid token', 401);
    }
  }
}
