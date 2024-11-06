import { CHAIN_ID_OPTIONS } from "@/app/covenants/const";
import { VALENCE_DOMAIN, X_HANDLE, X_URL } from "@valence-ui/socials";
import {
  AFieldRenderer,
  BFieldRenderer,
  BothFieldRenderer,
} from "@/app/covenants/components";
import { CovenantFields } from ".";
import { LinkText } from "@/components";

export const twoPartyPol: CovenantFields = {
  parties: 2,
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
  ],
  both: [
    {
      key: "depositDeadlineStrategy",
      type: "dropdown",
      label: "Deposit deadline",
      options: [
        {
          label: "None",
          value: "none",
        },
        {
          label: "Time",
          value: "time",
        },
      ],
    },
    {
      key: "depositDeadline",
      type: "group",
      if: (data) =>
        !!data?.depositDeadlineStrategy &&
        data.depositDeadlineStrategy !== "none",
      fields: [
        {
          if: (data) => data?.depositDeadlineStrategy === "time",
          key: "time",
          type: "text",
          placeholder: "2024-02-15 12:00:00 +0000",
        },
      ],
    },
    {
      key: "lpRetryDays",
      type: "text",
      label: "LP retry duration (in days)",
    },
    {
      key: "lpHoldDays",
      type: "text",
      label: "LP hold duration (in days)",
    },
    {
      key: "uponCompletion",
      type: "dropdown",
      label: "Upon completion",
      options: [
        {
          label: "Split",
          value: "split",
        },
        {
          label: "Maintain Side",
          value: "maintain",
        },
        {
          label: "Swap Side",
          value: "swap",
        },
      ],
    },
    {
      key: "completionTrigger",
      type: "dropdown",
      label: "Completion trigger",
      options: [
        {
          label: "Automatic trigger",
          value: "automatic",
        },
        {
          label: "Both parties",
          value: "both",
        },
        {
          label: "Either party",
          value: "either",
        },
      ],
    },
    {
      key: "ragequitAllowed",
      type: "check",
      label: "Ragequit allowed",
    },
    {
      if: (data) => !!data?.ragequitAllowed,
      key: "ragequitPenalty",
      type: "group",
      indent: true,
      fields: [
        {
          key: "value",
          type: "text",
          label: "Penalty (%)",
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
              label: "Astroport",
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
          key: "expectedRatio",
          type: "text",
          label: "Expected ratio (1 denom A: X denom B)",
        },
        {
          key: "acceptableRatioDelta",
          type: "text",
          label: "Acceptable ratio delta (%)",
        },
        {
          key: "handleRemainder",
          type: "dropdown",
          label: "Handle remainder",
          options: [
            {
              label: "Single-sided liquidity",
              value: "single",
            },
            {
              label: "Return to sender",
              value: "return",
            },
          ],
        },
      ],
    },
    {
      key: "fallbackSplit",
      type: "text",
      label: "Fallback split (in % for party 1)",
    },
    {
      key: "emergencyAdminEnabled",
      type: "check",
      label: "Emergency admin",
    },
    {
      if: (data) => !!data?.emergencyAdminEnabled,
      key: "emergencyAdminAddress",
      type: "group",
      indent: true,
      fields: [
        {
          key: "value",
          type: "text",
          label: "Admin address",
        },
      ],
    },
  ],
  makeContractText: (a, b, both) => {
    const aName = a.name || "Party A";
    const aSource =
      CHAIN_ID_OPTIONS.find(({ value }) => value === a.chainId)?.label ||
      a.chainId;

    const bName = b.name || "Party B";
    const bSource =
      CHAIN_ID_OPTIONS.find(({ value }) => value === b.chainId)?.label ||
      a.chainId;

    return (
      <>
        <h1 className="text-xl font-bold">I. Summary</h1>

        <p>
          <AFieldRenderer>{aName}</AFieldRenderer> and{" "}
          <BFieldRenderer>{bName}</BFieldRenderer> propose to enter into a
          two-party liquidity sharing Covenant with each other.
        </p>

        <p>
          <AFieldRenderer>{aName}</AFieldRenderer> will contribute{" "}
          <AFieldRenderer>
            {a.amount} {a.denom?.native}
          </AFieldRenderer>
          , and <BFieldRenderer>{bName}</BFieldRenderer> will contribute{" "}
          <BFieldRenderer>
            {b.amount} {b.denom?.native}
          </BFieldRenderer>
          . All assets will be used to provide liquidity on the{" "}
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

        <h1 className="text-xl font-bold">II. Liquidity Provisioning Terms</h1>

        <h2 className="text-lg font-semibold">
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

        <h2 className="text-lg font-semibold">
          B. <BFieldRenderer>{bName}</BFieldRenderer> Details
        </h2>

        <p>
          <BFieldRenderer>{bName}</BFieldRenderer> will send{" "}
          <BFieldRenderer>
            {b.amount} {b.denom?.native}
          </BFieldRenderer>{" "}
          to the Covenant for liquidity provisioning. The Covenant will hold the
          liquidity provider (LP) tokens that result from providing liquidity.
          When the time comes to return any assets to{" "}
          <BFieldRenderer>{bName}</BFieldRenderer>, those assets will be
          directed to <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer> on{" "}
          <BFieldRenderer>{bSource}</BFieldRenderer>.
        </p>

        <h2 className="text-lg font-semibold">C. Deposit Deadline</h2>

        {!both.depositDeadlineStrategy ||
        both.depositDeadlineStrategy === "none" ? (
          <p>
            There is no deposit deadline. The liquidity provisioning will occur
            once both parties have sent their assets to the Covenant.
          </p>
        ) : (
          <p>
            Both parties have until{" "}
            <BothFieldRenderer>{both.depositDeadline?.time}</BothFieldRenderer>{" "}
            to send their assets to the Covenant. The liquidity provisioning
            will occur once both parties have sent their assets to the Covenant.
            If only one party has sent its assets to the Covenant by the time
            the deadline has been reached, no liquidity provisioning will occur,
            and the Covenant will return the assets to the sending party&apos;s
            return address. <AFieldRenderer>{aName}</AFieldRenderer>&apos;s
            return address is{" "}
            <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer>, and{" "}
            <BFieldRenderer>{bName}</BFieldRenderer>&apos;s return address is{" "}
            <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer>.
          </p>
        )}

        <h2 className="text-lg font-semibold">D. Withdrawal</h2>

        <p>
          After one party sends its assets to the Covenant, that party may
          withdraw its assets any time prior to the other party sending its
          assets to the Covenant.
        </p>

        <p>
          The address authorized to withdraw{" "}
          <AFieldRenderer>{aName}</AFieldRenderer>&apos;s assets is{" "}
          <AFieldRenderer>{a.neutronAddress}</AFieldRenderer>, and the address
          authorized to withdraw <BFieldRenderer>{bName}</BFieldRenderer>
          &apos;s assets is <BFieldRenderer>{b.neutronAddress}</BFieldRenderer>.
        </p>

        <h2 className="text-lg font-semibold">E. Destination</h2>

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

        <h2 className="text-lg font-semibold">F. Duration</h2>

        <p>
          The assets will remain in the LP position for{" "}
          <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer> days.
        </p>

        <h2 className="text-lg font-semibold">G. Redemption</h2>

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

        <h2 className="text-lg font-semibold">H. Early exit</h2>

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

        <h2 className="text-lg font-semibold">I. Slippage protection</h2>

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
          assets to <AFieldRenderer>{aName}</AFieldRenderer> and{" "}
          <BFieldRenderer>{bName}</BFieldRenderer>&apos;s assets to{" "}
          <BFieldRenderer>{bName}</BFieldRenderer>.
        </p>

        <h2 className="text-lg font-semibold">J. Fallback split</h2>

        <p>
          Certain circumstances may lead to unforeseen assets accruing within
          the Covenant, such as a protocol airdropping assets to{" "}
          <AFieldRenderer>{a.denom?.native}</AFieldRenderer>
          holders. In the event that unforeseen assets accrue within the
          Covenant, <BothFieldRenderer>{both.fallbackSplit}</BothFieldRenderer>%
          will be directed to <AFieldRenderer>{aName}</AFieldRenderer>, and the
          remaining assets will be directed to{" "}
          <BFieldRenderer>{bName}</BFieldRenderer>.
        </p>

        <h2 className="text-lg font-semibold">K. Emergency administrator</h2>

        {both.emergencyAdminEnabled ? (
          <p>
            This Covenant&apos;s emergency administrator is{" "}
            <BothFieldRenderer>{both.emergencyAdmin?.value}</BothFieldRenderer>
          </p>
        ) : (
          <p>This covenant does not have an emergency administrator.</p>
        )}

        <h1 className="text-xl font-bold">III. Next Steps</h1>

        <p>
          This proposal was automatically generated at {VALENCE_DOMAIN}. Reach
          out if you have any questions or feature requests:{" "}
          <LinkText className="font-medium hover:underline" href={X_URL}>
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
