export const ERROR_MESSAGES = {
  DISPLAY_UTC_TIME_FAIL: "Failed to format date to UTC Time",
  STARGATE_CONNECT_FAIL: "RPC connect failed, could not create stargate client",
  IBC_TRACE_FAIL: "Failed to trace origin assets",
  COINGECKO_PRICE_FAIL: "Could not fetch prices",
};

export class ErrorHandler {
  private static constructText(msg: string, error: unknown) {
    const e = error as { message: string }; // TODO: this is probably sketchy
    return `${msg}\n${e.message}`;
  }
  static warn(msg: string, error?: unknown) {
    const warnText = error ? this.constructText(msg, error) : msg;
    console.warn(warnText);
  }

  static makeError(msg: string, error?: unknown) {
    const errorText = error ? this.constructText(msg, error) : msg;
    console.log(errorText);
    return new Error(errorText);
  }
}
