import { z } from "zod";
import { TransformerFunction } from "@/app/programs/server";
import { programConfigSchema } from "@valence-ui/generated-types";

/***
 * TODO: abstract away the construction of nodes. There should be a Node Interface that is consumed by Account Node, Library Node, etc
 */
type ProgramConfigV1 = z.infer<typeof programConfigSchema>;
export const transformerV1: TransformerFunction<ProgramConfigV1> = (config) => {
  if (!config.id) {
    // should not happen, but its generated as optional in the types, so it needs to get handled
    throw new Error("Program config does not have an ID");
  }
  return {
    // for now we just expect same format as the file
    authorizations: config.authorizations,
    authorizationData: config.authorization_data,
    programId: config.id.toString(),
    accounts: config.accounts,
    libraries: config.libraries,
    links: config.links,
  };
};
