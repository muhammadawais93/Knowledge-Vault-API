import { Response } from 'express';
import knowledgeItemService from '../services/knowledge.service';
import { AuthenticatedRequest } from '../types/types';

export default class KnowledgeController {
  private knowledgeItemService = new knowledgeItemService();

  public getKnowledgeItems = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required', items: null });
    }

    const { knowledgeItems, message, status } =
      await this.knowledgeItemService.getKnowledgeItems(userId);

    res.status(status).json({ message, knowledgeItems });
  };

  public createKnowledgeItem = async (req: AuthenticatedRequest, res: Response) => {
    const knowledgeItem = req.body;
    const userId = req.user?.id;

    if (!knowledgeItem || !userId) {
      res.status(400).json({ message: 'Invalid knowledge item payload', item: null });
    }

    const {
      knowledgeItem: createdItem,
      message,
      status,
      collection,
    } = await this.knowledgeItemService.createKnowledgeItem(knowledgeItem, userId);

    res.status(status).json({ message, knowledgeItem: createdItem, collection });
  };

  public getKnowledgeItemById = async (req: AuthenticatedRequest, res: Response) => {
    const knowledgeId = req.params.id;
    const userId = req.user?.id;

    if (!knowledgeId || !userId) {
      res.status(400).json({ message: 'Invalid knowledge item ID', item: null });
    }

    const { knowledgeItem, message, status } = await this.knowledgeItemService.getKnowledgeItemById(
      knowledgeId,
      userId
    );

    res.status(status).json({ message, knowledgeItem });
  };

  public updateKnowledgeItem = async (req: AuthenticatedRequest, res: Response) => {
    const knowledgeId = req.params.id;
    const userId = req.user?.id;
    const updateData = req.body;

    if (!knowledgeId || !userId) {
      res.status(400).json({ message: 'Knowledge item ID and User ID are required', item: null });
    }

    const { knowledgeItem, message, status } = await this.knowledgeItemService.updateKnowledgeItem(
      knowledgeId,
      userId,
      updateData
    );

    res.status(status).json({ message, knowledgeItem });
  };

  public deleteKnowledgeItem = async (req: AuthenticatedRequest, res: Response) => {
    const knowledgeId = req.params.id;
    const userId = req.user?.id;

    if (!knowledgeId || !userId) {
      res.status(400).json({ message: 'Knowledge item ID and User ID are required', item: null });
    }

    const { knowledgeItem, message, status } = await this.knowledgeItemService.deleteKnowledgeItem(
      knowledgeId,
      userId
    );

    res.status(status).json({ message, knowledgeItem });
  };
}
