import supertest from 'supertest';
import { TestHelper } from './setup/testHelper';

describe('login API Integration Tests', () => {
  let testUserId: string;

  beforeEach(async () => {
    const testUser = await TestHelper.createTestUser();
    testUserId = testUser.testUserId;
  });

  describe('POST /api/auth/login', () => {
    test('should login the user and return a valid token', async () => {
      const response = await supertest(global.__APP__)
        .post('/api/auth/login')
        .send({ email: 'testuser@example.com', password: 'password123' })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.user).toHaveProperty('id', testUserId);
      expect(response.body.message).toBe('Login successful');
    });

    test('should fail to login with incorrect password', async () => {
      const response = await supertest(global.__APP__)
        .post('/api/auth/login')
        .send({ email: 'testuser@example.com', password: 'wrongpassword' })
        .expect(401);

      expect(response.body.user).toBeNull();
      expect(response.body.message).toBe('Invalid password');
    });
  });
});
