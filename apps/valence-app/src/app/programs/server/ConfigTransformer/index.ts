import { transformerV1 } from "./transformer-v1";
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
export type NormalizedRpcConfig = Array<{
  rpc: string;
  main: boolean;
  chainId: string;
}>;

export interface TransformerOutput {
  authorizations: NormalizedAuthorization[];
  authorizationData: NormalizedAuthorizationData;
  programId: string;
  accounts: NormalizedAccounts;
  links: NormalizedLinks;
  libraries: NormalizedLibraries;
  rpcConfig: NormalizedRpcConfig;
}

export type TransformerFunction<T> = (config: T) => TransformerOutput;

// ratchet solution to have a better typed transformer function
type InferInputType<T extends ZodObject<any>> = z.infer<T>;
type TransformerConfig = Record<
  string,
  {
    schema: ZodObject<any, any, any>;
    transform: TransformerFunction<InferInputType<ZodObject<any, any, any>>>;
  }
>;

/***
 * add new file versions here
 */
const transformerConfig: TransformerConfig = {
  v1: {
    transform: transformerV1,
    schema: programConfigSchema,
  },
};

export class ConfigTransformer {
  static transform = (config: unknown) => {
    // for now, only 1 version, so we just use v1
    const { transform, schema } = transformerConfig.v1;
    return transform(schema.parse(config));
  };
}

export * from "./RpcConfigConstructor";
