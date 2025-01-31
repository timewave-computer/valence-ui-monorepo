export enum GetProgramErrorCodes {
  REGISTRY = "REGISTRY",
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
  [GetProgramErrorCodes.REGISTRY]: {
    title: "Program ID not found",
    text: "Check registry address and program ID.",
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
  messagaes: Array<{ code: GetProgramErrorCodes; message?: object }>,
): ErrorCodes => {
  return messagaes.reduce((acc, { code, message }) => {
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
