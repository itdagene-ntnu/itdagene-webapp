import { advanceReferenceTimestamp } from './useAdvancingReferenceTime';

describe('advancing event reference time', () => {
  it('advances from the server timestamp without trusting the browser clock', () => {
    expect(advanceReferenceTimestamp('2026-09-13T21:59:45.000Z', 30000)).toBe(
      '2026-09-13T22:00:15.000Z'
    );
  });

  it('never moves backwards when a monotonic timer reports a negative value', () => {
    expect(advanceReferenceTimestamp('2026-09-13T21:59:45.000Z', -1000)).toBe(
      '2026-09-13T21:59:45.000Z'
    );
  });
});
