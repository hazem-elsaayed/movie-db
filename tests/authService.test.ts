import { AuthService } from '../src/services/authService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CustomError } from '../src/utils/customError.js';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

describe('AuthService', () => {
  const mockAuthRepository = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };
  
  const authService = new AuthService(mockAuthRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const username = 'testuser';

      mockAuthRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockAuthRepository.createUser.mockResolvedValue({
        toJSON: () => ({ email, username, password: 'hashedPassword' }),
      });

      const result = await authService.register(email, password, username);

      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockAuthRepository.createUser).toHaveBeenCalledWith(
        email,
        'hashedPassword',
        username,
      );
      expect(result).toEqual({ email, username });
    });

    it('should throw an error if email is already in use', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const username = 'testuser';

      mockAuthRepository.findByEmail.mockResolvedValue({});

      await expect(
        authService.register(email, password, username)
      ).rejects.toThrow(CustomError);
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(email);
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

      mockAuthRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      const result = await authService.login(email, password);

      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(email);
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

      mockAuthRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(CustomError);
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(email);
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

      mockAuthRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow(CustomError);
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedPassword');
    });
  });
});