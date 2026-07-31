module.exports = {
  rootDir: '..',
  testEnvironment: 'node',
  testMatch: ['**/*.unit.test.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/.next-dev/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
