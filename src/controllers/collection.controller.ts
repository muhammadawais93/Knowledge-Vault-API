import { Response } from 'express';
import CollectionService from '../services/collection.service';
import { AuthenticatedRequest } from '../types/types';

export default class CollectionController {
  private collectionService = new CollectionService();

  public createCollection = async (req: AuthenticatedRequest, res: Response) => {
    const collection = req.body;
    const userId = req.user?.id;

    if (!collection || !userId) {
      res.status(400).json({ message: 'Invalid collection payload', collection: null });
    }

    const {
      collection: newCollection,
      message,
      status,
    } = await this.collectionService.createCollection(collection, userId);

    res.status(status).json({ message, collection: newCollection });
  };

  public getAllCollection = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required', collections: null });
    }

    const { collections, message, status } = await this.collectionService.getAllCollection(userId);

    res.status(status).json({ message, collection: collections });
  };

  public getCollectionById = async (req: AuthenticatedRequest, res: Response) => {
    const collectionId = req.params.id;
    const userId = req.user?.id;

    if (!collectionId || !userId) {
      res.status(400).json({ message: 'Collection ID and User ID are required', collection: null });
    }

    const { collection, message, status } = await this.collectionService.getCollectionById(
      collectionId,
      userId
    );

    res.status(status).json({ message, collection });
  };

  public updateCollection = async (req: AuthenticatedRequest, res: Response) => {
    const collectionId = req.params.id;
    const userId = req.user?.id;
    const updateCollection = req.body;

    if (!collectionId || !userId) {
      res.status(400).json({ message: 'Collection ID and User ID are required', collection: null });
    }

    const { collection, message, status } = await this.collectionService.updateCollection(
      collectionId,
      userId,
      updateCollection
    );

    res.status(status).json({ message, collection });
  };

  public deleteCollection = async (req: AuthenticatedRequest, res: Response) => {
    const collectionId = req.params.id;
    const userId = req.user?.id;

    if (!collectionId || !userId) {
      res.status(400).json({ message: 'Collection ID and User ID are required', collection: null });
    }

    const { message, status, collection } = await this.collectionService.deleteCollection(
      collectionId,
      userId
    );

    res.status(status).json({ message, collection });
  };
}
