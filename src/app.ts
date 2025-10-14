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
    app.use(rateLimiterMiddleware);
    app.use(requestLoggerMiddleware);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
}
