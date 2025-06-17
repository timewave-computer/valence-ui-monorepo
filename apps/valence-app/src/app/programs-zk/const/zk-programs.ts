import {
  type ParsedPrograms,
  type ProgramParserResult,
} from "@/app/programs/server";
import { program1 } from "./test1-wbtc";

export const parsedZkPrograms: ParsedPrograms = [
  {
    id: 1,
    parsed: program1,
    raw: program1.toString(),
  },
];
