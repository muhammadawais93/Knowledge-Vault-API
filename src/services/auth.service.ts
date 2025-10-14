import { UserModel } from '../models/User';
import bcrypt from 'bcrypt';
import { IUserRegister, IUserResponse } from '../types/User';
import LoggerService from './logger.service';
import jwt from 'jsonwebtoken';
import config from '../config';

const logger = LoggerService.getLogger();

// TODO: Move this to a separate types file
interface User {
  email: string;
  password: string;
}

export default class AuthService {
  private saltRounds = config.saltRounds;

  public async login(user: User): Promise<IUserResponse> {
    const { email, password } = user;
    if (!email || !password) {
      logger.info('Email and password are required');
      return { message: 'Email and password are required', user: null, status: 400 };
    }

    try {
      const foundUser = await UserModel.findOne({ email }).select('+passwordHash');
      if (!foundUser) {
        logger.info('User not found');
        return { message: 'User not found', user: null, status: 404 };
      }

      const isPasswordValid = await bcrypt.compare(password, foundUser.passwordHash);
      if (!isPasswordValid) {
        logger.info('Invalid password');
        return { message: 'Invalid password', user: null, status: 401 };
      }

      const userObj = {
        id: foundUser._id.toString(),
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        role: foundUser.role,
      };
      const token = jwt.sign(userObj, config.jwtSecret, {
        expiresIn: '7d',
      });
      logger.info(`Generated JWT token for user ${foundUser.email}: ${token}`);
      logger.info(userObj, 'User logged in:');

      return { message: 'Login successful', user: userObj, status: 200, token };
    } catch (error) {
      logger.error(error, 'Error during login:');
      return { message: 'Internal server error', user: null, status: 500 };
    }
  }

  public async register(userData: IUserRegister): Promise<IUserResponse> {
    if (!userData) {
      logger.info('No user data provided');
      return { message: 'No user data provided', user: null, status: 400 };
    }

    const { firstName, lastName, email, password, role } = userData;

    if (!firstName || !lastName || !email || !password) {
      logger.info('Missing required user fields');
      return { message: 'Missing required user fields', user: null, status: 400 };
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      logger.error('User with this email already exists');
      return { message: 'User with this email already exists', user: null, status: 409 };
    }
    try {
      const passwordHash = await bcrypt.hash(password, this.saltRounds);
      const newUser = await UserModel.create({
        firstName,
        lastName,
        email,
        passwordHash,
        role,
      });

      const newUserObj = {
        id: newUser._id.toString(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };

      logger.info(newUserObj, 'New user created:');

      return {
        message: 'User created successfully',
        user: newUserObj,
        status: 201,
      };
    } catch (error) {
      logger.error(error, 'Error creating user:');
      return { message: 'Internal server error', user: null, status: 500 };
    }
  }
}
