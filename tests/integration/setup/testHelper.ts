import { KnowledgeItemModel } from '../../../src/models/KnowledgeItem';
import { UserModel } from '../../../src/models/User';
import { CollectionModel } from '../../../src/models/Collection';
import jwt from 'jsonwebtoken';
import config from '../../../src/config';

export class TestHelper {
  static async createTestUser() {
    const testUser = await UserModel.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      role: 'user',
      passwordHash: 'hashedpassword',
    });

    const validToken = jwt.sign(
      {
        id: testUser._id.toString(),
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        role: 'user',
      },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    return { testUserId: testUser._id.toString(), validToken };
  }

  static async createTestCollection(testUserId: string) {
    const testCollection = await CollectionModel.create({
      name: 'Test Collection',
      description: 'A collection for testing',
      isPrivate: false,
      userId: testUserId,
    });

    return testCollection._id.toString();
  }

  static async createTestKnowledgeItem(testUserId: string, testCollectionId: string) {
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

    const insertedKnowledgeItems = await KnowledgeItemModel.insertMany(knowledgeItems);

    return insertedKnowledgeItems.map((item) => item._id.toString());
  }
}
