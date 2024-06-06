import { ReactNode, forwardRef } from "react";
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

type GraphProps = {
  xAxisTicks: number[];
  yAxisTicks: number[];
  scale: Scale;
  data: GraphData;
  children: ReactNode;
};

export const Graph = forwardRef<HTMLDivElement, GraphProps>(
  ({ xAxisTicks, yAxisTicks, scale, data, children }, ref) => {
    return (
      <ResponsiveContainer key={scale} height={500} minWidth={600} ref={ref}>
        <LineChart
          data={data}
          margin={{ top: 0, left: 10, right: 0, bottom: 10 }}
        >
          <YAxis
            type="number"
            domain={[
              0,
              Math.max(...yAxisTicks) + Math.max(...yAxisTicks) * 0.1,
            ]}
            scale="linear"
            ticks={yAxisTicks}
            tickFormatter={(value) =>
              `$${Number(value).toLocaleString(undefined, {
                notation: "compact",
                maximumSignificantDigits: 2,
              })}`
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
          />
          <CartesianGrid syncWithTicks stroke="white" />
          {children}
        </LineChart>
      </ResponsiveContainer>
    );
  },
);

Graph.displayName = "Graph";
