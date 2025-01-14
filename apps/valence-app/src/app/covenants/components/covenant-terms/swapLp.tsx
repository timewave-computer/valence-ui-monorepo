import { CHAIN_ID_OPTIONS } from "@/app/covenants/const";
import { VALENCE_DOMAIN, X_HANDLE, X_URL } from "@valence-ui/socials";
import {
  AFieldRenderer,
  BFieldRenderer,
  BothFieldRenderer,
} from "@/app/covenants/components";
import { CovenantFields } from ".";
import { LinkText } from "@valence-ui/ui-components";

export const swapLp: CovenantFields = {
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
          if: (data) => !data.chainId || data.chainId === "neutron-1",
          key: "native",
          type: "text",
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
      key: "covenantName",
      type: "text",
      label: "Covenant Name",
    },
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
          placeholder: "Today",
        },
      ],
    },
    {
      key: "clockTickMaxGas",
      type: "text",
      label: "Clock tick max gas",
      placeholder: "50",
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
        <h1 className="text-h5 font-bold">I. Summary</h1>

        <p>
          <AFieldRenderer>{aName}</AFieldRenderer> and{" "}
          <BFieldRenderer>{bName}</BFieldRenderer> propose to enter into a token
          swap Covenant with each other.
        </p>

        <p>
          <AFieldRenderer>{aName}</AFieldRenderer> will swap{" "}
          <AFieldRenderer>
            {a.amount} {a.denom?.native}
          </AFieldRenderer>{" "}
          for <BFieldRenderer>{bName}</BFieldRenderer>
          {"'s "}
          <BFieldRenderer>
            {b.amount} {b.denom?.native}
          </BFieldRenderer>
          .
        </p>

        <p>
          This swap will happen entirely on-chain without any intermediaries.
        </p>

        <h1 className="text-h5 font-bold">II. Swap Terms</h1>

        <h2 className="text-h6 font-semibold">
          A. <AFieldRenderer>{aName}</AFieldRenderer> Details
        </h2>

        <p>
          <AFieldRenderer>{aName}</AFieldRenderer> will send{" "}
          <AFieldRenderer>
            {a.amount} {a.denom?.native}
          </AFieldRenderer>{" "}
          to the Covenant for swapping. The assets that{" "}
          <AFieldRenderer>{aName}</AFieldRenderer> receives in return will be
          directed to <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer> on{" "}
          <AFieldRenderer>{aSource}</AFieldRenderer>.
        </p>

        <h2 className="text-h6 font-semibold">
          B. <BFieldRenderer>{bName}</BFieldRenderer> Details
        </h2>

        <p>
          <BFieldRenderer>{bName}</BFieldRenderer> will send{" "}
          <BFieldRenderer>
            {b.amount} {b.denom?.native}
          </BFieldRenderer>{" "}
          to the Covenant for swapping. The assets that{" "}
          <BFieldRenderer>{bName}</BFieldRenderer> receives in return will be
          directed to <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer> on{" "}
          <BFieldRenderer>{bSource}</BFieldRenderer>.
        </p>

        <h2 className="text-h6 font-semibold">C. Deposit Deadline</h2>

        {!both.depositDeadlineStrategy ||
        both.depositDeadlineStrategy === "none" ? (
          <p>
            There is no deposit deadline. The swap will occur once both parties
            have sent their assets to the Covenant.
          </p>
        ) : (
          <p>
            Both parties have until{" "}
            <BothFieldRenderer>{both.depositDeadline?.time}</BothFieldRenderer>{" "}
            to send their assets to the Covenant. The swap will occur once both
            parties have sent their assets to the Covenant. If only one party
            has sent its assets to the Covenant by the time the deadline has
            been reached, no swap will occur, and the Covenant will return the
            assets to the sending party&apos;s return address.{" "}
            <AFieldRenderer>{aName}</AFieldRenderer>&apos;s return address is{" "}
            <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer>, and{" "}
            <BFieldRenderer>{bName}</BFieldRenderer>&apos;s return address is{" "}
            <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer>.
          </p>
        )}

        <h2 className="text-h6 font-semibold">D. Withdrawal</h2>

        <p>
          After one party sends its assets to the Covenant, that party may
          withdraw its assets any time prior to the other party sending its
          assets to the Covenant. The address authorized to withdraw{" "}
          <AFieldRenderer>{aName}</AFieldRenderer>&apos;s assets is{" "}
          <AFieldRenderer>{a.neutronAddress}</AFieldRenderer>, and the address
          authorized to withdraw <BFieldRenderer>{bName}</BFieldRenderer>
          &apos;s assets is <BFieldRenderer>{b.neutronAddress}</BFieldRenderer>.
        </p>

        <h1 className="text-h5 font-bold">III. Next Steps</h1>

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
