import { ReactNode } from "react";
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Scale, scaleFormatter } from "@/app/rebalancer/const/graph";

export type GraphData = Array<{
  timestamp: number;
  [key: string]: number;
}>;

export const Graph: React.FC<{
  xAxisTicks: number[];
  scale: Scale;
  data: GraphData;
  children: ReactNode;
}> = ({ xAxisTicks, scale, data, children }) => {
  return (
    <ResponsiveContainer key={scale} height={500}>
      <LineChart
        data={data}
        margin={{ top: 0, left: 10, right: 0, bottom: 10 }}
      >
        <YAxis
          type="number"
          domain={[0, 1100000]}
          scale="linear"
          ticks={[
            0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000,
            900000, 1000000,
          ]}
          tickFormatter={(value) =>
            Number(value).toLocaleString(undefined, {
              notation: "compact",
              maximumSignificantDigits: 2,
            })
          }
          tickLine={false}
          axisLine={{ stroke: "white" }}
          className="font-sans text-xs"
          dx={-6}
        />
        <XAxis
          dataKey="timestamp"
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
          tickFormatter={scaleFormatter[scale]}
          ticks={xAxisTicks}
          tickLine={false}
          axisLine={{ stroke: "white" }}
          className="font-sans text-xs text-valence-black"
          dy={6}
        />
        <CartesianGrid syncWithTicks stroke="white" />
        {children}
      </LineChart>
    </ResponsiveContainer>
  );
};
