import { getFirstOfMonth } from "@/utils";
import { UTCDate } from "@date-fns/utc";
import { addDays, addMonths, subDays } from "date-fns";
import _ from "lodash";

export enum Scale {
  Week = "w",
  Month = "m",
  Year = "y",
}

// maximum amount of history to show
export const maxHistoryDataPoints: Record<Scale, number> = {
  [Scale.Week]: 7, // days
  [Scale.Month]: 31, // days
  [Scale.Year]: 365, // day
};

// minimum amount of projection to show (show more if less history)
const minProjectionDataPoints: Record<Scale, number> = {
  [Scale.Week]: 2, // days
  [Scale.Month]: 7, // days
  [Scale.Year]: 90, // days
};

// worst case if there is NO history, and we show only projection
// +1 is added for today
export const dataPointCount: Record<Scale, number> = {
  [Scale.Week]:
    maxHistoryDataPoints[Scale.Week] + minProjectionDataPoints[Scale.Week] + 1, // days
  [Scale.Month]:
    maxHistoryDataPoints[Scale.Month] +
    minProjectionDataPoints[Scale.Month] +
    1, // days
  [Scale.Year]:
    maxHistoryDataPoints[Scale.Year] + minProjectionDataPoints[Scale.Year] + 1, // days
};

// subtract 1 to not include 'today'
export const scaleTickCount: Record<Scale, number> = {
  [Scale.Week]: dataPointCount[Scale.Week] - 1, // per day
  [Scale.Month]: (dataPointCount[Scale.Month] - 1) / 2, // every other day
  [Scale.Year]: dataPointCount[Scale.Year] / 30 - 1, // every month
};

export const scaleFormatter: Record<Scale, (value: number) => string> = {
  [Scale.Week]: (value) => {
    const date = new Date(value);
    const day = date.getDate(); // Get the day of the month (1-31)
    const month = date.getMonth() + 1; // Get the month (0-indexed, so add 1)
    return `${month}/${day}`;
  },
  [Scale.Month]: (value) => {
    const date = new Date(value);
    const day = date.getDate(); // Get the day of the month (1-31)
    const month = date.getMonth() + 1; // Get the month (0-indexed, so add 1)
    return `${month}/${day}`;
  },
  [Scale.Year]: (value) => {
    const date = new Date(value);
    return date.toLocaleString("default", { month: "short" }).toUpperCase();
  },
};

// arbitrary, this is just what works well in this graph size
export const historicalYTickCount = 11;

export const xTickGenerator: Record<Scale, (minDate: UTCDate) => number[]> = {
  [Scale.Week]: (minDate) => {
    return Array.from({ length: scaleTickCount[Scale.Week] }, (_, i) => {
      return addDays(minDate, i).getTime();
    });
  },
  [Scale.Month]: (minDate) => {
    return Array.from({ length: scaleTickCount[Scale.Month] }, (_, i) => {
      return addDays(minDate, i * 2).getTime();
    });
  },
  [Scale.Year]: (minDate) => {
    const firstMonth = getFirstOfMonth(minDate);
    const startMonth = addMonths(firstMonth, 1);
    return Array.from({ length: scaleTickCount[Scale.Year] }, (_, i) => {
      return addMonths(startMonth, i).getTime();
    });
  },
};

export const minTimestampGenerator = (startValue: number, dayCount: number) => {
  const date = new UTCDate(startValue);
  return subDays(date, dayCount).getTime();
};
