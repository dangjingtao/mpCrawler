import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const isDayInScope = (checkDay: string, scope: string[]) => {
  const dateToCheck = dayjs(checkDay);
  const [startDate, endDate] = scope;
  const checkDate: any = dayjs(dateToCheck);

  return (
    checkDate.isSameOrAfter(startDate, "day") &&
    checkDate.isSameOrBefore(endDate, "day")
  );
};

export const isDaybefore = (checkDay: string, startDate: string) => {
  const dateToCheck = dayjs(checkDay);
  const checkDate: any = dayjs(dateToCheck);
  return checkDate.isBefore(startDate, "day");
};

export const isDayAfter = (checkDay: string, startDate: string) => {
  const dateToCheck = dayjs(checkDay);
  const checkDate: any = dayjs(dateToCheck);
  return checkDate.isAfter(startDate, "day");
};
