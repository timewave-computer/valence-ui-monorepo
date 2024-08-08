import { ErrorHandler } from "@/const/error";
import {
  fetchHistoricalBalances,
  fetchRebalancerAccountConfiguration,
} from "@/server/actions";
import {
  IndexerOraclePricesResponse,
  fetchOraclePrices,
} from "@/server/actions/fetch-oracle-prices";
import { microToBase, findClosestCoingeckoPrice } from "@/utils";
import { UTCDate } from "@date-fns/utc";
import { subDays } from "date-fns";
import { NextResponse } from "next/server";
import Papa from "papaparse";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req?.url ?? "");
//   const address = searchParams.get("address");
//   const download = searchParams.get("download");

//   if (!address) {
//     return new NextResponse(
//       'Error: Missing required query parameter "address".',
//       {
//         status: 400,
//         headers: {
//           "Content-Type": "text/plain",
//         },
//       },
//     );
//   }
//   const { targets } = await fetchRebalancerAccountConfiguration({ address });

//   // fetch for last year
//   const endInUTC = new UTCDate();
//   const startInUTC = subDays(endInUTC, 365);
//   const historicBalances = await fetchHistoricalBalances(address, {
//     startDate: startInUTC,
//     endDate: endInUTC,
//   });

//   const coingeckoHistoricPrices = await fetchHistoricalPrices(targets);
//   const oracleHistoricPricesPromises = targets.map(async (target) => {
//     return {
//       denom: target.denom,
//       data: await fetchOraclePrices(target.denom),
//     };
//   });
//   const oraclePrices = await Promise.all(oracleHistoricPricesPromises);

//   const data = historicBalances.map((balance) => {
//     let pricesForTimestamp: Record<string, number | string | null> = {
//       timestamp: new UTCDate(balance.blockTimeUnixMs).toISOString(),
//     };
//     targets.forEach((target) => {
//       // get denom balance
//       // get denom price
//       const targetDenom = target.denom;
//       const decimals = target.asset.decimals;
//       const name = target.asset.name;

//       // get closest price to timestmap
//       let denomBalance = microToBase(balance.value[targetDenom], decimals);
//       denomBalance = isNaN(denomBalance) ? 0 : denomBalance;
//       const balanceTimestamp = balance.blockTimeUnixMs;
//       const coingeckoPricesForDenom =
//         coingeckoHistoricPrices.find(
//           (price) => price.coinGeckoId === target.asset.coingecko_id,
//         )?.prices ?? [];
//       const coingeckoPrice = findClosestCoingeckoPrice(
//         balanceTimestamp,
//         coingeckoPricesForDenom,
//       );

//       const oraclePricesForDenom =
//         oraclePrices.find((price) => price.denom === targetDenom)?.data ?? [];
//       const oraclePrice = findClosestOraclePrice(
//         balanceTimestamp,
//         oraclePricesForDenom,
//       );

//       pricesForTimestamp = {
//         ...pricesForTimestamp,
//         [`${name}_balance`]: denomBalance,
//         [`${name}_coingecko_price`]: coingeckoPrice,
//         [`${name}_oracle_price`]: oraclePrice,
//       };
//     });
//     return pricesForTimestamp;
//   });

//   if (download === "true") {
//     // Convert JSON to CSV
//     const csv = Papa.unparse(data);

//     // Create a response with CSV file
//     return new NextResponse(csv, {
//       headers: {
//         "Content-Type": "text/csv",
//         "Content-Disposition": 'attachment; filename="data.csv"',
//       },
//     });
//   } else {
//     return new NextResponse(JSON.stringify(data, null, 2), {
//       headers: {
//         "Content-Type": "text/json",
//       },
//     });
//   }
// }

// // Helper function to find the price with the closest timestamp
// function findClosestOraclePrice(
//   balanceTimestamp: number,
//   prices: IndexerOraclePricesResponse,
// ): number {
//   if (prices.length === 0) {
//     ErrorHandler.warn("No prices found for denom");
//     return 0;
//   }
//   const sorted = prices.sort(
//     (a, b) =>
//       Math.abs(balanceTimestamp - Number(a.at)) - // prices are in form [timestamp, price]  [ 1714611745449, 1.0007257446162172 ],
//       Math.abs(balanceTimestamp - Number(b.at)),
//   );
//   return Number(sorted[0].value?.price); // take first element, extract price
// }
