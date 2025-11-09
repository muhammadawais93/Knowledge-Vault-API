import mongoose from 'mongoose';
import SearchService from '../../../src/services/search.service';
import { KnowledgeItemModel } from '../../../src/models/KnowledgeItem';
import searchResult from '../fixtures/search.json';
import { queryParams } from '../../../src/types/types';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('../../../src/services/logger.service', () => require('../__mocks__/logger.service'));

describe('SearchService', () => {
  const mockUserId = '64a7b2f5c25e4b3f9c8e4d2a';
  const mockUserObjectId = new mongoose.Types.ObjectId(mockUserId);
  const searchService = new SearchService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should search knowledge items', async () => {
    const mockResult = searchResult.results;
    const mockQuery = { q: 'hooks', type: 'note', tags: 'javascript,typescript' };
    jest.spyOn(KnowledgeItemModel, 'exists').mockResolvedValue({ userId: mockUserObjectId } as any);
    jest.spyOn(KnowledgeItemModel, 'aggregate').mockResolvedValue(mockResult);

    const result = await searchService.search(mockQuery, mockUserId);

    expect(result.status).toBe(200);
    expect(result.message).toEqual('Search completed successfully');
    expect(result.results).toEqual(mockResult);
    expect(KnowledgeItemModel.exists).toHaveBeenCalledWith({ userId: mockUserObjectId });
    expect(KnowledgeItemModel.aggregate).toHaveBeenCalledTimes(1);
  });

  test('should return message when no records found for user', async () => {
    const mockQuery = { q: 'hooks' };
    jest.spyOn(KnowledgeItemModel, 'exists').mockResolvedValue(null);

    const result = await searchService.search(mockQuery, mockUserId);

    expect(result.status).toBe(200);
    expect(result.message).toBe('No records found for the user.');
    expect(result.results).toEqual([]);
    expect(KnowledgeItemModel.exists).toHaveBeenCalledWith({ userId: mockUserObjectId });
  });

  test('should return 400 when query parameter "q" is missing', async () => {
    const result = await searchService.search({} as queryParams, mockUserId);

    expect(result.status).toBe(400);
    expect(result.message).toBe('Query parameter "q" is required.');
    expect(result.results).toEqual([]);
  });

  test('should return 500 when invalid userId is provided', async () => {
    const mockQuery = { q: 'hooks' };

    const result = await searchService.search(mockQuery, '');

    expect(result.status).toBe(500);
    expect(result.message).toBe('An error occurred during the search operation.');
    expect(result.results).toEqual([]);
  });
});
