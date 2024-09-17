import { SymbolColors } from "@/app/rebalancer/const";
import { Fragment } from "react";

export const Asset: React.FC<{
  symbol?: string;
  asChild?: boolean;
}> = ({ symbol, asChild = false }) => {
  const Comp = asChild ? Fragment : "div";

  return (
    <Comp className="flex flex-row items-center gap-2">
      <div
        className="h-4 w-4 shrink-0 rounded-full bg-valence-gray"
        style={{
          backgroundColor: symbol ? SymbolColors.get(symbol ?? "") : "",
        }}
      ></div>
      <span className="text-sm font-bold">{symbol ?? ""}</span>
    </Comp>
  );
};
