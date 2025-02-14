import { ErrorHandler } from "~/const/error";

export const displayLocalTimezone = (date: Date) => {
  try {
    const dateStringWithTimezone = new Intl.DateTimeFormat("en-US", {
      timeZoneName: "short",
    }).format(date);

    const tz = dateStringWithTimezone.substring(
      dateStringWithTimezone.length - 3,
    );
    return tz;
  } catch (e) {
    ErrorHandler.warn("Failed to display local timezone", e);
  }
};
