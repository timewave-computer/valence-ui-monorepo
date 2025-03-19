import { chainConfig } from "@/const/config";
import { Fragment, ReactNode } from "react";

export const SupportedAssets = (): ReactNode => {
  return (
    <Fragment>
      {chainConfig.supportedRebalancerAssets.map((a, i) => {
        return (
          <Fragment key={`supported-asset-copy-${a.symbol}`}>
            <span className="font-semibold">{a.symbol}</span>
            {i !== chainConfig.supportedRebalancerAssets.length - 1 && ", "}
          </Fragment>
        );
      })}
    </Fragment>
  );
};
