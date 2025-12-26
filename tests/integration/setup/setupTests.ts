import express from 'express';
import App from '../../../src/app';
import mongoose from 'mongoose';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(global.__MONGO_URI__);
  }
  const expressApp = express();
  new App(expressApp);
  global.__APP__ = expressApp;
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  const collection = mongoose.connection.collections;
  for (const key in collection) {
    await collection[key].deleteMany({});
  }
});
