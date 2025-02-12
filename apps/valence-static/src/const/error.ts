export class ErrorHandler {
  static constructText(text: string, error: unknown) {
    let errorMessage = "";
    // handle all weird cases of errors
    if (error instanceof TypeError) {
      errorMessage = error.message;
    } else if (error instanceof Error) errorMessage = error.message;
    else if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    )
      errorMessage = error.message;
    else if (typeof error === "string") errorMessage = error;
    else errorMessage = "UNKNOWN_ERROR";
    return `${text}\n${errorMessage}`;
  }
  static warn(text: string, error?: unknown) {
    const warnText = error ? this.constructText(text, error) : text;
    console.warn(warnText);
  }

  static makeError(text: string, error?: unknown) {
    const errorText = error ? this.constructText(text, error) : text;
    console.log(errorText);
    return new Error(errorText);
  }
}
