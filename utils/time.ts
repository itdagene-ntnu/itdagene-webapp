import dayjs from 'dayjs';

var utc = require('dayjs/plugin/utc'); // dependent on utc plugin
var timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

export const timeIsBetween = (
  time: number,
  start: string,
  end: string,
  date: string
) => {
  const s = dayjs(`${start} ${date}`, 'HH:mm:ss YYYY-MM-DD');
  const e = dayjs(`${end} ${date}`, 'HH:mm:ss YYYY-MM-DD');
  const now = dayjs(time);

  return s.isBefore(now) && e.isAfter(now);
};

export const timeIsAfterNow = (time: number, start: string, date: string) => {
  const s = dayjs(`${start} ${date}`, 'HH:mm:ss YYYY-MM-DD');
  const now = dayjs(time);

  return s.isAfter(now);
};

// TODO: This date-check should probably be implemented backend
export const currentDayCompanies = (endDate: string) => {
  const second_day = dayjs(`${endDate} 00:00:00`, 'YYYY-MM-DD HH:mm:ss').tz(
    'Europe/Oslo'
  );

  // Keeping this for test-cases
  // const second_day = dayjs(
  //   `${'2021-01-15'} 00:00:00`,
  //   'YYYY-MM-DD HH:mm:ss'
  // ).tz('Europe/Oslo');

  return dayjs().tz('Europe/Oslo').isBefore(second_day)
    ? 'companiesFirstDay'
    : 'companiesLastDay';
};