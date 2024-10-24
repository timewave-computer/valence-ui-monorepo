"use server";
import { chainConfig } from "@/const";
import { sleep } from "@/utils";
import { z } from "zod";

const ASTROPORT_API_URL = "https://app.astroport.fi/api/trpc";

type FetchAstroportPriceParams = {
  amount: string;
  pair: {
    fromDenom: string;
    toDenom: string;
  };
};

export const fetchAstroportRates = async (
  params: Array<FetchAstroportPriceParams>,
  sleepMs?: number,
) => {
  return Promise.all(
    params.map(async (p, i) => {
      // avoid rate limiting errors
      if (i !== 0) await sleep(sleepMs ?? 200);

      return fetchAstroportRate(p);
    }),
  );
};

export const fetchAstroportRate = async ({
  amount,
  pair,
}: FetchAstroportPriceParams): Promise<number | null> => {
  const res = await fetch(
    ASTROPORT_API_URL +
      "/routes.getRoutes" +
      "?" +
      new URLSearchParams({
        input: JSON.stringify({
          json: {
            chainId: chainConfig.chain.chain_id,
            start: pair.fromDenom,
            end: pair.toDenom,
            amount: amount,
            limit: 1, // returns 1 route
          },
        }),
      }),
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data " + res.status + "" + res.statusText);
  }

  const data = await res.json();
  const parsedData = AstroportGetRoutesResponseSchema.parse(data);
  if (!parsedData.result.data.json.length) {
    return null;
  }
  // take the first once, all prices are same
  return (
    parseFloat(parsedData.result.data.json[0].amount_in) /
    parseFloat(parsedData.result.data.json[0].amount_out)
  );
};

const AstroportRouteSchema = z.object({
  id: z.string(),
  denom_in: z.string(),
  decimals_in: z.number(),
  price_in: z.number(),
  value_in: z.string(),
  amount_in: z.string(),
  denom_out: z.string(),
  decimals_out: z.number(),
  price_out: z.number(),
  value_out: z.string(),
  amount_out: z.string(),
});

const AstroportGetRoutesResponseSchema = z.object({
  result: z.object({
    data: z.object({
      json: z.array(AstroportRouteSchema),
    }),
  }),
});
