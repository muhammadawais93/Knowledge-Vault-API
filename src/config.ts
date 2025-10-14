import dotenv from 'dotenv';

dotenv.config();

const config = {
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  saltRounds: parseInt(process.env.SALT_ROUNDS as string) || 12,
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/knowledge-vault',
};

export default config;
