type InitialProgramDateOptions = {
  programDates: string[];
  queryEventDate?: string;
  today: string;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isIsoDate = (value: string): boolean => {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
};

export const buildProgramDates = (eventDates: string[]): string[] =>
  Array.from(new Set(eventDates.filter(isIsoDate))).sort((a, b) =>
    a.localeCompare(b)
  );

export const resolveInitialProgramDate = ({
  programDates,
  queryEventDate,
  today,
}: InitialProgramDateOptions): string => {
  if (queryEventDate && programDates.includes(queryEventDate)) {
    return queryEventDate;
  }
  if (programDates.includes(today)) return today;
  return programDates[0] || '';
};
