import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";

import { useEffect, useState } from "react";

import { UTCDate } from "@date-fns/utc";
import init, { do_pid } from "@/wasm/pid/pkg/pid";
import { addDays } from "date-fns";
import Decimal from "decimal.js";
import { hideProjection } from "../create/components";
type GraphData = {
  timestamp: number;
  [record: string]: number;
};

export type PidProjectionInitialData = {
  symbol: string;
  initialBalance: number;
  targetBalance: number;
};

export const useProjectionGraph = ({
  initialData,
  pids,
}: {
  initialData: Array<PidProjectionInitialData>;
  pids: CreateRebalancerForm["pid"];
}) => {
  const today = new UTCDate();
  const xAxisTicks = Array.from({ length: 120 }, (_, i) => {
    const d = addDays(today, i);
    return d.getTime();
  });

  const xTicks = [
    xAxisTicks[0],
    xAxisTicks[29],
    xAxisTicks[69],
    xAxisTicks[119],
  ];

  const [graphData, setGraphData] = useState<Array<GraphData>>([]);

  useEffect(() => {
    if (hideProjection) return;
    init().then(() => {
      // TODO: import data from form
      // based on value and percetages, calc the target balances

      const convertedPids = {
        p: parseFloat(pids.p) * 1000,
        i: parseFloat(pids.i) * 1000,
        d: parseFloat(pids.d) * 1000,
      };

      const convertedInitialData = initialData.map(
        ({ symbol, initialBalance, targetBalance }) => {
          return {
            symbol: symbol,
            lastI: "0",
            lastInput: "0",
            currentBalance: initialBalance.toString(),
            targetBalance: targetBalance.toString(),
          };
        },
      );

      const results = xAxisTicks.map((timestamp) => {
        let result: any = {
          timestamp,
        };
        convertedInitialData.forEach((denomData) => {
          let { i, value } = do_pid({
            pid: convertedPids,
            input: denomData.currentBalance,
            target: denomData.targetBalance,
            dt: "1", // always 1
            last_i: denomData.lastI,
            last_input: denomData.lastInput,
          });

          denomData.lastI = i;
          denomData.lastInput = denomData.currentBalance;
          denomData.currentBalance = new Decimal(denomData.currentBalance)
            .plus(new Decimal(value))
            .floor()
            .toString();

          result[denomData.symbol + "_curr_balance"] = denomData.currentBalance;
        });

        return result;
      });

      setGraphData(results);
    });
  }, [initialData, xAxisTicks, pids.p, pids.i, pids.d]);

  // skip until not buggy
  if (hideProjection)
    return {
      graphData: [],
      xAxisTicks: [],
      xTicks: [],
    };

  return {
    graphData,
    xAxisTicks,
    xTicks,
  };
};
