const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

describe('Page rendering', () => {
  test('Frontpage page rendering', async () => {
    const response = await page.goto(baseUrl);
    expect(response.status()).toBe(200);
  }, 16000);

  test('About us page rendering', async () => {
    const response = await page.goto(baseUrl + '/om-itdagene');
    expect(response.status()).toBe(200);
  }, 16000);

  test('Program page rendering', async () => {
    const response = await page.goto(baseUrl + '/program');
    expect(response.status()).toBe(200);
  }, 16000);

  test('Joblistings page rendering', async () => {
    const response = await page.goto(baseUrl + '/jobb');
    expect(response.status()).toBe(200);
  }, 16000);

  test('Joblistings w/orderBy rendering', async () => {
    const orders = {
      deadline: 'DEADLINE',
      created: 'CREATED',
      company_name: 'COMPANY_NAME',
      type: 'TYPE'
    };

    const deadline = await page.goto(
      `${baseUrl}/jobb?orderBy=${orders.deadline}`
    );
    const created = await page.goto(
      `${baseUrl}/jobb?orderBy=${orders.created}`
    );
    const company_name = await page.goto(
      `${baseUrl}/jobb?orderBy=${orders.company_name}`
    );
    const type = await page.goto(`${baseUrl}/jobb?orderBy=${orders.type}`);
    expect(deadline.status()).toBe(200);
    expect(created.status()).toBe(200);
    expect(company_name.status()).toBe(200);
    expect(type.status()).toBe(200);
  }, 16000);

  test('Joblistings w/type rendering', async () => {
    const types = {
      empty: '',
      fulltime: 'pp',
      summerintership: 'si'
    };

    const empty = await page.goto(`${baseUrl}/jobb?type=${types.empty}`);
    const fulltime = await page.goto(`${baseUrl}/jobb?type=${types.fulltime}`);
    const summerintership = await page.goto(
      `${baseUrl}/jobb?type=${types.summerintership}`
    );
    expect(empty.status()).toBe(200);
    expect(fulltime.status()).toBe(200);
    expect(summerintership.status()).toBe(200);
  }, 16000);

  test('Joblistings combined query rendering', async () => {
    const response = await page.goto(
      baseUrl + '/jobb?orderBy=DEADLINE&type=pp&fromYear=1&toYear=4'
    );
    expect(response.status()).toBe(200);
  }, 16000);
});
