import { Router } from 'express';
import CollectionController from '../controllers/collection.controller';
import { authMiddleware } from '../middleware/authMiddleware';

class CollectionRoutes {
  public router = Router();
  private collectionController = new CollectionController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get('/', authMiddleware, this.collectionController.getAllCollection);
    this.router.post('/', authMiddleware, this.collectionController.createCollection);
    this.router.get('/:id', authMiddleware, this.collectionController.getCollectionById);
    this.router.put('/:id', authMiddleware, this.collectionController.updateCollection);
    this.router.delete('/:id', authMiddleware, this.collectionController.deleteCollection);
  }
}

export default new CollectionRoutes().router;
