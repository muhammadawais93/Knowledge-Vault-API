import { Router } from 'express';
import KnowledgeController from '../controllers/knowledge.controller';
import { authMiddleware } from '../middleware/authMiddleware';

class KnowledgeRoutes {
  public router = Router();
  private knowledgeController = new KnowledgeController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get('/', authMiddleware, this.knowledgeController.getKnowledgeItems);
    this.router.post('/', authMiddleware, this.knowledgeController.createKnowledgeItem);
    this.router.get('/:id', authMiddleware, this.knowledgeController.getKnowledgeItemById);
    this.router.put('/:id', authMiddleware, this.knowledgeController.updateKnowledgeItem);
    this.router.delete('/:id', authMiddleware, this.knowledgeController.deleteKnowledgeItem);
  }
}

export default new KnowledgeRoutes().router;
