import request from 'supertest';
import { TestHelper } from './setup/testHelper';

describe('Analytics API Integration Tests', () => {
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

  describe('GET /api/analytics', () => {
    test('should return analytics data for the user', async () => {
      const response = await request(global.__APP__).get('/api/analytics').set('Authorization', `Bearer ${validToken}`).expect(200);

      const analytics = response.body.result[0];

      // Validate structure
      expect(analytics).toHaveProperty('totalItems');
      expect(analytics).toHaveProperty('itemsByType');
      expect(analytics).toHaveProperty('topTags');
      expect(analytics).toHaveProperty('mostViewedItems');

      // Validate totalItems structure
      expect(Array.isArray(analytics.totalItems)).toBe(true);
      expect(analytics.totalItems[0]).toHaveProperty('count');
      expect(typeof analytics.totalItems[0].count).toBe('number');

      // Validate itemsByType structure
      expect(Array.isArray(analytics.itemsByType)).toBe(true);
      if (analytics.itemsByType.length > 0) {
        expect(analytics.itemsByType[0]).toHaveProperty('count');
        expect(analytics.itemsByType[0]).toHaveProperty('type');
        expect(typeof analytics.itemsByType[0].count).toBe('number');
        expect(typeof analytics.itemsByType[0].type).toBe('string');
      }

      // Validate topTags structure
      expect(Array.isArray(analytics.topTags)).toBe(true);
      if (analytics.topTags.length > 0) {
        expect(analytics.topTags[0]).toHaveProperty('count');
        expect(analytics.topTags[0]).toHaveProperty('tag');
        expect(typeof analytics.topTags[0].count).toBe('number');
        expect(typeof analytics.topTags[0].tag).toBe('string');
      }

      // Validate mostViewedItems structure
      expect(Array.isArray(analytics.mostViewedItems)).toBe(true);
      if (analytics.mostViewedItems.length > 0) {
        expect(analytics.mostViewedItems[0]).toHaveProperty('itemsCreated');
        expect(analytics.mostViewedItems[0]).toHaveProperty('date');
        expect(typeof analytics.mostViewedItems[0].itemsCreated).toBe('number');
        expect(typeof analytics.mostViewedItems[0].date).toBe('string');
      }

      expect(analytics.totalItems[0].count).toBe(3);
    });

    test('should require authentication', async () => {
      const response = await request(global.__APP__).get('/api/analytics').expect(401);

      expect(response.body.message).toBe('No token provided');
    });
  });
});
