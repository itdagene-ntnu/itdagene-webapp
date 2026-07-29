import {
  getCountdownParts,
  getEventStartTimestamp,
} from '../../utils/countdown';

describe('event countdown', () => {
  it('counts down to the configured 10:00 event opening', () => {
    expect(getEventStartTimestamp('2026-09-14')).toBe(
      new Date('2026-09-14T10:00:00+02:00').getTime()
    );
  });

  it('splits a remaining duration into stable units', () => {
    const target = Date.UTC(2026, 8, 14, 8, 0, 0);
    const now = target - (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000;

    expect(getCountdownParts(target, now)).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
      completed: false,
    });
  });

  it('never returns negative values after the event starts', () => {
    expect(getCountdownParts(1000, 2000)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      completed: true,
    });
  });
});
