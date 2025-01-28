import { Coin } from "@cosmjs/stargate";
import { z } from "zod";

export type AccountBalances = Array<{
  address: string;
  balances: readonly Coin[];
}>;

export const LibraryZodSchema = z
  .object({
    execute: z.any(),
    contract_name: z.string(),
  })
  .passthrough();

export type LibraryJsonSchema = z.infer<typeof LibraryZodSchema>;
