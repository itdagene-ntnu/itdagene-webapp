// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const port = Number(process.env.TEST_PORT || 3000);
const relayEndpoint =
  process.env.TEST_RELAY_ENDPOINT || 'https://itdagene.no/graphql';
const macChromePath =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const executablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  (process.platform === 'darwin' && fs.existsSync(macChromePath)
    ? macChromePath
    : undefined);

module.exports = {
  server: {
    command: 'yarn start',
    launchTimeout: 30000,
    options: {
      env: {
        ...process.env,
        PORT: String(port),
        RELAY_ENDPOINT: relayEndpoint,
      },
    },
    port,
  },
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false',
    timeout: 60000,
    ...(executablePath ? { executablePath } : {}),
  },
};
