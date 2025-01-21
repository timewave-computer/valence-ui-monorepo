import { CHAIN_ID_OPTIONS } from "@/app/covenants/const";
import { X_HANDLE, X_URL, VALENCE_DOMAIN } from "@valence-ui/socials";

import {
  AFieldRenderer,
  BFieldRenderer,
  BothFieldRenderer,
} from "@/app/covenants/components";
import { CovenantFields } from ".";
import { LinkText } from "@valence-ui/ui-components";

export const onePartyPol: CovenantFields = {
  parties: 1,
  each: [
    {
      key: "name",
      type: "text",
      label: "Name",
    },
    {
      key: "chainId",
      type: "dropdown",
      label: "Source of funds",
      options: CHAIN_ID_OPTIONS,
    },
    {
      key: "returnedAssetDest",
      type: "text",
      label: "Destination for returned assets",
    },
    {
      key: "neutronAddress",
      type: "text",
      label: "Party-authorized Neutron address",
    },
    {
      key: "amount",
      type: "text",
      label: "Amount",
    },
    {
      key: "denom",
      type: "group",
      label: "Denom",
      fields: [
        // No "Native" label:
        {
          key: "native",
          type: "text",
          if: (data) => !data.chainId || data.chainId === "neutron-1",
        },

        // Native and IBC labeled fields:
        {
          if: (data) => !!data.chainId && data.chainId !== "neutron-1",
          key: "native",
          type: "text",
          label: "Native",
          inlineLabel: true,
        },
        {
          if: (data) => !!data.chainId && data.chainId !== "neutron-1",
          key: "neutronIbc",
          type: "text",
          label: "Neutron IBC",
          inlineLabel: true,
        },
      ],
    },
    {
      if: (data) => !!data.chainId && data.chainId !== "neutron-1",
      key: "channelIds",
      type: "group",
      label: "Channel IDs",
      fields: [
        {
          key: "hostToNeutron",
          type: "text",
          label: "To Neutron",
          inlineLabel: true,
        },
        {
          key: "neutronToHost",
          type: "text",
          label: "From Neutron",
          inlineLabel: true,
        },
      ],
    },
    {
      if: (data) => !!data.chainId && data.chainId !== "neutron-1",
      key: "fromNeutronConnection",
      type: "text",
      label: "Connection from Neutron",
    },
    {
      if: (data) => !!data.chainId && data.chainId !== "neutron-1",
      key: "ibcTransferTimeout",
      type: "text",
      label: "IBC transfer timeout (seconds)",
    },
    {
      key: "liquidStaking",
      type: "group",
      label: "Liquid staking",
      indent: true,
      fields: [
        {
          key: "chain",
          type: "dropdown",
          label: "Chain",
          options: [
            {
              label: "Stride",
              value: "stride",
            },
            {
              label: "Another",
              value: "another",
            },
          ],
        },
        {
          key: "toNeutron",
          type: "group",
          label: "IBC From LS Hub To Neutron",
          fields: [
            {
              key: "channel",
              type: "text",
              label: "Channel",
              inlineLabel: true,
            },
            {
              key: "connection",
              type: "text",
              label: "Connection",
              inlineLabel: true,
            },
          ],
        },
        {
          key: "channelFromPartyChainToLs",
          type: "text",
          label: "IBC Channel from Party to LS Hub",
        },
        {
          key: "lsDenom",
          type: "group",
          label: "Denom",
          fields: [
            {
              key: "nativeLs",
              type: "text",
              label: "LS Hub native denom",
              inlineLabel: true,
            },
            {
              key: "ibcNeutronLs",
              type: "text",
              label: "IBC denom on Neutron",
              inlineLabel: true,
            },
          ],
        },
      ],
    },
    {
      key: "liquidityDestination",
      type: "group",
      label: "Liquidity destination",
      indent: true,
      fields: [
        {
          key: "dex",
          type: "dropdown",
          label: "DEX",
          options: [
            {
              label: "Osmosis",
              value: "osmosis",
            },
            {
              label: "Astroport (Neutron)",
              value: "astroport",
            },
          ],
        },
        {
          key: "pool",
          type: "dropdown",
          label: "Pool",
          options: [
            {
              label: "Pool 1",
              value: "1",
            },
            {
              label: "Pool 2",
              value: "2",
            },
            {
              label: "Pool 3",
              value: "3",
            },
          ],
        },
        {
          key: "expectedPrice",
          type: "text",
          label: "Expected price",
        },
        {
          key: "acceptablePriceDelta",
          type: "text",
          label: "Acceptable price delta (in %)",
        },
        {
          key: "lpLimit1",
          type: "text",
          label: "LP limit 1",
        },
        {
          key: "lpLimit2",
          type: "text",
          label: "LP limit 2",
        },
        {
          key: "slippageTolerance",
          type: "text",
          label: "Slippage tolerance (in %)",
        },
      ],
    },
  ],
  makeContractText: (a, b, both) => {
    const aName = a.name || "Party A";
    const bName = "TODO";
    const aSource =
      CHAIN_ID_OPTIONS.find(({ value }) => value === a.chainId)?.label ||
      a.chainId;
    return (
      <>
        <h1 className="text-h2 font-bold">I. Summary</h1>

        <p>
          <AFieldRenderer>{aName}</AFieldRenderer> proposes to enter into a
          one-party liquidity sharing Covenant.
        </p>

        <p>
          <AFieldRenderer>{aName}</AFieldRenderer> will contribute{" "}
          <AFieldRenderer>
            {a.amount} {a.denom?.native}.
          </AFieldRenderer>
          All assets will be used to provide liquidity on the{" "}
          <BothFieldRenderer>
            {both.liquidityDestination?.pool}
          </BothFieldRenderer>{" "}
          pool on{" "}
          <BothFieldRenderer>
            {both.liquidityDestination?.dex}
          </BothFieldRenderer>
          .
        </p>

        <p>
          This swap will happen entirely on-chain without any intermediaries.
        </p>

        <h1 className="text-h2 font-bold">II. Liquidity Provisioning Terms</h1>

        <h2 className="text-h3 font-semibold">
          A. <AFieldRenderer>{aName}</AFieldRenderer> Details
        </h2>

        <p>
          <AFieldRenderer>{aName}</AFieldRenderer> will send{" "}
          <AFieldRenderer>
            {a.amount} {a.denom?.native}
          </AFieldRenderer>{" "}
          to the Covenant for liquidity provisioning. The Covenant will hold the
          liquidity provider (LP) tokens that result from providing liquidity.
          When the time comes to return any assets to{" "}
          <AFieldRenderer>{aName}</AFieldRenderer>, those assets will be
          directed to <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer> on{" "}
          <AFieldRenderer>{aSource}</AFieldRenderer>.
        </p>
        <h2 className="text-h3 font-semibold">C. Deposit Deadline</h2>

        {!both.depositDeadlineStrategy ||
        both.depositDeadlineStrategy === "none" ? (
          <p>
            There is no deposit deadline. The liquidity provisioning will occur
            once both parties have sent their assets to the Covenant.
          </p>
        ) : (
          <p>
            The party has until{" "}
            <BothFieldRenderer>{both.depositDeadline?.time}</BothFieldRenderer>{" "}
            to send their assets to the Covenant. The liquidity provisioning
            will occur once both parties have sent their assets to the Covenant.
            If only one party has sent its assets to the Covenant by the time
            the deadline has been reached, no liquidity provisioning will occur,
            and the Covenant will return the assets to the sending party&apos;s
            return address. <AFieldRenderer>{aName}</AFieldRenderer>&apos;s
            return address is{" "}
            <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer>, and{" "}
          </p>
        )}

        <h2 className="text-h3 font-semibold">D. Withdrawal</h2>

        <p>
          After one party sends its assets to the Covenant, that party may
          withdraw its assets any time prior to the other party sending its
          assets to the Covenant.
        </p>

        <p>
          The address authorized to withdraw{" "}
          <AFieldRenderer>{aName}</AFieldRenderer>&apos;s assets is{" "}
          <AFieldRenderer>{a.neutronAddress}</AFieldRenderer>.
        </p>

        <h2 className="text-h3 font-semibold">E. Destination</h2>

        <p>
          Once both parties have sent their assets to the Covenant, the Covenant
          will use the assets to provide liquidity on the{" "}
          <BothFieldRenderer>
            {both.liquidityDestination?.pool}
          </BothFieldRenderer>{" "}
          pool on{" "}
          <BothFieldRenderer>
            {both.liquidityDestination?.dex}
          </BothFieldRenderer>
          .
        </p>

        <h2 className="text-h3 font-semibold">F. Duration</h2>

        <p>
          The assets will remain in the LP position for{" "}
          <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer> days.
        </p>

        <h2 className="text-h3 font-semibold">G. Redemption</h2>

        {!both.completionTrigger || both.completionTrigger === "automatic" ? (
          <p>
            After <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer> days,
            the Covenant will automatically redeem the LP tokens for the
            underlying assets.
          </p>
        ) : both.completionTrigger === "both" ? (
          <p>
            After <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer> days,
            the Covenant will redeem the LP tokens for the underlying assets
            once both parties agree to redeem.
          </p>
        ) : both.completionTrigger === "either" ? (
          <p>
            After <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer> days,
            the Covenant will redeem the LP tokens for the underlying assets
            once either of the parties decides to redeem.
          </p>
        ) : null}

        {!both.uponCompletion || both.uponCompletion === "split" ? (
          <p>
            Upon redemption, the Covenant will direct half of{" "}
            <AFieldRenderer>{a.denom?.native}</AFieldRenderer> and half of{" "}
            <BFieldRenderer>{b.denom?.native}</BFieldRenderer> to{" "}
            <AFieldRenderer>{aName}</AFieldRenderer> and direct the remaining
            halves to <BFieldRenderer>{bName}</BFieldRenderer>.
          </p>
        ) : both.uponCompletion === "maintain" ? (
          <p>
            Upon redemption, the Covenant will direct all of{" "}
            <AFieldRenderer>{a.denom?.native}</AFieldRenderer> to
            <AFieldRenderer>{aName}</AFieldRenderer> and all of{" "}
            <BFieldRenderer>{b.denom?.native}</BFieldRenderer> to{" "}
            <BFieldRenderer>{bName}</BFieldRenderer>.
          </p>
        ) : both.uponCompletion === "swap" ? (
          <p>
            Upon redemption, the Covenant will direct all of{" "}
            <AFieldRenderer>{a.denom?.native}</AFieldRenderer> to
            <BFieldRenderer>{bName}</BFieldRenderer> and all of{" "}
            <BFieldRenderer>{b.denom?.native}</BFieldRenderer> to{" "}
            <AFieldRenderer>{aName}</AFieldRenderer>.
          </p>
        ) : null}

        <h2 className="text-h3 font-semibold">H. Early exit</h2>

        {both.ragequitAllowed ? (
          <p>
            While both parties have committed to maintaining the liquidity
            position for at least{" "}
            <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer> days,
            either party has the option to early exit at any time. The fee for
            early exit is{" "}
            <BothFieldRenderer>{both.ragequitPenalty?.value}</BothFieldRenderer>
            %, which will apply across all assets returned to the exiting party.
            All fee payments will be directed to the party that did not opt to
            exit early.
          </p>
        ) : (
          <p>
            There is no option to exit the liquidity position early. Once the
            Covenant initiates the liquidity position, that liquidity will
            remain in the pool for at least{" "}
            <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer> days.
          </p>
        )}

        <h2 className="text-h3 font-semibold">I. Slippage protection</h2>

        <p>
          The Covenant expects a ratio of 1{" "}
          <AFieldRenderer>{a.denom?.native}</AFieldRenderer> to{" "}
          <BothFieldRenderer>{both.expectedRatio}</BothFieldRenderer>{" "}
          <BFieldRenderer>{b.denom?.native}</BFieldRenderer>.
        </p>

        <p>
          If the ratio between{" "}
          <AFieldRenderer>{a.denom?.native}</AFieldRenderer> and{" "}
          <BFieldRenderer>{b.denom?.native}</BFieldRenderer> is within
          <BothFieldRenderer>{both.acceptableRatioDelta}</BothFieldRenderer>% of
          the expected ratio by the time both parties have deposited their
          assets, the Covenant will move forward with the liquidity
          provisioning. Any excess tokens will be{" "}
          <BothFieldRenderer>
            {both.handleRemainder === "single"
              ? "provided as single-sided liquidity into the same pool"
              : both.handleRemainder === "return"
                ? "returned to the party who sent that asset"
                : null}
          </BothFieldRenderer>
          .
        </p>

        <p>
          If the ratio changes by more than{" "}
          <BothFieldRenderer>{both.acceptableRatioDelta}</BothFieldRenderer>%,
          the Covenant will wait up to{" "}
          <BothFieldRenderer>{both.lpRetryDays}</BothFieldRenderer> days for the
          prices to fall back within{" "}
          <BothFieldRenderer>{both.acceptableRatioDelta}</BothFieldRenderer>% of
          the acceptable ratio. During this time, either party may withdraw its
          assets, or both parties could agree to a wider acceptable ratio delta.
          If no resolution is made within{" "}
          <BothFieldRenderer>{both.lpRetryDays}</BothFieldRenderer> days, the
          Covenant will return <AFieldRenderer>{aName}</AFieldRenderer>&apos;s
          assets to <AFieldRenderer>{aName}</AFieldRenderer>.
        </p>

        <h2 className="text-h3 font-semibold">J. Fallback split</h2>

        <p>
          Certain circumstances may lead to unforeseen assets accruing within
          the Covenant, such as a protocol airdropping assets to{" "}
          <AFieldRenderer>{a.denom?.native}</AFieldRenderer>
          holders. In the event that unforeseen assets accrue within the
          Covenant, <BothFieldRenderer>{both.fallbackSplit}</BothFieldRenderer>%
          will be directed to <AFieldRenderer>{aName}</AFieldRenderer>.
        </p>

        <h2 className="text-h3 font-semibold">K. Emergency administrator</h2>

        {both.emergencyAdminEnabled ? (
          <p>
            This Covenant&apos;s emergency administrator is{" "}
            <BothFieldRenderer>{both.emergencyAdmin?.value}</BothFieldRenderer>
          </p>
        ) : (
          <p>This covenant does not have an emergency administrator.</p>
        )}

        <h1 className="text-h2 font-bold">III. Next Steps</h1>

        <p>
          This proposal was automatically generated at {VALENCE_DOMAIN}. Reach
          out if you have any questions or feature requests:{" "}
          <LinkText variant="primary" blankTarget={true} href={X_URL}>
            {X_HANDLE}
          </LinkText>
          .
        </p>
      </>
    );
  },
  makeInstantiateMsg: (a, b, both) => ({
    a,
    b,
    both,
  }),
};
