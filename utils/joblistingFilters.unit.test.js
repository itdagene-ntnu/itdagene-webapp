import { countActiveFilters, hasActiveFilters } from './joblistingFilters';

// The jobs page builds these variables from the query string.
const defaults = {
  type: '',
  company: '',
  towns: [],
  fromGrade: 1,
  toGrade: 5,
  orderBy: [],
  count: 30,
};

describe('joblisting filters', () => {
  test('an untouched page has no active filters', () => {
    expect(countActiveFilters(defaults)).toBe(0);
    expect(hasActiveFilters(defaults)).toBe(false);
  });

  test('sorting is not a filter', () => {
    expect(
      countActiveFilters({ ...defaults, orderBy: ['DEADLINE', 'ID'] })
    ).toBe(0);
  });

  test('counts each filter the visitor actually set', () => {
    expect(countActiveFilters({ ...defaults, type: 'si' })).toBe(1);
    expect(countActiveFilters({ ...defaults, company: 'Q29tcGFueTox' })).toBe(
      1
    );
    expect(countActiveFilters({ ...defaults, towns: ['Trondheim'] })).toBe(1);
    expect(countActiveFilters({ ...defaults, fromGrade: 3 })).toBe(1);
    expect(countActiveFilters({ ...defaults, toGrade: 4 })).toBe(1);
  });

  test('a narrowed grade range counts once, not twice', () => {
    expect(countActiveFilters({ ...defaults, fromGrade: 2, toGrade: 4 })).toBe(
      1
    );
  });

  test('adds up across groups', () => {
    expect(
      countActiveFilters({
        ...defaults,
        type: 'si',
        towns: ['Oslo'],
        fromGrade: 3,
      })
    ).toBe(3);
    expect(hasActiveFilters({ ...defaults, type: 'si' })).toBe(true);
  });
});
