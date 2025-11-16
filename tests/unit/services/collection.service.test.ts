import CollectionService from '../../../src/services/collection.service';
import { CollectionModel } from '../../../src/models/Collection';
import { KnowledgeItemModel } from '../../../src/models/KnowledgeItem';
import getCollectionsResult from '../fixtures/collections/get-collections.json';
import getCollectionByIdResult from '../fixtures/collections/get-collection-by-id.json';
import createCollectionResult from '../fixtures/collections/create-collection.json';
import updateCollectionResult from '../fixtures/collections/update-collection.json';
import deleteCollectionResult from '../fixtures/collections/delete-collection.json';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('../../../src/services/logger.service', () => require('../__mocks__/logger.service'));

describe('CollectionService', () => {
  const mockUserId = '68e032d10f69b12a4cc7715b';
  const mockCollectionId = '68e6b9868522c143d2c8b4d4';
  const collectionService = new CollectionService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests for getAllCollection
  describe('getAllCollection', () => {
    test('should get all collections for user', async () => {
      const mockCollections = getCollectionsResult.collection;
      jest.spyOn(CollectionModel, 'find').mockResolvedValue(mockCollections);

      const result = await collectionService.getAllCollection(mockUserId);

      expect(result.status).toBe(200);
      expect(result.message).toBe('Collections fetched successfully');
      expect(CollectionModel.find).toHaveBeenCalledWith({ userId: mockUserId });
      expect(result.collections).toEqual(mockCollections);
    });

    test('should handle error when getting collections', async () => {
      const mockDatabaseError = new Error('Database error');
      jest.spyOn(CollectionModel, 'find').mockRejectedValue(mockDatabaseError);

      const result = await collectionService.getAllCollection(mockUserId);

      expect(result.status).toBe(500);
      expect(result.message).toBe('Error fetching collections');
      expect(result.collections).toBeNull();
    });
  });

  // Tests for getCollectionById
  describe('getCollectionById', () => {
    test('should get collection by ID', async () => {
      const mockCollection = getCollectionByIdResult.collection;
      jest.spyOn(CollectionModel, 'findOne').mockResolvedValue(mockCollection);

      const result = await collectionService.getCollectionById(mockCollectionId, mockUserId);

      expect(result.status).toBe(200);
      expect(result.message).toBe('Collection fetched successfully');
      expect(CollectionModel.findOne).toHaveBeenCalledWith({ _id: mockCollectionId, userId: mockUserId });
      expect(result.collection).toEqual(mockCollection);
    });

    test('should return not found when collection does not exist', async () => {
      jest.spyOn(CollectionModel, 'findOne').mockResolvedValue(null);

      const result = await collectionService.getCollectionById(mockCollectionId, mockUserId);

      expect(result.status).toBe(404);
      expect(result.message).toBe('Collection not found');
      expect(CollectionModel.findOne).toHaveBeenCalledWith({ _id: mockCollectionId, userId: mockUserId });
      expect(result.collection).toBeNull();
    });

    test('should handle error when getting collection by ID', async () => {
      const mockDatabaseError = new Error('Database error');
      jest.spyOn(CollectionModel, 'findOne').mockRejectedValue(mockDatabaseError);

      const result = await collectionService.getCollectionById(mockCollectionId, mockUserId);

      expect(result.status).toBe(500);
      expect(result.message).toBe('Error fetching collection by ID');
      expect(result.collection).toBeNull();
    });
  });

  // Tests for createCollection
  describe('createCollection', () => {
    const validCollectionPayload = {
      name: 'React Development',
      description: 'A collection of React development resources, tutorials, and best practices',
      isPrivate: false,
    };

    test('should create collection with valid payload', async () => {
      const mockCreatedCollection = createCollectionResult.collection;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(CollectionModel, 'create').mockResolvedValue(mockCreatedCollection as any);

      const result = await collectionService.createCollection(validCollectionPayload, mockUserId);

      expect(result.status).toBe(201);
      expect(result.message).toBe('Collection created successfully');
      expect(CollectionModel.create).toHaveBeenCalledWith({
        userId: mockUserId,
        name: validCollectionPayload.name,
        description: validCollectionPayload.description,
        isPrivate: validCollectionPayload.isPrivate,
      });
      expect(result.collection).toEqual(mockCreatedCollection);
    });

    test('should return error for invalid payload - missing name', async () => {
      const invalidPayload = {
        name: '',
        description: 'Valid description',
        isPrivate: false,
      };

      const result = await collectionService.createCollection(invalidPayload, mockUserId);

      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid collection payload');
      expect(result.collection).toBeNull();
    });

    test('should return error for invalid payload - missing description', async () => {
      const invalidPayload = {
        name: 'Valid Name',
        description: '',
        isPrivate: false,
      };

      const result = await collectionService.createCollection(invalidPayload, mockUserId);

      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid collection payload');
      expect(result.collection).toBeNull();
    });

    test('should return error for invalid payload - invalid isPrivate', async () => {
      const invalidPayload = {
        name: 'Valid Name',
        description: 'Valid description',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isPrivate: 'not-boolean' as any,
      };

      const result = await collectionService.createCollection(invalidPayload, mockUserId);

      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid collection payload');
      expect(result.collection).toBeNull();
    });

    test('should handle error when creating collection', async () => {
      const mockDatabaseError = new Error('Database error');
      jest.spyOn(CollectionModel, 'create').mockRejectedValue(mockDatabaseError);

      const result = await collectionService.createCollection(validCollectionPayload, mockUserId);

      expect(result.status).toBe(500);
      expect(result.message).toBe('Error creating collection');
      expect(result.collection).toBeNull();
    });
  });

  // Tests for updateCollection
  describe('updateCollection', () => {
    const updatePayload = {
      name: 'React Development - Advanced',
      description: 'An updated collection of advanced React development resources',
      isPrivate: true,
    };

    test('should update collection successfully', async () => {
      const mockUpdatedCollection = updateCollectionResult.collection;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(CollectionModel, 'findOneAndUpdate').mockResolvedValue(mockUpdatedCollection as any);

      const result = await collectionService.updateCollection(mockCollectionId, mockUserId, updatePayload);

      expect(result.status).toBe(200);
      expect(result.message).toBe('Collection updated successfully');
      expect(CollectionModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: mockCollectionId, userId: mockUserId }, updatePayload, { new: true });
      expect(result.collection).toEqual(mockUpdatedCollection);
    });

    test('should return not found when updating non-existent collection', async () => {
      jest.spyOn(CollectionModel, 'findOneAndUpdate').mockResolvedValue(null);

      const result = await collectionService.updateCollection(mockCollectionId, mockUserId, updatePayload);

      expect(result.status).toBe(404);
      expect(result.message).toBe('Collection not found');
      expect(result.collection).toBeNull();
    });

    test('should handle error when updating collection', async () => {
      const mockDatabaseError = new Error('Database error');
      jest.spyOn(CollectionModel, 'findOneAndUpdate').mockRejectedValue(mockDatabaseError);

      const result = await collectionService.updateCollection(mockCollectionId, mockUserId, updatePayload);

      expect(result.status).toBe(500);
      expect(result.message).toBe('Error updating collection');
      expect(result.collection).toBeNull();
    });
  });

  // Tests for deleteCollection
  describe('deleteCollection', () => {
    test('should delete collection successfully', async () => {
      const mockDeletedCollection = deleteCollectionResult.collection;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(KnowledgeItemModel, 'updateMany').mockResolvedValue({} as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(CollectionModel, 'findOneAndDelete').mockResolvedValue(mockDeletedCollection as any);

      const result = await collectionService.deleteCollection(mockCollectionId, mockUserId);

      expect(result.status).toBe(200);
      expect(result.message).toBe('Collection deleted successfully');
      expect(KnowledgeItemModel.updateMany).toHaveBeenCalledWith(
        { collectionId: mockCollectionId, userId: mockUserId },
        { $unset: { collectionId: '' } }
      );
      expect(CollectionModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: mockCollectionId,
        userId: mockUserId,
      });
      expect(result.collection).toEqual(mockDeletedCollection);
    });

    test('should return not found when deleting non-existent collection', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(KnowledgeItemModel, 'updateMany').mockResolvedValue({} as any);
      jest.spyOn(CollectionModel, 'findOneAndDelete').mockResolvedValue(null);

      const result = await collectionService.deleteCollection(mockCollectionId, mockUserId);

      expect(result.status).toBe(404);
      expect(result.message).toBe('Collection not found');
      expect(result.collection).toBeNull();
    });

    test('should handle error when deleting collection', async () => {
      const mockDatabaseError = new Error('Database error');
      jest.spyOn(KnowledgeItemModel, 'updateMany').mockRejectedValue(mockDatabaseError);

      const result = await collectionService.deleteCollection(mockCollectionId, mockUserId);

      expect(result.status).toBe(500);
      expect(result.message).toBe('Error deleting collection');
      expect(result.collection).toBeNull();
    });
  });
});
