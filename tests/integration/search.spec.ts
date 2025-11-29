import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import App from '../../src/app';
import express from 'express';
import { KnowledgeItemModel } from '../../src/models/KnowledgeItem';
import { UserModel } from '../../src/models/User';
import { CollectionModel } from '../../src/models/Collection';
import config from '../../src/config';

describe('Search API Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let validToken: string;
  let testUserId: string;
  let testCollectionId: string;
  let expressApp = express();

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    expressApp = express();
    new App(expressApp);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await CollectionModel.deleteMany({});
    await KnowledgeItemModel.deleteMany({});

    const testUser = await UserModel.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      role: 'user',
      passwordHash: 'hashedpassword',
    });

    testUserId = testUser._id.toString();

    const testCollection = await CollectionModel.create({
      name: 'Test Collection',
      description: 'A collection for testing',
      isPrivate: false,
      userId: testUserId,
    });

    testCollectionId = testCollection._id.toString();

    validToken = jwt.sign(
      {
        id: testUserId,
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        role: 'user',
      },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    const knowledgeItems = [
      {
        title: 'JavaScript Basics',
        content: 'JavaScript is a programming language used for web development',
        tags: ['javascript', 'programming', 'web'],
        type: 'note',
        collectionId: testCollectionId,
        userId: testUserId,
      },
      {
        title: 'React Components',
        content: 'React components are reusable pieces of UI code',
        tags: ['react', 'frontend', 'components'],
        type: 'note',
        collectionId: testCollectionId,
        userId: testUserId,
      },
      {
        title: 'Node.js Server',
        content: 'Node.js allows you to run JavaScript on the server side',
        tags: ['nodejs', 'backend', 'javascript'],
        type: 'note',
        collectionId: testCollectionId,
        userId: testUserId,
      },
    ];

    await KnowledgeItemModel.insertMany(knowledgeItems);
  });

  describe('GET /api/search', () => {
    test('should return search results for a valid query', async () => {
      const response = await request(expressApp)
        .get('/api/search')
        .query({ q: 'JavaScript' })
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results).toHaveLength(2);
    });

    test('should return empty results for non-matching query', async () => {
      const response = await request(expressApp).get('/api/search').query({ q: 'Python' }).set('Authorization', `Bearer ${validToken}`).expect(200);

      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results).toHaveLength(0);
    });

    test('should require authentication', async () => {
      const response = await request(expressApp).get('/api/search').query({ q: 'JavaScript' }).expect(401);

      expect(response.body.message).toBe('No token provided');
    });

    test('should return search results for a valid query and tag', async () => {
      const response = await request(expressApp)
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
