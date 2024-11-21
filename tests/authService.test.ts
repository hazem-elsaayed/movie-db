
import { AuthService } from '../src/services/authService';
import { User } from '../src/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomError } from '../src/utils/customError';

jest.mock('../src/models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  const authService = new AuthService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const username = 'testuser';

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.create as jest.Mock).mockResolvedValue({
        toJSON: () => ({ email, username, password: 'hashedPassword' }),
      });

      const result = await authService.register(email, password, username);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(User.create).toHaveBeenCalledWith({
        email,
        password: 'hashedPassword',
        username,
      });
      expect(result).toEqual({ email, username });
    });

    it('should throw an error if email is already in use', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const username = 'testuser';

      (User.findOne as jest.Mock).mockResolvedValue({});

      await expect(
        authService.register(email, password, username)
      ).rejects.toThrow(CustomError);
      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        toJSON: () => ({ email, username: 'testuser', password: 'hashedPassword' }),
      };

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      const result = await authService.login(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      expect(result).toEqual({ user: { email, username: 'testuser' }, token: 'token' });
    });

    it('should throw an error if email is not found', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(CustomError);
      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
    });

    it('should throw an error if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        toJSON: () => ({ email, username: 'testuser', password: 'hashedPassword' }),
      };

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow(CustomError);
      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedPassword');
    });
  });

  describe('validateToken', () => {
    it('should validate a token', () => {
      const token = 'token';
      const decoded = { id: 1, email: 'test@example.com' };

      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      const result = authService.validateToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET!);
      expect(result).toEqual(decoded);
    });

    it('should throw an error if token is invalid', () => {
      const token = 'invalidToken';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.validateToken(token)).toThrow(CustomError);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET!);
    });
  });
});