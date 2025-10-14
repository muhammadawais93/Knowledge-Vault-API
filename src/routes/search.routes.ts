import { Router } from 'express';
import SearchController from '../controllers/search.controller';
import { authMiddleware } from '../middleware/authMiddleware';

class SearchRoutes {
  public router = Router();
  private searchController = new SearchController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', authMiddleware, this.searchController.search);
  }
}

export default new SearchRoutes().router;
