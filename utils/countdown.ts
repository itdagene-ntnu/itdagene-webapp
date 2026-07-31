export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

const norwegianMonths = [
  'januar',
  'februar',
  'mars',
  'april',
  'mai',
  'juni',
  'juli',
  'august',
  'september',
  'oktober',
  'november',
  'desember',
] as const;

export const formatAccessibleEventStart = (startDate: string): string => {
  const [year, month, day] = startDate.split('-').map(Number);
  return `${day}. ${norwegianMonths[month - 1]} ${year} kl. 10:00`;
};

export const getCountdownParts = (
  targetTimestamp: number,
  nowTimestamp: number
): CountdownParts => {
  const remaining = Math.max(0, targetTimestamp - nowTimestamp);
  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    completed: remaining === 0,
  };
};

export const getEventStartTimestamp = (startDate: string): number =>
  new Date(`${startDate}T10:00:00+02:00`).getTime();
