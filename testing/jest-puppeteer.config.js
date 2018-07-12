module.exports = {
  server: {
    command: 'yarn start',
    port: 3000
  },
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false'
  }
};
