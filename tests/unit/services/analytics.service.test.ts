import AnalyticsService from '../../../src/services/analytics.service';
import mongoose from 'mongoose';
import analyticsResult from '../fixtures/analytics.json';
import { KnowledgeItemModel } from '../../../src/models/KnowledgeItem';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('../../../src/services/logger.service', () => require('../__mocks__/logger.service'));

describe('AnalyticsService', () => {
  const mockUserId = '64a7b2f5c25e4b3f9c8e4d2a';
  const mockUserObjectId = new mongoose.Types.ObjectId(mockUserId);
  const analyticsService = new AnalyticsService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return analytics data when user has records', async () => {
    const mockAggregateResult = analyticsResult.result;

    jest.spyOn(KnowledgeItemModel, 'exists').mockResolvedValue({ userId: mockUserObjectId } as any);
    jest.spyOn(KnowledgeItemModel, 'aggregate').mockResolvedValue(mockAggregateResult);

    const result = await analyticsService.analytics(mockUserId);

    expect(result.status).toBe(200);
    expect(result.message).toBe('Analytics completed successfully');
    expect(result.result).toEqual(mockAggregateResult);
    expect(KnowledgeItemModel.exists).toHaveBeenCalledWith({ userId: mockUserObjectId });
    expect(KnowledgeItemModel.aggregate).toHaveBeenCalledTimes(1);
  });

  test('should return message when user has no records', async () => {
    jest.spyOn(KnowledgeItemModel, 'exists').mockResolvedValue(null);
    jest.spyOn(KnowledgeItemModel, 'aggregate').mockResolvedValue([]);

    const result = await analyticsService.analytics(mockUserId);

    expect(result.status).toBe(200);
    expect(result.message).toBe('No records found for the user.');
    expect(result.result).toEqual(undefined);
    expect(KnowledgeItemModel.exists).toHaveBeenCalledWith({ userId: mockUserObjectId });
    expect(KnowledgeItemModel.aggregate).not.toHaveBeenCalled();
  });

  test('should handle database error during exists check', async () => {
    const mockError = new Error('Database error');
    jest.spyOn(KnowledgeItemModel, 'exists').mockRejectedValue(mockError);

    const result = await analyticsService.analytics(mockUserId);

    expect(result.status).toBe(500);
    expect(result.result).toEqual({});
  });
});
