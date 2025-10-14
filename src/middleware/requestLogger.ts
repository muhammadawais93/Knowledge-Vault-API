import { Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import LoggerService from '../services/logger.service';
import { RequestWithLogging } from '../types/types';

const logger = LoggerService.getLogger();

export const requestLoggerMiddleware = (req: RequestWithLogging, _res: Response, next: NextFunction) => {
  // Generate a unique request ID if not already present
  req.requestId = req.requestId || randomUUID();

  logger.info(
    {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    },
    'Request started'
  );

  next();
};
