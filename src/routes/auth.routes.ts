import express from 'express';
import AuthController from '../controllers/auth.controller';
import { authRateLimiterMiddleware } from '../middleware';

class AuthRoutes {
  public router = express.Router();
  private authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', authRateLimiterMiddleware, this.authController.index);

    this.router.post('/login', authRateLimiterMiddleware, this.authController.login);

    this.router.post('/register', authRateLimiterMiddleware, this.authController.register);
  }
}

export default new AuthRoutes().router;
