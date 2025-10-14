import express, { Application } from 'express';
import cors from 'cors';
import Routes from './routes/routes';
import { requestLoggerMiddleware } from './middleware/requestLogger';

export default class App {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }
  private config(app: Application): void {
    // Add request logging middleware FIRST to capture all requests
    app.use(requestLoggerMiddleware);
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
}
