module.exports = {
  rootDir: '..',
  testEnvironment: 'node',
  testMatch: ['**/*.unit.test.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
