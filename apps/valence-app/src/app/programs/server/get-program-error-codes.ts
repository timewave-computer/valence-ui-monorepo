export enum GetProgramErrorCodes {
  INVALID_REGISTRY = "INVALID_REGISTRY",
  PROGRAM_ID_NOT_FOUND = "PROGRAM_ID_NOT_FOUND",
  PARSE = "PARSE",
  BALANCES = "BALANCES",
}

type ErrorKey = {
  title: string;
  text?: string;
  message?: string;
};
export type ErrorCodes = Record<string, ErrorKey>;

const PROGRAM_ERROR_CONTENT: ErrorCodes = {
  [GetProgramErrorCodes.INVALID_REGISTRY]: {
    title: "Invalid program registry",
    text: "Verify registry address and RPC URL are correct in the RPC settings.",
  },
  [GetProgramErrorCodes.PROGRAM_ID_NOT_FOUND]: {
    title: "Program ID not found",
    text: "Verify registry address and RPC URL are correct in the RPC settings.",
  },
  [GetProgramErrorCodes.PARSE]: {
    title: "Failed to parse program",
    text: "Configuration format not supported in the UI.",
  },
  [GetProgramErrorCodes.BALANCES]: {
    title: "Failed to fetch account balances",
  },
};

export const makeApiErrors = (
  messages: Array<{ code: GetProgramErrorCodes; message?: object }>,
): ErrorCodes => {
  return messages.reduce((acc, { code, message }) => {
    return {
      ...acc,
      [code]: {
        ...PROGRAM_ERROR_CONTENT[code],
        ...(message && !isObjectEmpty(message)
          ? { message: JSON.stringify(message) }
          : {}),
      },
    };
  }, {} as ErrorCodes);
};

const isObjectEmpty = (obj: object) => {
  return Object.keys(obj).length === 0;
};
