import { z } from "zod";

export const chainConfigSchema = z.object({
  chainId: z.string(),
  rpc: z.string(),
  chainName: z.string(),
  domainName: z.string(),
  gasPrice: z.string(),
  gasDenom: z.string(),
});

export type ChainConfig = z.infer<typeof chainConfigSchema>;

export const programsConfigSchema = z.object({
  registry: z.string(),
  main: chainConfigSchema,
  chains: z.array(chainConfigSchema),
});

export type ProgramsConfigSchema = z.infer<typeof programsConfigSchema>;
