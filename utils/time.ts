import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc'; // dependent on utc plugin
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const timeIsBetween = ({
  time,
  start,
  end,
}: {
  time: Dayjs;
  start: Dayjs;
  end: Dayjs;
}): boolean => {
  return start.isBefore(time) && end.isAfter(time);
};

export const currentHalfhour = (time: Dayjs): string => {
  const nextHour = time.add(1, 'hour');
  return time.minute() < 30
    ? `${time.format('HH')}:00 - ${time.format('HH')}:30`
    : `${time.format('HH')}:30 - ${nextHour.format('HH')}:00`;
};

export const eventTime = (start: Dayjs, end: Dayjs): string =>
  `${start.format('HH:mm')} - ${end.format('HH:mm')}`;

export const toDayjs = (date: string, time: string): Dayjs =>
  dayjs(date + time);

// TODO: Change to Dayjs input
export const timeIsAfter = (time: number, start: string, date: string) => {
  const s = dayjs(`${start} ${date}`, 'HH:mm:ss YYYY-MM-DD');
  const now = dayjs(time);

  return s.isAfter(now);
};

// TODO: This date-check should probably be implemented backend
export const currentDayCompanies = () => {
  const second_day = dayjs('2021-01-19 00:00').tz('Europe/Oslo');
  return dayjs().tz('Europe/Oslo').isBefore(second_day)
    ? 'companiesFirstDay'
    : 'companiesLastDay';
};