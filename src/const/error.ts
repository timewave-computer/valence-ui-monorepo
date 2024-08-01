export const ERROR_MESSAGES = {
  SUBMIT_EMAIL_FAIL: "Failed to submit email",
  DISPLAY_UTC_TIME_FAIL: "Failed to format date to UTC Time",
  STARGATE_CONNECT_FAIL: "RPC connect failed, could not create stargate client",
  IBC_TRACE_FAIL: "Failed to trace origin assets",
  COINGECKO_PRICE_FAIL: "Could not fetch prices",
  CACHED_QUERY_FAIL: "Failed to call API with snapper",
  UNKNOWN_ERROR: "Unknown error",
  INDEXER_ACCT_CONFIG_ERROR: "Failed to fetch account config",
  INDEXER_FUNDS_IN_AUCTION_ERROR: "Failed to fetch funds in auction",
  INDEXER_HISTORICAL_BALANCES_ERROR: "Failed to fetch historical balances",
  INDEXER_HISTORICAL_PRICES_ERROR: "Failed to fetch historical prices",
  INDEXER_HISTORICAL_TARGETS_ERROR: "Failed to fetch historical targets",

  // create rebalancer
  CREATE_REBALANCER_CODE_ID_ERROR:
    "Failed to create rebalancer, could not fetch code details for",
};

// here for parsing specific errors in the client. server actions -> client loses context of error instance
export enum ERROR_CODES {
  InvalidAccountError = "InvalidAccountError",
}

export class InvalidAccountError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = ERROR_CODES.InvalidAccountError;
  }
}

export class ErrorHandler {
  static constructText(text: string, error: unknown) {
    let errorMessage = "";
    // handle all weird cases of errors
    if (error instanceof TypeError) {
      errorMessage = JSON.stringify(error);
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
