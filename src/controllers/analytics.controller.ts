import { Response } from 'express';
import { AuthenticatedRequest } from '../types/types';
import AnalyticsService from '../services/analytics.service';

export default class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }
  public analytics = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ result: {}, message: 'Authentication required' });
    }

    const { result, message, status } = await this.analyticsService.analytics(userId);

    res.status(status).json({ result, message });
  };
}
