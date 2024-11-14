import { TransformerFunction } from "./types";
import { transformerV1 } from "./transformer-v1";

/***
 * to add a new transformer, add a new versioned transformer in the folder, and add to the dict
 */
const transformerDict: Record<string, TransformerFunction> = {
  v1: transformerV1,
};

export const transformer = (config: unknown) => {
  // TODO: derive the version however we are handling it
  // for now, just use v1
  return transformerDict.v1(config);
};
