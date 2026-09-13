import { getFairDays } from './countdown';

describe('getFairDays', () => {
  test('lists every day of the edition with Norwegian weekdays', () => {
    expect(getFairDays('2026-09-11', '2026-09-12')).toEqual([
      { date: '2026-09-11', dayOfMonth: 11, weekday: 'fredag' },
      { date: '2026-09-12', dayOfMonth: 12, weekday: 'lørdag' },
    ]);
  });

  test('falls back to a single day when the end date is missing', () => {
    expect(getFairDays('2026-09-14')).toEqual([
      { date: '2026-09-14', dayOfMonth: 14, weekday: 'mandag' },
    ]);
    expect(getFairDays('2026-09-14', null)).toHaveLength(1);
    expect(getFairDays('2026-09-14', '')).toHaveLength(1);
  });

  test('crosses a month boundary without losing a day', () => {
    expect(getFairDays('2026-09-29', '2026-10-02').map((d) => d.date)).toEqual([
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
    ]);
  });

  test('keeps weekdays correct across the daylight-saving change', () => {
    // Europe/Oslo leaves summer time on 2026-10-25.
    expect(getFairDays('2026-10-24', '2026-10-26')).toEqual([
      { date: '2026-10-24', dayOfMonth: 24, weekday: 'lørdag' },
      { date: '2026-10-25', dayOfMonth: 25, weekday: 'søndag' },
      { date: '2026-10-26', dayOfMonth: 26, weekday: 'mandag' },
    ]);
  });

  test('ignores an end date before the start and caps a broken range', () => {
    expect(getFairDays('2026-09-14', '2026-09-01')).toEqual([
      { date: '2026-09-14', dayOfMonth: 14, weekday: 'mandag' },
    ]);
    expect(getFairDays('2026-09-01', '2027-09-01')).toHaveLength(7);
  });

  test('returns nothing without a usable start date', () => {
    expect(getFairDays('')).toEqual([]);
    expect(getFairDays('not-a-date')).toEqual([]);
  });
});
