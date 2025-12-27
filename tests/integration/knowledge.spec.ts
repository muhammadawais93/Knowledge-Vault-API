import request from 'supertest';
import { TestHelper } from './setup/testHelper';

describe('knowledge API Integration Tests', () => {
  let validToken: string;
  let testUserId: string;
  let testCollectionId: string;
  let testKnowledgeItems: string[];

  beforeEach(async () => {
    const testUser = await TestHelper.createTestUser();
    validToken = testUser.validToken;
    testUserId = testUser.testUserId;
    testCollectionId = await TestHelper.createTestCollection(testUserId);

    testKnowledgeItems = await TestHelper.createTestKnowledgeItem(testUserId, testCollectionId);
  });

  describe('GET, POST, PUT, DELETE /api/knowledge', () => {
    test('should return knowledge items for the user', async () => {
      const response = await request(global.__APP__).get('/api/knowledge').set('Authorization', `Bearer ${validToken}`).expect(200);

      expect(response.body).toHaveProperty('knowledgeItems');
      expect(Array.isArray(response.body.knowledgeItems)).toBe(true);
      expect(response.body.knowledgeItems).toHaveLength(3);
    });

    test('should return single knowledge item for the user', async () => {
      const response = await request(global.__APP__)
        .get(`/api/knowledge/${testKnowledgeItems[0]}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('knowledgeItem');
      expect(response.body.knowledgeItem).toHaveProperty('_id', testKnowledgeItems[0]);
      expect(response.body.knowledgeItem).toHaveProperty('tags', expect.any(Array));
      expect(response.body.knowledgeItem).toHaveProperty('collectionId', testCollectionId);
    });

    test('should create the knowledge item', async () => {
      const newKnowledgeItem = {
        type: 'note',
        title: 'Laravel Eloquent Query Optimization',
        language: 'php',
        collectionId: testCollectionId,
        tags: ['laravel', 'eloquent', 'performance', 'php', 'database'],
        isPrivate: false,
      };

      const response = await request(global.__APP__)
        .post('/api/knowledge')
        .set('Authorization', `Bearer ${validToken}`)
        .send(newKnowledgeItem)
        .expect(201);

      expect(response.body).toHaveProperty('knowledgeItem');
      expect(response.body.knowledgeItem).toHaveProperty('title', newKnowledgeItem.title);
      expect(response.body.knowledgeItem).toHaveProperty('tags', newKnowledgeItem.tags);
      expect(response.body.knowledgeItem).toHaveProperty('collectionId', testCollectionId);
    });

    test('should update the knowledge item', async () => {
      const updateKnowledgeItem = {
        title: 'Updated JavaScript Basics',
        tags: ['javascript', 'programming', 'web', 'updated'],
      };

      const response = await request(global.__APP__)
        .put(`/api/knowledge/${testKnowledgeItems[0]}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateKnowledgeItem)
        .expect(200);

      expect(response.body).toHaveProperty('knowledgeItem');
      expect(response.body.knowledgeItem).toHaveProperty('title', updateKnowledgeItem.title);
      expect(response.body.knowledgeItem).toHaveProperty('tags', updateKnowledgeItem.tags);
    });

    test('should delete the knowledge item', async () => {
      const response = await request(global.__APP__)
        .delete(`/api/knowledge/${testKnowledgeItems[0]}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Knowledge item deleted successfully');

      // Verify deletion
      await request(global.__APP__).get(`/api/knowledge/${testKnowledgeItems[0]}`).set('Authorization', `Bearer ${validToken}`).expect(404);
    });
  });
});
