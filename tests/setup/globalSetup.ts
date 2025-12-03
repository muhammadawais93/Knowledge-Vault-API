import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  global.__MONGO_URI__ = mongoUri;
  global.__MONGO_SERVER__ = mongoServer;
}
