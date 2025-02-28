import { Heading } from "@valence-ui/ui-components";

export const ConnectWalletHoverContent = () => (
  <div>
    <Heading level="h3">Wallet not connected.</Heading>
    <div className="text-sm pt-2">
      A wallet must be connected to execute a subroutine.
    </div>
  </div>
);
