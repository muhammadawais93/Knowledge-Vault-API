import express, { Application } from 'express';
import cors from 'cors';
import Routes from './routes/routes';

export default class App {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }
  private config(app: Application): void {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
}
