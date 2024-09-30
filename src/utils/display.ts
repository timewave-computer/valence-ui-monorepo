import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { format } from "date-fns";
import { microToBase } from "./denom-math";

export const displayPid = (pid: { p: number; i: number; d: number }) => {
  const { p, i, d } = pid;

  if (i === 0 && d === 0) {
    switch (p) {
      case 0.05:
        return "Slow (5%)";
      case 0.1:
        return "Medium (10%)";
      case 0.2:
        return "Fast (20%)";
      default:
        return `Custom (${p * 100}%)`;
    }
  } else return `Custom (${p * 100}%, ${i * 100}%, ${d * 100}%)`;
};

export const displayMinBalance = (
  minBalance: number,
  symbol: string,
  decimals: number,
) => {
  return `${microToBase(minBalance, decimals)} ${symbol}`;
};
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
  _value: number,
  { precision }: { precision: number | null },
): string => {
  const value = isNaN(_value) ? 0 : _value;
  if (!precision) {
    const decimalPart = value % 1;
    if (decimalPart === 0) {
      return value.toFixed(2);
    } else {
      return value.toPrecision();
    }
  }
  if (value === 0) {
    // pad with zeros to amount of precision
    return value.toFixed(precision);
  }
  if (Math.abs(value) >= 0.1) {
    // If the value is greater than or equal to 0.1, format it with two decimal points
    return value.toFixed(precision);
  } else {
    // If the value is less than 0.1, format it with two significant figures
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
  options?: {
    omitDollarSignForUsdc?: boolean;
    precision?: number | null;
  };
}) => {
  const _value = isNaN(value) ? 0 : value;
  const displayString = displayNumber(_value, {
    precision: options?.precision ?? 2,
  });

  if (!options?.omitDollarSignForUsdc && symbol === "USDC") {
    return `$${displayString}`;
  } else {
    return `${displayString} ${symbol}`;
  }
};
