export const ERROR_MESSAGES = {
  DISPLAY_UTC_TIME_FAIL: "Failed to format date to UTC Time",
};

export class ErrorController {
  private static constructText(msg: string, error: unknown) {
    const e = error as { message: string }; // TODO: this is probably sketchy
    return `${msg}\n${e.message}`;
  }
  static warn(msg: string, error: unknown) {
    const warnText = this.constructText(msg, error);
    console.warn(warnText);
  }

  static makeError(msg: string, error: unknown) {
    const errorText = this.constructText(msg, error);
    console.log(errorText);
    return Error(errorText);
  }
}
