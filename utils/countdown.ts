import { Dayjs } from 'dayjs';
import { eventLocalTime } from './eventTime';

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

const norwegianWeekdays = [
  'søndag',
  'mandag',
  'tirsdag',
  'onsdag',
  'torsdag',
  'fredag',
  'lørdag',
] as const;

const eventStart = (startDate: string, startTime = '10:00:00'): Dayjs =>
  eventLocalTime(`${startDate}T${startTime}`);

export type FairDay = {
  date: string;
  dayOfMonth: number;
  weekday: string;
};

// A published edition is a handful of consecutive days. The cap only stops a
// mistyped end date from rendering an unbounded row across the hero.
const MAX_FAIR_DAYS = 7;

export const getFairDays = (
  startDate: string,
  endDate?: string | null
): FairDay[] => {
  if (!startDate) return [];

  const toUtc = (value: string): number | null => {
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return null;
    return Date.UTC(year, month - 1, day);
  };

  const start = toUtc(startDate);
  if (start === null) return [];
  const end = endDate ? toUtc(endDate) ?? start : start;

  const days: FairDay[] = [];
  // Fixed UTC noon steps, so the weekday never drifts across a DST boundary.
  for (
    let stamp = start;
    stamp <= Math.max(start, end) && days.length < MAX_FAIR_DAYS;
    stamp += 86400000
  ) {
    const date = new Date(stamp);
    days.push({
      date: date.toISOString().slice(0, 10),
      dayOfMonth: date.getUTCDate(),
      weekday: norwegianWeekdays[date.getUTCDay()],
    });
  }
  return days;
};

export const formatAccessibleEventStart = (
  startDate: string,
  startTime = '10:00:00'
): string => {
  const [year, month, day] = startDate.split('-').map(Number);
  return `${day}. ${norwegianMonths[month - 1]} ${year} kl. ${eventStart(
    startDate,
    startTime
  ).format('HH:mm')}`;
};

export const formatEventStartDateTime = (
  startDate: string,
  startTime = '10:00:00'
): string => eventStart(startDate, startTime).format('YYYY-MM-DDTHH:mm:ssZ');

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

export const getEventStartTimestamp = (
  startDate: string,
  startTime = '10:00:00'
): number => eventStart(startDate, startTime).valueOf();
