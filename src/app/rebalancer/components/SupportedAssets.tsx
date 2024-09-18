import { chainConfig } from "@/const/config";
import { Fragment, ReactNode } from "react";

export const SupportedAssets = (): ReactNode => {
  return (
    <Fragment>
      {chainConfig.supportedAssets.map((a, i) => {
        return (
          <>
            <span className="font-semibold">{a.symbol}</span>
            {i !== chainConfig.supportedAssets.length - 1 && ", "}
          </>
        );
      })}
    </Fragment>
  );
};
