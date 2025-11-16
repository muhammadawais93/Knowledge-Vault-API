import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthService from '../../../src/services/auth.service';
import { UserModel } from '../../../src/models/User';
import userLoginResult from '../fixtures/auth/login.json';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('../../../src/services/logger.service', () => require('../__mocks__/logger.service'));
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('AuthService', () => {
  const authService: AuthService = new AuthService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockUserLoginObj = {
      email: 'hello@gmail.com',
      password: 'test123',
    };
    const mockFoundUser = {
      ...userLoginResult.user,
      _id: userLoginResult.user.id,
      passwordHash: 'hashedpassword123',
    };

    test('should user do the login', async () => {
      // Mock the mongoose query chain properly
      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockFoundUser),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(UserModel, 'findOne').mockReturnValue(mockQuery as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(userLoginResult.token);

      const login = await authService.login(mockUserLoginObj);

      expect(login.status).toBe(200);
      expect(login.message).toBe('Login successful');
      expect(login.user).toEqual(userLoginResult.user);
      expect(login.token).toBe(userLoginResult.token);
    });

    test('should fail login with incorrect password', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(UserModel, 'findOne').mockReturnValue(mockQuery as any);
      const login = await authService.login(mockUserLoginObj);

      expect(login.status).toBe(404);
      expect(login.message).toBe('User not found');
      expect(login.user).toBeNull();
    });

    test('should fail login with incorrect password', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockFoundUser),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(UserModel, 'findOne').mockReturnValue(mockQuery as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const login = await authService.login(mockUserLoginObj);

      expect(login.status).toBe(401);
      expect(login.message).toBe('Invalid password');
      expect(login.user).toBeNull();
    });
  });
});
