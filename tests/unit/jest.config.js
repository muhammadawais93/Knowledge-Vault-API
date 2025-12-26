const baseConfig = require('../../jest.base.config');

module.exports = {
  ...baseConfig,
  testMatch: ['**/tests/unit/**/*.test.ts'],
  maxWorkers: '50%',
  coverageDirectory: 'coverage/unit',
};
