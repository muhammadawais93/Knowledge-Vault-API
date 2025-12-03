import request from 'supertest';
import { TestHelper } from '../setup/testHelper';

describe('Search API Integration Tests', () => {
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

  describe('GET /api/search', () => {
    test('should return search results for a valid query', async () => {
      const response = await request(global.__APP__)
        .get('/api/search')
        .query({ q: 'JavaScript' })
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results).toHaveLength(2);
    });

    test('should return empty results for non-matching query', async () => {
      const response = await request(global.__APP__)
        .get('/api/search')
        .query({ q: 'Python' })
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results).toHaveLength(0);
    });

    test('should require authentication', async () => {
      const response = await request(global.__APP__).get('/api/search').query({ q: 'JavaScript' }).expect(401);

      expect(response.body.message).toBe('No token provided');
    });

    test('should return search results for a valid query and tag', async () => {
      const response = await request(global.__APP__)
        .get('/api/search')
        .query({ q: 'web development', tag: 'backend' })
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results).toHaveLength(1);
    });
  });
});
