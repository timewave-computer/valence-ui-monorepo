import { ProgramParserResult } from "@/app/programs/server";

export type ParsedPrograms = Array<{
  id: number;
  parsed: ProgramParserResult;
  raw: string;
}>;
