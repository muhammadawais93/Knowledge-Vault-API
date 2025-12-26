module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: './tests/tsconfig.test.json',
      },
    ],
  },
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
