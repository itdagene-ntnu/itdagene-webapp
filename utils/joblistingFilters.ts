import { Variables } from 'react-relay';

// Shared by the filter panel (which shows how many are active) and the results
// list (which changes its empty state when any are). Sorting is deliberately
// excluded: it is not a filter, and the jobs page passes an empty array rather
// than undefined when no sort is chosen, which would always count as active.
export const countActiveFilters = (variables: Variables): number =>
  [
    Boolean(variables.type),
    Boolean(variables.company),
    Array.isArray(variables.towns) && variables.towns.length > 0,
    Number(variables.fromGrade) > 1 || Number(variables.toGrade) < 5,
  ].filter(Boolean).length;

export const hasActiveFilters = (variables: Variables): boolean =>
  countActiveFilters(variables) > 0;
