export enum GetProgramErrorCodes {
  RPC_CONNECTION = "RPC_CONNECTION",
  NO_REGISTRY = "NO_REGISTRY",
  INVALID_REGISTRY = "INVALID_REGISTRY",
  PROGRAM_ID_NOT_FOUND = "PROGRAM_ID_NOT_FOUND",
  PARSE = "PARSE",
  BALANCES = "BALANCES",
  DECODE_BINARY = "DECODE_BINARY",
  PROCESSOR_QUEUE = "PROCESSOR_QUEUE",
  EXECUTION_HISTORY = "EXECUTION_HISTORY",
  LIBRARY_CONFIG = "LIBRARY_CONFIG",
  // client
  OFFLINE_SIGNER = "OFFLINE_SIGNER",
}

type ErrorCode = {
  key: GetProgramErrorCodes;
  title: string;
  text?: string;
  message?: string;
};
export type ErrorCodes = Array<ErrorCode>;

const PROGRAM_ERROR_CONTENT: Record<
  GetProgramErrorCodes,
  { title: string; text?: string }
> = {
  [GetProgramErrorCodes.RPC_CONNECTION]: {
    title: "Could not connect to RPC",
    text: "Verify RPC URL in the RPC settings.",
  },
  [GetProgramErrorCodes.NO_REGISTRY]: {
    title: "Program registry not set",
    text: "Input registry address into RPC settings.",
  },
  [GetProgramErrorCodes.INVALID_REGISTRY]: {
    // not used currently
    title: "Invalid program registry",
    text: "Verify registry address and RPC URL are correct in the RPC settings.",
  },
  [GetProgramErrorCodes.PROGRAM_ID_NOT_FOUND]: {
    title: "Program ID not found",
    text: "Verify registry address and RPC URL are correct in the RPC settings.",
  },
  [GetProgramErrorCodes.PARSE]: {
    title: "Error parsing program configuration",
    text: "Configuration format not supported in the UI.",
  },
  [GetProgramErrorCodes.BALANCES]: {
    title: "Error fetching account balances",
  },
  [GetProgramErrorCodes.LIBRARY_CONFIG]: {
    title: "Error fetching library configuration",
  },
  [GetProgramErrorCodes.DECODE_BINARY]: {
    title: "Error decoding program",
  },
  [GetProgramErrorCodes.PROCESSOR_QUEUE]: {
    title: "Error fetching processor queue",
  },
  [GetProgramErrorCodes.EXECUTION_HISTORY]: {
    title: "Error fetching execution history",
  },
  [GetProgramErrorCodes.OFFLINE_SIGNER]: {
    title: "Error retrieving signers from wallet",
  },
};

export const makeApiErrors = (
  messages: Array<{ code: GetProgramErrorCodes; message?: object | string }>,
): ErrorCodes => {
  return messages.map(({ code, message }) => {
    return {
      key: code,
      ...PROGRAM_ERROR_CONTENT[code],
      ...(message && !isObjectEmpty(message)
        ? { message: JSON.stringify(message) }
        : {}),
    };
  });
};

const isObjectEmpty = (obj: object | string) => {
  if (typeof obj === "string") {
    return obj.length === 0;
  }
  return Object.keys(obj).length === 0;
};
