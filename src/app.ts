import express, { Application } from 'express';
import cors from 'cors';
import Routes from './routes/routes';
import { requestLoggerMiddleware } from './middleware/requestLoggerMiddleware';
import { rateLimiterMiddleware, securityHeadersMiddleware } from './middleware';

export default class App {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }
  private config(app: Application): void {
    app.use(securityHeadersMiddleware);
    app.use(cors());
    // Disable rate limiter and noisy request logging during tests to avoid open handles
    if (process.env.NODE_ENV !== 'test') {
      app.use(rateLimiterMiddleware);
      app.use(requestLoggerMiddleware);
    }
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
}
