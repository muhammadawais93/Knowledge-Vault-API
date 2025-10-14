import express from 'express';
import mongoose from 'mongoose';
import App from './app';
import config from './config';

console.log('Environment loaded:', process.env.NODE_ENV);

const app = express();
new App(app);

app.listen(config.port, () => {
  console.log(`🚀 Server is running on port ${config.port}`);
  console.log(`📍 Health check: http://localhost:${config.port}`);
});

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('📦 MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });
