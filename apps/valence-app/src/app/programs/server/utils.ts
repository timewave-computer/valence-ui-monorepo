import { UTCDate } from "@date-fns/utc";

export const getLastUpdatedTime = () => {
  return new UTCDate().getTime();
};
