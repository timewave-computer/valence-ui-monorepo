import { TransformerFunction } from "./types";
import { transformerV1 } from "./transformer-v1";
import { programConfigSchema } from "@valence-ui/generated-types";
import { z, ZodObject } from "zod";

/***
 * to add a new transformer, add a new versioned transformer in the folder, and add to the dict
 */

// ratchet solution to have a better typed transformer function
type InferInputType<T extends ZodObject<any>> = z.infer<T>;
type TransformerConfig = Record<
  string,
  {
    schema: ZodObject<any, any, any>;
    transform: TransformerFunction<InferInputType<ZodObject<any, any, any>>>;
  }
>;

const transformerConfig: TransformerConfig = {
  v1: {
    transform: transformerV1,
    schema: programConfigSchema,
  },
};

export const transformer = (config: unknown) => {
  // for now, only 1 version, so we just use v1
  const { transform, schema } = transformerConfig.v1;
  return transform(schema.parse(config));
};
