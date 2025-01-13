import { Button } from "@valence-ui/ui-components";
import React from "react";
import { HiMiniArrowRight } from "react-icons/hi2";

export const NoFundsActionItems = () => (
  <div className="flex  flex-row flex-wrap items-center gap-4 pt-4">
    <Button variant="secondary" href="https://go.skip.build/">
      <div className="  flex flex-row items-center gap-1.5 self-start">
        Bridge assets to Neutron
        <HiMiniArrowRight className="h-4 w-4" />
      </div>
    </Button>
    <Button variant="secondary" href="https://app.astroport.fi/swap">
      <div className=" flex flex-row items-center gap-1.5 self-start">
        Swap on Astroport
        <HiMiniArrowRight className="h-4 w-4" />
      </div>
    </Button>
    <Button variant="secondary" href="https://app.osmosis.zone/">
      <div className=" flex flex-row items-center gap-1.5 self-start">
        Swap on Osmosis
        <HiMiniArrowRight className="h-4 w-4" />
      </div>
    </Button>
  </div>
);
