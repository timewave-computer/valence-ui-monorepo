import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { format } from "date-fns";

export const displayUtcTime = (date: Date) => {
  try {
    const dateStringWithTimezone = new Intl.DateTimeFormat("en-US", {
      timeZoneName: "short",
    }).format(date);
    const tz = dateStringWithTimezone.substring(
      dateStringWithTimezone.length - 3,
    );

    const time = format(date, "hh:mm a");
    return `${time} ${tz}`;
  } catch (e) {
    ErrorHandler.warn(ERROR_MESSAGES.DISPLAY_UTC_TIME_FAIL, e);
  }
};

export const displayNumber = (
  value: number,
  { precision }: { precision: number | null },
): string => {
  if (value === 0) {
    return "0.00";
  }
  if (!precision) {
    const decimalPart = value % 1;
    if (decimalPart === 0) {
      return value.toFixed(2);
    } else {
      return value.toPrecision();
    }
  }
  if (value >= 0.01) {
    // If the value is greater than or equal to 0.01, format it with two decimal points
    return value.toFixed(precision);
  } else {
    // If the value is less than 0.01, format it with two significant figures
    return value.toPrecision(precision);
  }
};

export const displayAddress = (address: string) => {
  if (!address.length) {
    return "";
  } else return `${address.slice(0, 10)}...${address.slice(-4)}`;
};

export const displayValue = ({
  value,
  symbol,
  options,
}: {
  value: number;
  symbol: string;
  options?: { precision: number | null };
}) => {
  const _value = isNaN(value) ? 0 : value;
  const displayString = displayNumber(_value, {
    precision: options?.precision ?? 2,
  });

  if (symbol === "USDC") {
    return `$${displayString}`;
  } else {
    return `${displayString} ${symbol}`;
  }
};
