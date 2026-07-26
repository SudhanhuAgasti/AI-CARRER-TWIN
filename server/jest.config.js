/**
 * Jest configuration file.
 * Configured for isolated integration tests under Node.js.
 */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 20000, // 20 seconds maximum timeout per test
};
