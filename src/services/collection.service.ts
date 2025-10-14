import LoggerService from './logger.service';
import { CollectionModel } from '../models/Collection';
import { KnowledgeItemModel } from '../models/KnowledgeItem';

const logger = LoggerService.getLogger();

interface ICollectionPayload {
  name: string;
  description: string;
  isPrivate: boolean;
}

export default class CollectionService {
  public async createCollection(collection: ICollectionPayload, userId: string) {
    const { name, description, isPrivate } = collection;

    if (!name || typeof isPrivate !== 'boolean' || !description) {
      return { status: 400, message: 'Invalid collection payload', collection: null };
    }

    try {
      const newCollection = await CollectionModel.create({
        userId,
        name,
        description,
        isPrivate,
      });

      logger.info(newCollection, 'New collection created:');

      return { status: 201, message: 'Collection created successfully', collection: newCollection };
    } catch (error) {
      logger.error(error, 'Error creating collection:');
      return { status: 500, message: 'Error creating collection', collection: null };
    }
  }

  public async getAllCollection(userId: string) {
    try {
      const collections = await CollectionModel.find({ userId });

      logger.info(collections, 'Fetched collections:');

      return { status: 200, message: 'Collections fetched successfully', collections };
    } catch (error) {
      logger.error(error, 'Error fetching collections:');
      return { status: 500, message: 'Error fetching collections', collections: null };
    }
  }

  public async getCollectionById(collectionId: string, userId: string) {
    try {
      const collection = await CollectionModel.findOne({ _id: collectionId, userId });

      if (!collection) {
        return { status: 404, message: 'Collection not found', collection: null };
      }
      logger.info(collection, 'Fetched collection by ID:');

      return { status: 200, message: 'Collection fetched successfully', collection };
    } catch (error) {
      logger.error(error, 'Error fetching collection by ID:');
      return { status: 500, message: 'Error fetching collection by ID', collection: null };
    }
  }

  public async updateCollection(
    collectionId: string,
    userId: string,
    updates: Partial<ICollectionPayload>
  ) {
    try {
      const filter = { _id: collectionId, userId };
      const options = { new: true };
      const updatedCollection = await CollectionModel.findOneAndUpdate(filter, updates, options);

      if (!updatedCollection) {
        return { status: 404, message: 'Collection not found', collection: null };
      }

      logger.info(updatedCollection, 'Updated collection:');

      return {
        status: 200,
        message: 'Collection updated successfully',
        collection: updatedCollection,
      };
    } catch (error) {
      logger.error(error, 'Error updating collection:');
      return { status: 500, message: 'Error updating collection', collection: null };
    }
  }

  public async deleteCollection(collectionId: string, userId: string) {
    try {
      await KnowledgeItemModel.updateMany(
        { collectionId, userId },
        { $unset: { collectionId: '' } }
      );

      const deletedCollection = await CollectionModel.findOneAndDelete({
        _id: collectionId,
        userId,
      });

      if (!deletedCollection) {
        return { status: 404, message: 'Collection not found', collection: null };
      }

      logger.info(deletedCollection, 'Deleted collection:');

      return {
        status: 200,
        message: 'Collection deleted successfully',
        collection: deletedCollection,
      };
    } catch (error) {
      logger.error(error, 'Error deleting collection:');
      return { status: 500, message: 'Error deleting collection', collection: null };
    }
  }
}
