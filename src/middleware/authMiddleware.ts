import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthenticatedRequest } from '../types/types';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error });
  }
};
