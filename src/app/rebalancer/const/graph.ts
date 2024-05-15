import { UTCDate } from "@date-fns/utc";
export enum Scale {
  // these two are disabled for now, we only have historical day 1x per day
  // Hour = "h",
  // Day = "d",
  Week = "w",
  Month = "m",
  Year = "y",
}

export enum KeyTag {
  balance = ".bal",
  value = ".value",
  projectedValue = ".projected-value",
  projectedAmount = ".projected-amount",
}

export class GraphKey {
  static balance(denom: string) {
    return `${denom}${KeyTag.balance}`;
  }

  static value(denom: string) {
    return `${denom}${KeyTag.value}`;
  }
  static projectedValue(denom: string) {
    return `${denom}${KeyTag.projectedValue}`;
  }
  static projectedAmount(denom: string) {
    return `${denom}${KeyTag.projectedAmount}`;
  }
}

export const projectionLength: Record<Scale, number> = {
  // 1 day: 6 hours
  // 1 hour: 15 mins
  [Scale.Week]: 2, // days
  [Scale.Month]: 7, // days
  [Scale.Year]: 90, // days
};

export const scaleTickCount: Record<Scale, number> = {
  // [Scale.Hour]: 60, // per-minute
  // [Scale.Day]: 24, // per-hour
  [Scale.Week]: 7 + projectionLength[Scale.Week], // per day
  [Scale.Month]: 31 + projectionLength[Scale.Month], // per day
  [Scale.Year]: 12 + projectionLength[Scale.Year] / 30, // per month
};
export const scaleIntervalSeconds: Record<Scale, number> = {
  // [Scale.Hour]: 60, // per-minute
  // [Scale.Day]: 60 * 60, // per-hour
  [Scale.Week]: 24 * 60 * 60, // per day
  [Scale.Month]: 24 * 60 * 60, // per day
  [Scale.Year]: 30 * 24 * 60 * 60, // per month
};

export const scaleFormatter: Record<Scale, (value: number) => string> = {
  //   [Scale.Hour]: (value) =>
  //    new Date(value).toLocaleTimeString("default", { timeStyle: "short" }),
  //   [Scale.Day]: (value) => new Date(value).getHours().toString(),
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

export const minimumTimestampGenerator: Record<
  Scale,
  (startValue: number) => number
> = {
  //   [Scale.Hour]: (value) =>
  //    new Date(value).toLocaleTimeString("default", { timeStyle: "short" }),
  //   [Scale.Day]: (value) => new Date(value).getHours().toString(),
  [Scale.Week]: (startValue) => {
    const date = new UTCDate(startValue);
    date.setDate(date.getDate() - 7);
    return date.getTime();
  },
  [Scale.Month]: (startValue) => {
    const date = new UTCDate(startValue);
    date.setDate(date.getDate() - 30);
    return date.getTime();
  },
  [Scale.Year]: (startValue) => {
    const date = new UTCDate(startValue);
    date.setDate(date.getDate() - 365);
    return date.getTime();
  },
};

export const COLORS = [
  "#FF2A00",
  "#00A3FF",
  "#EA80D1",
  "#4EBB5B",
  "#FFBC57",
  "#800000",
  "#BABABA",
  "#C2C600",
  "#8476DE",
  "#17CFCF",
];
