import { fetchHistoricalPricesV2 } from "@/server/actions";
import { UTCDate } from "@date-fns/utc";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

/***
 * this is only here for internal purposes
 */
export default async function Report() {
  const historicalPrices = await fetchHistoricalPricesV2({
    denom: "untrn",
    coingeckoId: "neutron-3",
  });

  return (
    <div>
      {historicalPrices.map((row, i) => {
        const date = new UTCDate(row[0]);
        const formattedDate = format(date, "MM/dd/yyyy hh:mm:ss a");

        return (
          <div key={row[0]}>
            <div>
              {formattedDate},{row[1]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
