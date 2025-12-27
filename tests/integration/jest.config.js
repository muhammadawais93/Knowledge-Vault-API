const baseConfig = require('../../jest.base.config');

module.exports = {
  ...baseConfig,
  maxWorkers: 1,
  testMatch: ['**/tests/integration/**/*.spec.ts'],
  globalSetup: '<rootDir>/setup/globalSetup.ts',
  globalTeardown: '<rootDir>/setup/globalTeardown.ts',
  setupFiles: ['<rootDir>/setup/env.ts'],
  setupFilesAfterEnv: ['<rootDir>/setup/setupTests.ts'],
  coverageDirectory: 'coverage/integration',
};
