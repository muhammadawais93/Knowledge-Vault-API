import express from 'express';
import AuthController from '../controllers/auth.controller';

class AuthRoutes {
  public router = express.Router();
  private authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.authController.index);

    this.router.post('/login', this.authController.login);

    this.router.post('/register', this.authController.register);
  }
}

export default new AuthRoutes().router;
