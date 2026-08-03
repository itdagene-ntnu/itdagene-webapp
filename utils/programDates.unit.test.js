import { buildProgramDates, resolveInitialProgramDate } from './programDates';

describe('program date helpers', () => {
  it('builds sorted unique program dates from the published events', () => {
    expect(
      buildProgramDates([
        '2026-09-11',
        '2026-08-02',
        '2026-09-11',
        'not-a-date',
      ])
    ).toEqual(['2026-08-02', '2026-09-11']);
  });

  it('selects a queried program event even when it is outside the fair dates', () => {
    expect(
      resolveInitialProgramDate({
        programDates: ['2026-08-21', '2026-09-15'],
        queryEventDate: '2026-08-21',
        today: '2026-08-02',
      })
    ).toBe('2026-08-21');
  });

  it('selects today when it is a published program day', () => {
    expect(
      resolveInitialProgramDate({
        programDates: ['2026-08-21', '2026-09-15'],
        today: '2026-09-15',
      })
    ).toBe('2026-09-15');
  });
});
