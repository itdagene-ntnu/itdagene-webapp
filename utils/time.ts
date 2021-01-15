import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc'; // dependent on utc plugin
import timezone from 'dayjs/plugin/timezone';
import { ProgramView_events } from '../__generated__/ProgramView_events.graphql';
import { ArrayElement } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

export const timeIsBetween = (
  time: Dayjs,
  start: string,
  end: string,
  date: string
): boolean => {
  const s = dayjs(`${start} ${date}`, 'HH:mm:ss YYYY-MM-DD');
  const e = dayjs(`${end} ${date}`, 'HH:mm:ss YYYY-MM-DD');
  const now = dayjs(time);

  return s.isBefore(now) && e.isAfter(now);
};

export const timeIsAfterNow = (
  time: Dayjs,
  start: string,
  date: string
): boolean => {
  const s = dayjs(`${start} ${date}`, 'HH:mm:ss YYYY-MM-DD');
  const now = dayjs(time);

  return s.isAfter(now);
};

type currentDay = 'companiesFirstDay' | 'companiesLastDay';

// TODO: This date-check should probably be implemented backend
export const currentDayCompanies = (endDate: string): currentDay => {
  const second_day = dayjs(`${endDate} 00:00:00`, 'YYYY-MM-DD HH:mm:ss').tz(
    'Europe/Oslo'
  );

  // Keeping this for test-cases
  // const second_day = dayjs(
  //   `${'2022-01-15'} 00:00:00`,
  //   'YYYY-MM-DD HH:mm:ss'
  // ).tz('Europe/Oslo');

  return dayjs().tz('Europe/Oslo').isBefore(second_day)
    ? 'companiesFirstDay'
    : 'companiesLastDay';
};

export const currentHalfhour = (time: Dayjs): string => {
  const nextHour = time.add(1, 'hour');
  return time.minute() < 30
    ? `${time.format('HH')}:00 - ${time.format('HH')}:30`
    : `${time.format('HH')}:30 - ${nextHour.format('HH')}:00`;
};

interface EventInfo {
  timeRange: string;
  eventTitle: string;
  eventDescription: string;
}

// FIXME: Create a eventType who's either ProgramView_events or NonNullable<StandCard_stand['events']>;
export const eventTime = (
  event: ArrayElement<ProgramView_events> | null,
  truncLength = 50
): EventInfo => {
  let timeRange;
  let eventTitle;
  let eventDescription;

  if (event) {
    const dayTimeStart = dayjs(
      `${event.timeStart} ${event.date}`,
      'HH:mm:ss YYYY-MM-DD'
    ).format('HH:mm');
    const dayTimeEnd = dayjs(
      `${event.timeEnd} ${event.date}`,
      'HH:mm:ss YYYY-MM-DD'
    ).format('HH:mm');

    timeRange = `${dayTimeStart} - ${dayTimeEnd}`;
    eventTitle = event.title;
    eventDescription = event.description;
  } else {
    timeRange = '';
    eventTitle = '💁🏼‍♀️';
    eventDescription = '';
  }

  return {
    timeRange,
    eventTitle,
    eventDescription,
  };
};
