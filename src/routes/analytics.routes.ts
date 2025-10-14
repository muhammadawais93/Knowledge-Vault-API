import { Router } from 'express';
import AnalyticsController from '../controllers/analytics.controller';
import { authMiddleware } from '../middleware/authMiddleware';

class AnalyticsRoutes {
  public router = Router();
  private analyticsController = new AnalyticsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', authMiddleware, this.analyticsController.analytics);
  }
}

export default new AnalyticsRoutes().router;
