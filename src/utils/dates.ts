import { UTCDate } from "@date-fns/utc";
import { subDays } from "date-fns";

export const getMidnightUtc = () => {
  return new UTCDate(new UTCDate().setHours(0, 0, 0, 0));
};

export const useDateRange = () => {
  const midnightUTC = getMidnightUtc();
  const startDate = subDays(midnightUTC, 365); // just year for now
  const endDate = midnightUTC;
  return { startDate, endDate };
};
