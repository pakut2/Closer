import { DateTime } from "luxon";

export const minuteDifference = (currentDate: string, targetDate: string): number => {
  const currentDateTime = DateTime.fromISO(currentDate);
  const targetDateTime = DateTime.fromISO(targetDate);

  const minuteDifference = targetDateTime.diff(currentDateTime, "minutes").minutes;

  return Math.floor(minuteDifference);
};
