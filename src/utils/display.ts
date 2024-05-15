import { ERROR_MESSAGES, ErrorController } from "@/const/error";
import { formatISO } from "date-fns";

export const displayNumber = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const displayUtcTime = (date: Date) => {
  try {
    return formatISO(date, { representation: "time" });
  } catch (e) {
    ErrorController.warn(ERROR_MESSAGES.DISPLAY_UTC_TIME_FAIL, e);
  }
};
