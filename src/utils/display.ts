import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { format } from "date-fns";

export const displayQuantity = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const displayUtcTime = (date: Date) => {
  try {
    const dateStringWithTimezone = new Intl.DateTimeFormat("en-US", {
      timeZoneName: "short",
    }).format(date);
    const tz = dateStringWithTimezone.substring(
      dateStringWithTimezone.length - 3,
    );

    const time = format(date, "hh:mm:ss a");
    return `${time} ${tz}`;
  } catch (e) {
    ErrorHandler.warn(ERROR_MESSAGES.DISPLAY_UTC_TIME_FAIL, e);
  }
};
