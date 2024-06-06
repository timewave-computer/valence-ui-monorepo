import { UTCDate } from "@date-fns/utc";
import { subDays } from "date-fns";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

type ClientTime = {
  now: string;
  timezoneOffset: number;
  midnightUTC: string;
  midnightOneYearAgoUTC: string;
};

export const localTimeAtom = atom<ClientTime>({
  now: new Date().toISOString(),
  timezoneOffset: (new Date().getTimezoneOffset() / 60) * -1,
  midnightUTC: new Date().toISOString(),
  midnightOneYearAgoUTC: new Date().toISOString(),
});

export const useSetLocalTime = () => {
  const [localTime, setLocalTime] = useAtom(localTimeAtom);
  useEffect(() => {
    const now = new UTCDate();
    const timezoneOffset = (new Date().getTimezoneOffset() / 60) * -1;
    const midnightInUTC = new UTCDate(new Date().setHours(0, 0, 0, 0));
    const midnightOneYearAgo = subDays(midnightInUTC, 365);
    const data = {
      now: now.toISOString(),
      timezoneOffset: timezoneOffset,
      midnightUTC: midnightInUTC.toISOString(),
      midnightOneYearAgoUTC: midnightOneYearAgo.toISOString(),
    };
    setLocalTime(data);
  }, [setLocalTime]);

  return {
    localTime,
  };
};
