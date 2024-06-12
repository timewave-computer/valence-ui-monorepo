"use server";
import { get } from "@vercel/edge-config";
import { z } from "zod";

const EDGE_CONFIG_DATA_STORE_KEY = process.env.EDGE_CONFIG_DATA_STORE_KEY;
if (!EDGE_CONFIG_DATA_STORE_KEY) {
  throw new Error("EDGE_CONFIG_DATA_STORE_KEY is not set");
}
const FeaturedAccountSchema = z.object({
  label: z.string(),
  value: z.string(),
});
const EdgeConfigSchema = z.object({
  featured_rebalancer_accounts: z.array(FeaturedAccountSchema),
});

export const fetchEdgeConfig = async () => {
  const config = await get(EDGE_CONFIG_DATA_STORE_KEY);
  return EdgeConfigSchema.parse(config);
};
