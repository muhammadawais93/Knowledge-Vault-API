module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/tests/**/*.test.ts'],
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
};
