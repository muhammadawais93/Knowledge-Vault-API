const baseConfig = require('../../jest.base.config');

module.exports = {
  ...baseConfig,
  maxWorkers: 1,
  testMatch: ['**/tests/integration/**/*.spec.ts'],
  globalSetup: './setup/globalSetup.ts',
  globalTeardown: './setup/globalTeardown.ts',
  setupFiles: ['./setup/env.ts'],
  setupFilesAfterEnv: ['./setup/setupTests.ts'],
  coverageDirectory: 'coverage/integration',
};
