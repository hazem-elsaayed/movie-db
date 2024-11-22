import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthRepository, IAuthService } from '../utils/interfaces.js';
import { CustomError } from '../utils/customError.js';

export class AuthService implements IAuthService {
  constructor(private authRepository: IAuthRepository) {}

  public async register(email: string, password: string, username: string) {
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.authRepository.createUser(
      email,
      hashedPassword,
      username
    );

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  public async login(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new CustomError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return { user: userWithoutPassword, token };
  }
}
