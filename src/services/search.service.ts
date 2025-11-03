import { MatchCriteria, queryParams } from '../types/types';
import { KnowledgeItemModel } from '../models/KnowledgeItem';
import LoggerService from './logger.service';
import mongoose from 'mongoose';

const logger = LoggerService.getLogger();

export default class SearchService {
  public async search(query: queryParams, userId: string) {
    const { q, type, tags } = query;

    if (!q) {
      return {
        results: [],
        message: 'Query parameter "q" is required.',
        status: 400,
      };
    }

    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      const userHasRecords = await KnowledgeItemModel.exists({ userId: userObjectId });
      if (!userHasRecords) {
        return {
          results: [],
          message: 'No records found for the user.',
          status: 200,
        };
      }
      const matchCriteria: MatchCriteria = {
        userId: userObjectId,
        $text: { $search: q.trim() },
      };

      if (type) {
        matchCriteria.type = type;
      }

      if (tags && tags.length > 0) {
        const tagsArray = tags.split(',').map((tag: string) => tag.toLowerCase().trim());
        matchCriteria.tags = { $in: tagsArray };
      }

      const projection = {
        title: 1,
        content: 1,
        url: 1,
        programmingLanguage: 1,
        tags: 1,
        type: 1,
        updatedAt: 1,
        score: { $meta: 'textScore' },
      } as const;

      const pipeline: mongoose.PipelineStage[] = [{ $match: matchCriteria }, { $project: projection }, { $sort: { score: -1 } }];

      const results = await KnowledgeItemModel.aggregate(pipeline);

      logger.info(results, `Search performed by user ${userId} with query: ${q}`);

      return {
        results,
        message: 'Search completed successfully',
        status: 200,
      };
    } catch (error) {
      logger.error(error, 'Error during search operation');
      return {
        results: [],
        message: 'An error occurred during the search operation.',
        status: 500,
      };
    }
  }
}
