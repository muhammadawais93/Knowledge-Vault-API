import LoggerService from './logger.service';
import { KnowledgeItemModel } from '../models/KnowledgeItem';
import { IKnowledgeItem } from '../types/KnowledgeItem';
import { CollectionModel } from '../models/Collection';

const logger = LoggerService.getLogger();

export default class KnowledgeService {
  public async getKnowledgeItems(userId: string) {
    try {
      const knowledgeItems = await KnowledgeItemModel.find({ userId });
      logger.info(knowledgeItems, 'Fetched knowledge items:');

      return { status: 200, message: 'Knowledge items retrieved successfully', knowledgeItems };
    } catch (error) {
      logger.error(error, 'Error fetching knowledge items:');
      return { status: 500, message: 'Error fetching knowledge items', knowledgeItems: null };
    }
  }
  public async createKnowledgeItem(knowledgeItem: IKnowledgeItem, userId: string) {
    const { title, type, collectionId } = knowledgeItem;

    if (!title || !type) {
      return { status: 400, message: 'Invalid knowledge item payload', knowledgeItem: null };
    }

    try {
      let collection = null;

      if (collectionId) {
        collection = await CollectionModel.findOneAndUpdate({ _id: collectionId, userId }, { $inc: { itemCount: 1 } }, { new: true });
        logger.info(collection, 'Collection updated:');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { viewCount, ...rest } = knowledgeItem;
      const newKnowledgeItem = await KnowledgeItemModel.create({
        ...rest,
        userId,
      });

      logger.info(newKnowledgeItem, 'New knowledge item created:');

      return {
        status: 201,
        message: 'Knowledge item created successfully',
        knowledgeItem: newKnowledgeItem,
        collection,
      };
    } catch (error) {
      logger.error(error, 'Error creating knowledge item:');
      return { status: 500, message: 'Error creating knowledge item', knowledgeItem: null };
    }
  }

  public async getKnowledgeItemById(knowledgeItemId: string, userId: string) {
    try {
      const filter = { _id: knowledgeItemId, userId };
      const update = { $inc: { viewCount: 1 } };
      const options = { new: true };

      const knowledgeItem = await KnowledgeItemModel.findOneAndUpdate(filter, update, options);

      if (!knowledgeItem) {
        return { status: 404, message: 'Knowledge item not found', knowledgeItem: null };
      }

      return { status: 200, message: 'Knowledge item retrieved', knowledgeItem };
    } catch (error) {
      logger.error(error, 'Error retrieving knowledge item:');
      return { status: 500, message: 'Error retrieving knowledge item', knowledgeItem: null };
    }
  }

  public async updateKnowledgeItem(knowledgeItemId: string, userId: string, updateData: Partial<IKnowledgeItem>) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { viewCount, ...rest } = updateData;
      const filter = { _id: knowledgeItemId, userId };
      const update = { $set: rest };
      const options = { new: true };

      const knowledgeItem = await KnowledgeItemModel.findOneAndUpdate(filter, update, options);

      if (!knowledgeItem) {
        return { status: 404, message: 'Knowledge item not found', knowledgeItem: null };
      }

      logger.info(knowledgeItem, 'Updated knowledge item:');

      return {
        status: 200,
        message: 'Knowledge item updated successfully',
        knowledgeItem,
      };
    } catch (error) {
      logger.error(error, 'Error updating knowledge item:');
      return { status: 500, message: 'Error updating knowledge item', knowledgeItem: null };
    }
  }

  public async deleteKnowledgeItem(knowledgeItemId: string, userId: string) {
    try {
      const knowledgeItem = await KnowledgeItemModel.findOneAndDelete({
        _id: knowledgeItemId,
        userId,
      });

      if (!knowledgeItem) {
        return { status: 404, message: 'Knowledge item not found', knowledgeItem: null };
      }

      logger.info(knowledgeItem, 'Deleted knowledge item:');

      if (knowledgeItem.collectionId) {
        const collection = await CollectionModel.findOneAndUpdate(
          { _id: knowledgeItem.collectionId, userId },
          { $inc: { itemCount: -1 } },
          { new: true }
        );
        logger.info(collection, 'Collection updated after item deletion:');
      }

      return {
        status: 200,
        message: 'Knowledge item deleted successfully',
        knowledgeItem,
      };
    } catch (error) {
      logger.error(error, 'Error deleting knowledge item:');
      return { status: 500, message: 'Error deleting knowledge item', knowledgeItem: null };
    }
  }
}
