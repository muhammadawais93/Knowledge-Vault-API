import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthService from '../../../src/services/auth.service';
import { UserModel } from '../../../src/models/User';
import userLoginResult from '../fixtures/auth/login.json';
import userRegisterResult from '../fixtures/auth/register.json';
import { Role } from '../../../src/types/User';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('../../../src/services/logger.service', () => require('../__mocks__/logger.service'));
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
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
        select: jest.fn().mockReturnThis().mockResolvedValue(mockFoundUser),
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

    test('should fail login with user does not exist', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis().mockResolvedValue(null),
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
        select: jest.fn().mockReturnThis().mockResolvedValue(mockFoundUser),
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

  describe('register', () => {
    const mockCreateUser = {
      firstName: 'test',
      lastName: 'bob',
      email: 'hello2@gmail.com',
      password: 'test125',
      role: Role.USER,
    };
    const { id, firstName, lastName, email, role, updatedAt, createdAt } = userRegisterResult.user;
    const mockRegisterUser = {
      _id: id,
      firstName,
      lastName,
      email,
      role,
      updatedAt,
      createdAt,
    };

    test('should register a new user successfully', async () => {
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(UserModel, 'create').mockResolvedValue(mockRegisterUser as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword125');
      const register = await authService.register(mockCreateUser);

      expect(register.status).toBe(201);
      expect(register.message).toBe('User created successfully');
      expect(register.user).toEqual(userRegisterResult.user);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockCreateUser.password, expect.any(Number));
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockCreateUser.email });
      expect(UserModel.create).toHaveBeenCalledWith({
        firstName: mockCreateUser.firstName,
        lastName: mockCreateUser.lastName,
        email: mockCreateUser.email,
        role: mockCreateUser.role,
        passwordHash: 'hashedpassword125',
      });
    });

    test('should return 409 when user already exists', async () => {
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(mockRegisterUser as any);
      const register = await authService.register(mockCreateUser);

      expect(register.status).toBe(409);
      expect(register.message).toBe('User with this email already exists');
      expect(register.user).toBeNull();
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockCreateUser.email });
    });

    test('should return 400 when missing required fields', async () => {
      const incompleteUserData = {
        firstName: 'test',
        email: '',
        password: 'test125',
      };
      const register = await authService.register(incompleteUserData as any);

      expect(register.status).toBe(400);
      expect(register.message).toBe('Missing required user fields');
      expect(register.user).toBeNull();
    });
  });
});
