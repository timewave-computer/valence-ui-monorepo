"use client";

import {
  Button,
  Checkbox,
  Dropdown,
  DropdownOption,
  TextInput,
} from "@/components";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import Image from "next/image";

const CovenantPage = () => {
  const [covenantTypeSelection, setCovenantType] =
    useState<CovenantTypeSelector>(TYPE_OPTIONS[0].value);
  const [numParties, setNumParties] = useState<"1" | "2">("2");

  const covenantType: CovenantType =
    covenantTypeSelection === "swap"
      ? "swapLp"
      : numParties === "1"
      ? "onePartyPol"
      : "twoPartyPol";
  const covenantSelected =
    COVENANT_TYPES[covenantType] || Object.values(COVENANT_TYPES)[0];

  const [contractDisplayMode, setContractDisplayMode] = useState<
    "contract" | "json"
  >("contract");

  const [partyAData, setPartyAData] = useState<Record<string, any>>({});
  const [partyBData, setPartyBData] = useState<Record<string, any>>({});

  const [bothPartiesData, setBothPartiesData] = useState<Record<string, any>>(
    {}
  );

  const json = JSON.stringify(
    covenantSelected.makeInstantiateMsg(
      partyAData,
      partyBData,
      bothPartiesData
    ),
    null,
    2
  );

  return (
    <main className="flex grow min-h-0 flex-col bg-valence-white text-valence-black">
      <div className="flex flex-row items-stretch grow min-h-0">
        <div className="overflow-y-auto flex flex-col items-stretch w-[20rem] shrink-0 border-r border-valence-black overflow-hidden pt-4">
          <div className="px-4 pb-8 flex flex-col gap-2 border-b border-valence-black">
            <Image
              className="mt-8 mb-6"
              src="/img/covenant.svg"
              alt="Covenant illustration"
              width={226}
              height={144}
            />

            <h1 className="text-xl font-bold">Covenant</h1>

            <p>
              To begin, select the type of Covenant you are interested in
              creating, and set the Covenant parameters. Pressing
              &quot;Propose&quot; will deploy a smart contract with the Covenant
              terms and create the governance proposal(s) required to complete
              the Covenant.
            </p>

            <p className="font-bold mt-4">Covenant type</p>
            <Dropdown
              options={TYPE_OPTIONS}
              selected={covenantTypeSelection}
              onSelected={setCovenantType}
            />

            {covenantTypeSelection === "pol" && (
              <div className="space-y-2 mt-2">
                <p className="font-bold">How many parties?</p>
                <Dropdown
                  options={POL_TYPE_PARTIES_OPTIONS}
                  selected={numParties}
                  onSelected={setNumParties}
                />
              </div>
            )}

            <Button className="mt-6" onClick={() => {}} disabled>
              Propose
            </Button>
          </div>

          <div className="flex flex-col items-stretch grow">
            <div className="p-4 flex flex-col gap-5 border-l-8 border-l-valence-red pb-8">
              <div className="flex flex-row items-center gap-2">
                <div className="w-5 h-5 rounded-sm bg-valence-red"></div>

                <h1 className="text-base font-bold text-valence-black">
                  Party A
                </h1>
              </div>

              {COVENANT_TYPES[covenantType]?.each.map((field) => (
                <Field
                  key={field.key}
                  field={field}
                  value={partyAData[field.key]}
                  data={partyAData}
                  onChange={(value) =>
                    setPartyAData((prev) => ({ ...prev, [field.key]: value }))
                  }
                />
              ))}
            </div>

            {COVENANT_TYPES[covenantType]?.parties === 2 && (
              <>
                <div className="h-[1px] bg-valence-black shrink-0"></div>

                <div className="p-4 flex flex-col gap-5 border-l-8 border-valence-blue pb-8">
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-5 h-5 rounded-sm bg-valence-blue"></div>

                    <h1 className="text-base font-bold text-valence-black">
                      Party B
                    </h1>
                  </div>

                  {COVENANT_TYPES[covenantType]?.each.map((field) => (
                    <Field
                      key={field.key}
                      field={field}
                      value={partyBData[field.key]}
                      data={partyBData}
                      onChange={(value) =>
                        setPartyBData((prev) => ({
                          ...prev,
                          [field.key]: value,
                        }))
                      }
                    />
                  ))}
                </div>
              </>
            )}

            {COVENANT_TYPES[covenantType]?.both && (
              <>
                <div className="h-[1px] bg-valence-black shrink-0"></div>

                <div className="p-4 flex flex-col gap-5 border-l-8 border-valence-purple pb-8">
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-5 h-5 rounded-sm bg-valence-purple"></div>

                    <h1 className="text-base text-valence-black font-bold">
                      Both Parties
                    </h1>
                  </div>

                  {COVENANT_TYPES[covenantType]!.both!.map((field) => (
                    <Field
                      key={field.key}
                      field={field}
                      value={bothPartiesData[field.key]}
                      data={bothPartiesData}
                      onChange={(value) =>
                        setBothPartiesData((prev) => ({
                          ...prev,
                          [field.key]: value,
                        }))
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col bg-valence-lightgray grow">
          <div className="flex flex-row items-stretch justify-between border-b border-valence-black">
            <div className="flex flex-row items-stretch">
              <div
                className={clsx(
                  "border-r border-valence-black flex flex-col justify-center items-center p-4 cursor-pointer",
                  contractDisplayMode === "contract" && "bg-valence-white"
                )}
                onClick={() => setContractDisplayMode("contract")}
              >
                <p>Contract</p>
              </div>
              <div
                className={clsx(
                  "border-r border-valence-black flex flex-col justify-center items-center p-4 cursor-pointer",
                  contractDisplayMode === "json" && "bg-valence-white"
                )}
                onClick={() => setContractDisplayMode("json")}
              >
                <p>JSON</p>
              </div>
            </div>

            <div className="flex flex-row items-stretch">
              <div
                className="flex flex-col justify-center items-center p-4 cursor-pointer text-base"
                onClick={() => {
                  navigator.clipboard.writeText(json);
                }}
              >
                <p>Copy text</p>
              </div>
              <div
                className="flex flex-col justify-center items-center p-4 cursor-pointer text-base"
                onClick={() => {}}
              >
                <p>Download</p>
              </div>
            </div>
          </div>

          <div
            className={clsx(
              "overflow-y-auto text-valence-black grow flex flex-row items-stretch",
              contractDisplayMode === "json" ? "font-mono" : "font-serif"
            )}
          >
            {contractDisplayMode === "json" ? (
              <>
                <div className="shrink-0 flex flex-col p-4 text-valence-gray border-r border-valence-gray text-sm">
                  {new Array((json.match(/\n/g) || "").length + 1)
                    .fill(0)
                    .map((_, i) => (
                      <p key={i}>{i + 1}</p>
                    ))}
                </div>

                <div className="p-4 grow text-sm">
                  <pre>{json}</pre>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4 grow p-8">
                {covenantSelected.makeContractText(
                  partyAData,
                  partyBData,
                  bothPartiesData
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CovenantPage;

type CovenantTypeSelector = "swap" | "pol";
type CovenantType = "swapLp" | "onePartyPol" | "twoPartyPol";

type Field = {
  key: string;
  label?: string;
  placeholder?: string;
  if?: (data: any) => boolean;
} & (
  | {
      type: "text";
      /**
       * Whether or not the label should inline.
       */
      inlineLabel?: boolean;
    }
  | {
      type: "check";
    }
  | {
      type: "dropdown";
      options: DropdownOption<string>[];
    }
  | {
      type: "group";
      fields: Field[];
      /**
       * Whether or not to bold the group title.
       */
      bold?: boolean;
      /**
       * Whether or not to indent the group fields.
       */
      indent?: boolean;
    }
);

type FieldProps = {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  /**
   * Top-level data object.
   */
  data: Record<string, any>;
};

const Field = ({ field, value, onChange, data }: FieldProps) => {
  if (field.if && !field.if(data)) {
    return null;
  }

  return (
    <div
      className={clsx(
        "flex gap-2",
        field.type === "check"
          ? "flex-row justify-between items-center"
          : "flex-col"
      )}
    >
      {!!field.label && !(field.type === "text" && field.inlineLabel) && (
        <p>{field.label}</p>
      )}

      {field.type === "text" ? (
        <TextInput
          input={value}
          onChange={onChange}
          containerClassName="w-full"
          label={field.inlineLabel ? field.label : undefined}
          placeholder={field.placeholder}
        />
      ) : field.type === "check" ? (
        <Checkbox checked={!!value} onChange={onChange} />
      ) : field.type === "dropdown" ? (
        <Dropdown
          options={field.options}
          selected={value}
          onSelected={onChange}
        />
      ) : field.type === "group" ? (
        <div
          className={clsx(
            "flex flex-col gap-4",
            field.indent && "pl-4 p-2 border-l-2 border-valence-lightgray"
          )}
        >
          {field.fields.map((field) => (
            <Field
              key={field.key}
              field={field}
              value={value?.[field.key]}
              data={data}
              onChange={(newValue) =>
                onChange({
                  ...(value || {}),
                  [field.key]: newValue,
                })
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const TYPE_OPTIONS: DropdownOption<CovenantTypeSelector>[] = [
  {
    label: "Swap",
    value: "swap",
  },
  {
    label: "Provide Liquidity",
    value: "pol",
  },
];

const POL_TYPE_PARTIES_OPTIONS: DropdownOption<"1" | "2">[] = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
];

const CHAIN_ID_OPTIONS: DropdownOption<string>[] = [
  {
    label: "Cosmos Hub",
    value: "cosmoshub-4",
  },
  {
    label: "Neutron",
    value: "neutron-1",
  },
  {
    label: "Osmosis",
    value: "osmosis-1",
  },
];

const COVENANT_TYPES: Record<
  CovenantType,
  {
    parties: 1 | 2;
    each: Field[];
    both?: Field[];
    makeContractText: (
      aData: Record<string, any>,
      bData: Record<string, any>,
      bothData: Record<string, any>
    ) => ReactNode;
    makeInstantiateMsg: (
      aData: Record<string, any>,
      bData: Record<string, any>,
      bothData: Record<string, any>
    ) => Record<string, any>;
  }
> = {
  swapLp: {
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
            placeholder: "2024-02-15 12:00:00 +0000",
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
          <h1 className="text-xl font-bold">I. Summary</h1>

          <p>
            <AFieldRenderer>{aName}</AFieldRenderer> and{" "}
            <BFieldRenderer>{bName}</BFieldRenderer> propose to enter into a
            token swap Covenant with each other.
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

          <h1 className="text-xl font-bold">II. Swap Terms</h1>

          <h2 className="text-lg font-semibold">
            A. <AFieldRenderer>{aName}</AFieldRenderer> Details
          </h2>

          <p>
            <AFieldRenderer>{aName}</AFieldRenderer> will send{" "}
            <AFieldRenderer>
              {a.amount} {a.denom?.native}
            </AFieldRenderer>{" "}
            to the Covenant for swapping. The assets that{" "}
            <AFieldRenderer>{aName}</AFieldRenderer> receives in return will
            be directed to{" "}
            <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer> on{" "}
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
            to the Covenant for swapping. The assets that{" "}
            <BFieldRenderer>{bName}</BFieldRenderer> receives in return will be
            directed to <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer>{" "}
            on <BFieldRenderer>{bSource}</BFieldRenderer>.
          </p>

          <h2 className="text-lg font-semibold">C. Deposit Deadline</h2>

          {!both.depositDeadlineStrategy ||
          both.depositDeadlineStrategy === "none" ? (
            <p>
              There is no deposit deadline. The swap will occur once both
              parties have sent their assets to the Covenant.
            </p>
          ) : (
            <p>
              Both parties have until{" "}
              <BothFieldRenderer>
                {both.depositDeadline?.time}
              </BothFieldRenderer>{" "}
              to send their assets to the Covenant. The swap will occur once
              both parties have sent their assets to the Covenant. If only one
              party has sent its assets to the Covenant by the time the deadline
              has been reached, no swap will occur, and the Covenant will return
              the assets to the sending party&apos;s return address.{" "}
              <AFieldRenderer>{aName}</AFieldRenderer>&apos;s return address is{" "}
              <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer>, and{" "}
              <BFieldRenderer>{bName}</BFieldRenderer>&apos;s return address is{" "}
              <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer>.
            </p>
          )}

          <h2 className="text-lg font-semibold">D. Withdrawal</h2>

          <p>
            After one party sends its assets to the Covenant, that party may
            withdraw its assets any time prior to the other party sending its
            assets to the Covenant. The address authorized to withdraw{" "}
            <AFieldRenderer>{aName}</AFieldRenderer>&apos;s assets is{" "}
            <AFieldRenderer>{a.neutronAddress}</AFieldRenderer>, and the address
            authorized to withdraw <BFieldRenderer>{bName}</BFieldRenderer>
            &apos;s assets is{" "}
            <BFieldRenderer>{b.neutronAddress}</BFieldRenderer>.
          </p>

          <h1 className="text-xl font-bold">III. Next Steps</h1>

          <p>
            This proposal was automatically generated at timewave.computer.
            Reach out if you have any questions or feature requests:
            @timewavelabs.
          </p>
        </>
      );
    },
    makeInstantiateMsg: (a, b, both) => ({
      a,
      b,
      both,
    }),
  },
  onePartyPol: {
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
            token swap Covenant with each other.
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

          <h1 className="text-xl font-bold">II. Swap Terms</h1>

          <h2 className="text-lg font-semibold">
            A. <AFieldRenderer>{aName}</AFieldRenderer> Details
          </h2>

          <p>
            <AFieldRenderer>{aName}</AFieldRenderer> will send{" "}
            <AFieldRenderer>
              {a.amount} {a.denom?.native}
            </AFieldRenderer>{" "}
            to the Covenant for swapping. The assets that{" "}
            <AFieldRenderer>{aName}</AFieldRenderer> receives in return will
            be directed to{" "}
            <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer> on{" "}
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
            to the Covenant for swapping. The assets that{" "}
            <BFieldRenderer>{bName}</BFieldRenderer> receives in return will be
            directed to <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer>{" "}
            on <BFieldRenderer>{bSource}</BFieldRenderer>.
          </p>

          <h2 className="text-lg font-semibold">C. Deposit Deadline</h2>

          {!both.depositDeadlineStrategy ||
          both.depositDeadlineStrategy === "none" ? (
            <p>
              There is no deposit deadline. The swap will occur once both
              parties have sent their assets to the Covenant.
            </p>
          ) : (
            <p>
              Both parties have until{" "}
              <BothFieldRenderer>
                {both.depositDeadline?.time}
              </BothFieldRenderer>{" "}
              to send their assets to the Covenant. The swap will occur once
              both parties have sent their assets to the Covenant. If only one
              party has sent its assets to the Covenant by the time the deadline
              has been reached, no swap will occur, and the Covenant will return
              the assets to the sending party&apos;s return address.{" "}
              <AFieldRenderer>{aName}</AFieldRenderer>&apos;s return address is{" "}
              <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer>, and{" "}
              <BFieldRenderer>{bName}</BFieldRenderer>&apos;s return address is{" "}
              <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer>.
            </p>
          )}

          <h2 className="text-lg font-semibold">D. Withdrawal</h2>

          <p>
            After one party sends its assets to the Covenant, that party may
            withdraw its assets any time prior to the other party sending its
            assets to the Covenant. The address authorized to withdraw{" "}
            <AFieldRenderer>{aName}</AFieldRenderer>&apos;s assets is{" "}
            <AFieldRenderer>{a.neutronAddress}</AFieldRenderer>, and the address
            authorized to withdraw <BFieldRenderer>{bName}</BFieldRenderer>
            &apos;s assets is{" "}
            <BFieldRenderer>{b.neutronAddress}</BFieldRenderer>.
          </p>

          <h1 className="text-xl font-bold">III. Next Steps</h1>

          <p>
            This proposal was automatically generated at timewave.computer.
            Reach out if you have any questions or feature requests:
            @timewavelabs.
          </p>
        </>
      );
    },
    makeInstantiateMsg: (a, b, both) => ({
      a,
      b,
      both,
    }),
  },
  twoPartyPol: {
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
            label: "Either party",
            value: "either",
          },
          {
            label: "Both parties",
            value: "both",
          },
        ],
      },
      {
        key: "ragequit",
        type: "text",
        label: "Ragequit penalty (in %)",
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
            key: "acceptablePriceDelta",
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
                label: "Other",
                value: "other",
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
        key: "emergencyAdminAddress",
        type: "group",
        if: (data) => !!data?.emergencyAdminEnabled,
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
            token swap Covenant with each other.
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

          <h1 className="text-xl font-bold">II. Swap Terms</h1>

          <h2 className="text-lg font-semibold">
            A. <AFieldRenderer>{aName}</AFieldRenderer> Details
          </h2>

          <p>
            <AFieldRenderer>{aName}</AFieldRenderer> will send{" "}
            <AFieldRenderer>
              {a.amount} {a.denom?.native}
            </AFieldRenderer>{" "}
            to the Covenant for swapping. The assets that{" "}
            <AFieldRenderer>{aName}</AFieldRenderer> receives in return will
            be directed to{" "}
            <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer> on{" "}
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
            to the Covenant for swapping. The assets that{" "}
            <BFieldRenderer>{bName}</BFieldRenderer> receives in return will be
            directed to <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer>{" "}
            on <BFieldRenderer>{bSource}</BFieldRenderer>.
          </p>

          <h2 className="text-lg font-semibold">C. Deposit Deadline</h2>

          {!both.depositDeadlineStrategy ||
          both.depositDeadlineStrategy === "none" ? (
            <p>
              There is no deposit deadline. The swap will occur once both
              parties have sent their assets to the Covenant.
            </p>
          ) : (
            <p>
              Both parties have until{" "}
              <BothFieldRenderer>
                {both.depositDeadline?.time}
              </BothFieldRenderer>{" "}
              to send their assets to the Covenant. The swap will occur once
              both parties have sent their assets to the Covenant. If only one
              party has sent its assets to the Covenant by the time the deadline
              has been reached, no swap will occur, and the Covenant will return
              the assets to the sending party&apos;s return address.{" "}
              <AFieldRenderer>{aName}</AFieldRenderer>&apos;s return address is{" "}
              <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer>, and{" "}
              <BFieldRenderer>{bName}</BFieldRenderer>&apos;s return address is{" "}
              <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer>.
            </p>
          )}

          <h2 className="text-lg font-semibold">D. Withdrawal</h2>

          <p>
            After one party sends its assets to the Covenant, that party may
            withdraw its assets any time prior to the other party sending its
            assets to the Covenant. The address authorized to withdraw{" "}
            <AFieldRenderer>{aName}</AFieldRenderer>&apos;s assets is{" "}
            <AFieldRenderer>{a.neutronAddress}</AFieldRenderer>, and the address
            authorized to withdraw <BFieldRenderer>{bName}</BFieldRenderer>
            &apos;s assets is{" "}
            <BFieldRenderer>{b.neutronAddress}</BFieldRenderer>.
          </p>

          <h1 className="text-xl font-bold">III. Next Steps</h1>

          <p>
            This proposal was automatically generated at timewave.computer.
            Reach out if you have any questions or feature requests:
            @timewavelabs.
          </p>
        </>
      );
    },
    makeInstantiateMsg: (a, b, both) => ({
      a,
      b,
      both,
    }),
  },
};

const AFieldRenderer = ({ children }: { children: ReactNode }) => (
  <span className="p-0.5 bg-valence-red text-valence-white rounded-sm">
    {children}
  </span>
);

const BFieldRenderer = ({ children }: { children: ReactNode }) => (
  <span className="p-0.5 bg-valence-blue text-valence-white rounded-sm">
    {children}
  </span>
);

const BothFieldRenderer = ({ children }: { children: ReactNode }) => (
  <span className="p-0.5 bg-valence-purple text-valence-white rounded-sm">
    {children}
  </span>
);
