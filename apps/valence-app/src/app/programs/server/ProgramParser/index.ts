import { parserV1 } from "./parser-v1";
import {
  programConfigSchema,
  type ProgramConfig,
} from "@valence-ui/generated-types";
import { z, ZodObject } from "zod";

/***
 * Class to take a versioned file and output a format that the Node Composer (to make diagrams) can consume
 *
 *  to add a new transformer, add a new versioned transformer in the folder, and add to the dict
 */

// there is only one file version, so the normalized types are just the types from the schema. Adjust as needed
export type NormalizedAuthorization = ProgramConfig["authorizations"][0];
export type NormalizedAuthorizationData = ProgramConfig["authorization_data"];
type NormalizedAccount = ProgramConfig["accounts"][0];
export type NormalizedAccounts = {
  [k: string]: NormalizedAccount & {
    chainId: string;
  };
};
export type NormalizedLibraries = ProgramConfig["libraries"];
export type NormalizedLinks = ProgramConfig["links"];

export interface ProgramParserResult {
  authorizations: NormalizedAuthorization[];
  authorizationData: NormalizedAuthorizationData;
  accounts: NormalizedAccounts;
  links: NormalizedLinks;
  libraries: NormalizedLibraries;
}

export type ParseFunction<T> = (rawProgram: T) => ProgramParserResult;

// ratchet solution to have a better typed transformer function
type InferInputType<T extends ZodObject<any>> = z.infer<T>;
type ProgramParserConfig = Record<
  string,
  {
    schema: ZodObject<any, any, any>;
    parse: ParseFunction<InferInputType<ZodObject<any, any, any>>>;
  }
>;

/***
 * add new file versions here
 */
const parserConfig: ProgramParserConfig = {
  v1: {
    parse: parserV1,
    schema: programConfigSchema,
  },
};

export class ProgramParser {
  static extractData = (programData: unknown) => {
    // for now, only 1 version, so we just use v1
    const { parse, schema } = parserConfig.v1;
    return parse(schema.parse(programData));
  };
}

export * from "../QueryConfigManager";
