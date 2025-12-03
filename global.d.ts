import type { MongoMemoryServer } from 'mongodb-memory-server';

declare global {
  var __MONGO_URI__: string;
  var __MONGO_SERVER__: MongoMemoryServer;
  var __APP__: Application;
}

export {};
