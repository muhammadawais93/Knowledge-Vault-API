const baseConfig = require('../../jest.base.config');

module.exports = {
  ...baseConfig,
  maxWorkers: 1,
  testMatch: ['**/tests/integration/**/*.spec.ts'],
  globalSetup: '<rootDir>/tests/integration/setup/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/integration/setup/globalTeardown.ts',
  setupFiles: ['<rootDir>/tests/integration/setup/env.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup/setupTests.ts'],
  coverageDirectory: 'coverage/integration',
};
