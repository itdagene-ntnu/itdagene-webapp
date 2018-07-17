const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

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
    'About us page rendering',
    async () => {
      const response = await page.goto(baseUrl + '/om-itdagene');
      expect(response.status()).toBe(200);
    },
    16000
  );
  test(
    'Joblistings page rendering',
    async () => {
      const response = await page.goto(baseUrl + '/jobbannonser');
      expect(response.status()).toBe(200);
    },
    16000
  );
});
