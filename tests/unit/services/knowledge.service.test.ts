import KnowledgeService from '../../../src/services/knowledge.service';
import { KnowledgeItemModel } from '../../../src/models/KnowledgeItem';
import getKnowledgeItemsResult from '../fixtures/knowledge/get-knowledge-items.json';
import getKnowledgeItemByIdResult from '../fixtures/knowledge/get-knowledge-item-by-id.json';
import createKnowledgeItemResult from '../fixtures/knowledge/create-knowledge-item.json';
import updateKnowledgeItemResult from '../fixtures/knowledge/update-knowledge-item.json';
import deleteKnowledgeItemResult from '../fixtures/knowledge/delete-knowledge-item.json';
import { CollectionModel } from '../../../src/models/Collection';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('../../../src/services/logger.service', () => require('../__mocks__/logger.service'));
describe('KnowledgeService', () => {
  const mockUserId = '68e032d10f69b12a4cc7715b';
  const knowledgeService = new KnowledgeService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests for getKnowledgeItems
  test('should get knowledge items for user', async () => {
    const mockKnowledgeItems = getKnowledgeItemsResult.knowledgeItems;
    jest.spyOn(KnowledgeItemModel, 'find').mockResolvedValue(mockKnowledgeItems);

    const result = await knowledgeService.getKnowledgeItems(mockUserId);

    expect(result.status).toBe(200);
    expect(result.message).toBe('Knowledge items retrieved successfully');
    expect(KnowledgeItemModel.find).toHaveBeenCalledWith({ userId: mockUserId });
    expect(result.knowledgeItems).toEqual(mockKnowledgeItems);
  });

  // Tests for getKnowledgeItemById
  test('should get knowledge item by ID and increment view count', async () => {
    const mockKnowledgeItemId = '68e2e41fc794fcfaefd19ee2';
    const mockKnowledgeItem = getKnowledgeItemByIdResult.knowledgeItem;
    jest.spyOn(KnowledgeItemModel, 'findOneAndUpdate').mockResolvedValue(mockKnowledgeItem);

    const result = await knowledgeService.getKnowledgeItemById(mockKnowledgeItemId, mockUserId);

    expect(result.status).toBe(200);
    expect(result.message).toBe('Knowledge item retrieved');
    expect(KnowledgeItemModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: mockKnowledgeItemId, userId: mockUserId },
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    expect(result.knowledgeItem).toEqual(mockKnowledgeItem);
  });

  test('should get knowledge item by ID with not found', async () => {
    const mockKnowledgeItemId = '68e2e41fc794fcfaefd19ee2';
    jest.spyOn(KnowledgeItemModel, 'findOneAndUpdate').mockResolvedValue(null);

    const result = await knowledgeService.getKnowledgeItemById(mockKnowledgeItemId, mockUserId);

    expect(result.status).toBe(404);
    expect(result.message).toBe('Knowledge item not found');
    expect(KnowledgeItemModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: mockKnowledgeItemId, userId: mockUserId },
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    expect(result.knowledgeItem).toEqual(null);
  });

  test('should handle error when getting knowledge item by ID', async () => {
    const mockDatabseError = new Error('Database error');
    jest.spyOn(KnowledgeItemModel, 'findOneAndUpdate').mockRejectedValue(mockDatabseError);

    const result = await knowledgeService.getKnowledgeItemById('', mockUserId);

    expect(result.status).toBe(500);
    expect(result.message).toBe('Error retrieving knowledge item');
    expect(result.knowledgeItem).toBeNull();
  });

  // Tests for createKnowledgeItem
  test('should handle create knowledge item without collection Id', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { collectionId, ...mockKnowledgeItem } = createKnowledgeItemResult.knowledgeItem;
    jest.spyOn(KnowledgeItemModel, 'create').mockResolvedValue(mockKnowledgeItem as any);

    const result = await knowledgeService.createKnowledgeItem(mockKnowledgeItem as any, mockUserId);

    expect(result.status).toBe(201);
    expect(result.message).toBe('Knowledge item created successfully');
    expect(result.knowledgeItem).toEqual(mockKnowledgeItem);
  });

  test('should handle create knowledge item with collection Id', async () => {
    const mockKnowledgeItem = createKnowledgeItemResult.knowledgeItem;
    const mockCollection = {
      _id: '68e6b9868522c143d2c8b4d4',
      userId: '68e032d10f69b12a4cc7715b',
      name: 'laravel Best Practices',
      description: 'Collection of laravel patterns and anti-patterns',
      isPrivate: true,
      itemCount: 2,
      createdAt: '2025-10-05T13:04:56.461Z',
      updatedAt: '2025-11-08T00:13:50.364Z',
    };
    jest.spyOn(KnowledgeItemModel, 'create').mockResolvedValue(mockKnowledgeItem as any);
    jest.spyOn(CollectionModel, 'findOneAndUpdate').mockResolvedValue(mockCollection as any);

    const result = await knowledgeService.createKnowledgeItem(mockKnowledgeItem as any, mockUserId);

    expect(result.status).toBe(201);
    expect(result.message).toBe('Knowledge item created successfully');
    expect(result.knowledgeItem).toEqual(mockKnowledgeItem);
    expect(result.collection).toEqual(mockCollection);
  });

  test('should handle error when creating knowledge item', async () => {
    jest.spyOn(KnowledgeItemModel, 'create').mockRejectedValue(null);

    const result = await knowledgeService.createKnowledgeItem({} as any, mockUserId);

    expect(result.status).toBe(400);
    expect(result.message).toBe('Invalid knowledge item payload');
    expect(result.knowledgeItem).toBeNull();
  });

  // Tests for updateKnowledgeItem
  test('should handle update knowledge item', async () => {
    const mockKnowledgeItem = updateKnowledgeItemResult.knowledgeItem;
    jest.spyOn(KnowledgeItemModel, 'findOneAndUpdate').mockResolvedValue(mockKnowledgeItem as any);

    const result = await knowledgeService.updateKnowledgeItem(mockKnowledgeItem._id, mockUserId, mockKnowledgeItem as any);

    expect(result.status).toBe(200);
    expect(result.message).toBe('Knowledge item updated successfully');
    expect(result.knowledgeItem).toEqual(mockKnowledgeItem);
  });

  test('should handle knowledge item not found during update', async () => {
    const mockKnowledgeItemId = '68e2e41fc794fcfaefd19ee2';
    jest.spyOn(KnowledgeItemModel, 'findOneAndUpdate').mockResolvedValue(null);

    const result = await knowledgeService.updateKnowledgeItem(mockKnowledgeItemId, mockUserId, { title: 'Updated Title' } as any);

    expect(result.status).toBe(404);
    expect(result.message).toBe('Knowledge item not found');
    expect(result.knowledgeItem).toBeNull();
  });

  // Tests for deleteKnowledgeItem
  test('should handle delete knowledge item', async () => {
    const mockDeletedKnowledgeItem = deleteKnowledgeItemResult.knowledgeItem;
    jest.spyOn(KnowledgeItemModel, 'findOneAndDelete').mockResolvedValue(mockDeletedKnowledgeItem as any);

    const result = await knowledgeService.deleteKnowledgeItem(mockDeletedKnowledgeItem._id, mockUserId);

    expect(result.status).toBe(200);
    expect(result.message).toBe('Knowledge item deleted successfully');
    expect(result.knowledgeItem).toEqual(mockDeletedKnowledgeItem);
  });
});
