import supertest from 'supertest';
import { TestHelper } from './setup/testHelper';

describe('Collection API Integration Tests', () => {
  let validToken: string;
  let testUserId: string;
  let testCollectionId: string;

  beforeEach(async () => {
    const testUser = await TestHelper.createTestUser();
    testUserId = testUser.testUserId;
    validToken = testUser.validToken;

    testCollectionId = await TestHelper.createTestCollection(testUserId);
    await TestHelper.createTestKnowledgeItem(testUserId, testCollectionId);
  });

  describe('GET, POST, PUT, DELETE /api/collections', () => {
    test('should return collections for the user', async () => {
      const response = await supertest(global.__APP__).get('/api/collections').set('Authorization', `Bearer ${validToken}`).expect(200);

      expect(response.body).toHaveProperty('collection');
      expect(Array.isArray(response.body.collection)).toBe(true);
      expect(response.body.collection.length).toBeGreaterThan(0);
    });

    test('should return single collection item for the user', async () => {
      const response = await supertest(global.__APP__)
        .get(`/api/collections/${testCollectionId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('collection');
      expect(response.body.collection).toHaveProperty('_id', testCollectionId);
      expect(response.body.collection).toHaveProperty('name', 'Test Collection');
    });

    test('should create the collection', async () => {
      const newCollection = {
        name: 'New Test Collection',
        description: 'A new collection for testing',
        isPrivate: false,
      };

      const response = await supertest(global.__APP__)
        .post('/api/collections')
        .set('Authorization', `Bearer ${validToken}`)
        .send(newCollection)
        .expect(201);

      expect(response.body).toHaveProperty('collection');
      expect(response.body.collection).toHaveProperty('name', newCollection.name);
      expect(response.body.collection).toHaveProperty('description', newCollection.description);
      expect(response.body.collection).toHaveProperty('isPrivate', newCollection.isPrivate);
    });

    test('should update the collection', async () => {
      const updatedCollection = {
        name: 'Updated Test Collection',
        description: 'An updated collection for testing',
        isPrivate: true,
      };

      const response = await supertest(global.__APP__)
        .put(`/api/collections/${testCollectionId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updatedCollection)
        .expect(200);

      expect(response.body).toHaveProperty('collection');
      expect(response.body.collection).toHaveProperty('name', updatedCollection.name);
      expect(response.body.collection).toHaveProperty('description', updatedCollection.description);
      expect(response.body.collection).toHaveProperty('isPrivate', updatedCollection.isPrivate);
    });

    test('should delete the collection', async () => {
      const response = await supertest(global.__APP__)
        .delete(`/api/collections/${testCollectionId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Collection deleted successfully');

      // verify the collection is deleted
      await supertest(global.__APP__).get(`/api/collections/${testCollectionId}`).set('Authorization', `Bearer ${validToken}`).expect(404);
    });
  });
});
