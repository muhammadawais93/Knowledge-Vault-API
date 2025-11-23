import { authMiddleware } from '../../../src/middleware/authMiddleware';
import jwt from 'jsonwebtoken';
import config from '../../../src/config';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../../src/types/types';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('../../../src/config', () => ({
  jwtSecret: 'testsecret',
}));

describe('authMiddleware', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  const validToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJJZDEyMyIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IkRvZSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYzOTI3NTkyfQ.CUEXYTOVeTQ1Q1qiVMpH1YIfNNcPFsrQ2SrP39-PCN8';

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  test('should verify authentication', () => {
    mockReq.headers = {
      authorization: `Bearer ${validToken}`,
    };
    const mockDecodedValue = {
      id: 'userId123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@example.com',
      role: 'user',
    };
    (jwt.verify as jest.Mock).mockReturnValue(mockDecodedValue);
    authMiddleware(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(validToken, config.jwtSecret);
    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toBe(mockDecodedValue);
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  test('should failed to verfiy authentication with invalid token', () => {
    mockReq.headers = {
      authorization: 'Bearer invalidtoken123',
    };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith('invalidtoken123', config.jwtSecret);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid or expired token',
      error: new Error('Invalid token'),
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 401 if no token is provided', () => {
    authMiddleware(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
