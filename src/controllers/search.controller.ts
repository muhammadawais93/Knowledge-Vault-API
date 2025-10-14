import { Response } from 'express';
import { AuthenticatedRequest } from '../types/types';
import SearchService from '../services/search.service';
import { queryParams } from '../types/types';

export default class SearchController {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }
  public search = async (req: AuthenticatedRequest, res: Response) => {
    const queryParams = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ results: [], message: 'Authentication required' });
    }

    const { results, message, status } = await this.searchService.search(
      queryParams as unknown as queryParams,
      userId
    );

    res.status(status).json({ results, message });
  };
}
