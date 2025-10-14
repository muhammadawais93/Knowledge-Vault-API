import express from 'express';
import IndexController from '../controllers/index.controller';

class IndexRoutes {
  public router = express.Router();
  private indexController = new IndexController().getHealthStatus;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.indexController);
  }
}

export default new IndexRoutes().router;
