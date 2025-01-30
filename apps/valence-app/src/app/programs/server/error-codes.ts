export enum GetProgramErrorCodes {
  REGISTRY = "REGISTRY",
  PARSE = "PARSE",
  BALANCES = "BALANCES",
}

export const GET_PROGRAM_ERROR_CODES: Record<
  string,
  {
    title: string;
    text?: string;
    message?: string;
  }
> = {
  [GetProgramErrorCodes.REGISTRY]: {
    title: "Program ID Not Found",
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
