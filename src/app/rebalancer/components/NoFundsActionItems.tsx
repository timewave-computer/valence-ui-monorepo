import { Button, LinkText } from "@/components";
import React from "react";
import { HiMiniArrowRight } from "react-icons/hi2";

export const NoFundsActionItems = () => (
  <div className="flex  flex-row flex-wrap items-center gap-4 pt-4">
    <Button variant="secondary">
      <LinkText
        className=" flex flex-row items-center gap-1.5 self-start"
        href="https://go.skip.build/"
      >
        Bridge assets to Neutron
        <HiMiniArrowRight className="h-4 w-4" />
      </LinkText>
    </Button>
    <Button variant="secondary">
      <LinkText
        className=" flex flex-row items-center gap-1.5 self-start"
        href="https://app.astroport.fi/swap"
      >
        Swap on Astroport
        <HiMiniArrowRight className="h-4 w-4" />
      </LinkText>
    </Button>
    <Button variant="secondary">
      <LinkText
        className=" flex flex-row items-center gap-1.5 self-start"
        href="https://app.osmosis.zone/"
      >
        Swap on Osmosis
        <HiMiniArrowRight className="h-4 w-4" />
      </LinkText>
    </Button>
  </div>
);
