import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const findClosestDate = (dates: string[], parseFormat = ''): string => {
  const now = dayjs();
  let closestDate = dates[0];
  let smallestDifference = Math.abs(dayjs(closestDate, parseFormat).diff(now));

  for (let i = 1; i < dates.length; i++) {
    const currentDifference = Math.abs(dayjs(dates[i], parseFormat).diff(now));
    if (currentDifference < smallestDifference) {
      smallestDifference = currentDifference;
      closestDate = dates[i];
    }
  }
  return closestDate;
}
