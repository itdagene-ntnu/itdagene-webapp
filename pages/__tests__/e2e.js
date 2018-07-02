import puppeteer from 'puppeteer';

const baseUrl = 'http://localhost:3000';

let page;
let browser;
const width = 1920;
const height = 1080;
const DEBUG = process.env.DEBUG;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: !DEBUG,
    slowMo: DEBUG ? 500 : 0,
    args: [
      `--window-size=${width},${height}`,
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});
afterAll(() => {
  browser.close();
});
describe('Page rendering', () => {
  test(
    'Frontpage page rendering',
    async () => {
      const response = await page.goto(baseUrl);
      expect(response.status()).toBe(200);
    },
    16000
  );
  test(
    'Joblistings page rendering',
    async () => {
      const response = await page.goto(baseUrl + '/joblistings');
      expect(response.status()).toBe(200);
    },
    16000
  );
});
