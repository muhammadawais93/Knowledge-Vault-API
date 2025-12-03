module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.spec.ts'],
  globalSetup: './tests/setup/globalSetup.ts',
  globalTeardown: './tests/setup/globalTeardown.ts',
  setupFiles: ['./tests/setup/env.ts'],
  setupFilesAfterEnv: ['./tests/setup/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    // Exclude files that don't need unit tests
    '!src/index.ts', // Application bootstrap
    '!src/app.ts', // Express app setup
    '!src/config.ts', // Simple configuration
    '!src/swagger.ts', // Swagger configuration
    '!src/routes/**/*.ts', // Route definitions
    '!src/types/**/*.ts', // Type definitions only
    '!src/models/**/*.ts', // Mongoose schemas
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 30000, // 30 seconds
};
