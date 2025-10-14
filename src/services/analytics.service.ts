import { KnowledgeItemModel } from '../models/KnowledgeItem';
import LoggerService from './logger.service';
import mongoose from 'mongoose';

const logger = LoggerService.getLogger();

export default class AnalyticsService {
  public async analytics(userId: string) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      const userHasRecords = await KnowledgeItemModel.exists({ userId: userObjectId });
      if (!userHasRecords) {
        return {
          results: {},
          message: 'No records found for the user.',
          status: 200,
        };
      }
      const matchCriteria = {
        userId: userObjectId,
      };

      // TODO: improve the typing for facet
      const facet: any = {
        totalItems: [{ $count: 'count' }],
        itemsByType: [{ $group: { _id: '$type', count: { $sum: 1 } } }, { $project: { type: '$_id', count: 1, _id: 0 } }],
        topTags: [
          { $unwind: '$tags' },
          { $group: { _id: '$tags', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
          { $project: { tag: '$_id', count: 1, _id: 0 } },
        ],
        mostViewedItems: [
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
              },
              itemsCreated: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $limit: 7 },
          { $project: { date: '$_id', itemsCreated: 1, _id: 0 } },
        ],
      };

      const pipeline: mongoose.PipelineStage[] = [{ $match: matchCriteria }, { $facet: facet }];

      const result = await KnowledgeItemModel.aggregate(pipeline);

      logger.info(result, `Analytics performed by user ${userId}`);

      return {
        result,
        message: 'Analytics completed successfully',
        status: 200,
      };
    } catch (error) {
      logger.error(error, 'Error during analytics operation');
      return {
        result: {},
        message: 'An error occurred during the analytics operation.',
        status: 500,
      };
    }
  }
}
