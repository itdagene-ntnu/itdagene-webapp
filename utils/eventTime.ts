import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const EVENT_TIME_ZONE = 'Europe/Oslo';

export const eventInstant = (value: string | Dayjs): Dayjs =>
  dayjs(value).tz(EVENT_TIME_ZONE);

export const eventLocalTime = (value: string): Dayjs =>
  dayjs.tz(value, EVENT_TIME_ZONE);
