import { setNotFoundWhenFieldIsNull } from './httpStatus';

describe('dynamic route HTTP status', () => {
  it('marks an explicit null detail field as not found', () => {
    const response = { statusCode: 200 };

    setNotFoundWhenFieldIsNull({
      response,
      queryProps: { joblisting: null },
      field: 'joblisting',
    });

    expect(response.statusCode).toBe(404);
  });

  it('does not turn a missing query response from an outage into a 404', () => {
    const response = { statusCode: 200 };

    setNotFoundWhenFieldIsNull({
      response,
      queryProps: {},
      field: 'joblisting',
    });

    expect(response.statusCode).toBe(200);
  });
});
