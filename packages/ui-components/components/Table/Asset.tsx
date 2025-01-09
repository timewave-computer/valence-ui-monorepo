import { Fragment } from "react";

export const Asset: React.FC<{
  symbol?: string;
  color?: string;
  asChild?: boolean;
}> = ({ symbol, asChild = false, color }) => {
  const AssetWithDot = (
    <>
      <div
        className="h-4 w-4 shrink-0 rounded-full bg-valence-gray"
        style={{
          backgroundColor: color ?? "",
        }}
      ></div>
      <span className="text-sm font-bold">{symbol ?? ""}</span>
    </>
  );

  if (asChild) {
    return <Fragment> {AssetWithDot}</Fragment>;
  }

  return <div className="flex flex-row items-center gap-2">{AssetWithDot}</div>;
};
