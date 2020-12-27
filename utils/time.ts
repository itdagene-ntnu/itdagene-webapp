import dayjs from 'dayjs';

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
