"use client";

import {
  Button,
  Checkbox,
  DropdownDEPRECATED,
  DropdownOption,
  TextInput,
} from "@/components";
import { cn } from "@/utils";
import { ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FeatureFlags } from "@/utils";
import { createPortal } from "react-dom";
import { Overlay } from "@/components/Overlay";
import { StatusBar } from "@/components/StatusBar";

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

  const [partyAData, setPartyAData] = useState<Record<string, any>>(
    PLACEHOLDER_PARTY_A_DATA,
  );
  const [partyBData, setPartyBData] = useState<Record<string, any>>(
    PLACEHOLDER_PARTY_B_DATA,
  );

  const [bothPartiesData, setBothPartiesData] = useState<Record<string, any>>(
    {},
  );

  const json = JSON.stringify(
    covenantSelected.makeInstantiateMsg(
      partyAData,
      partyBData,
      bothPartiesData,
    ),
    null,
    2,
  );

  /***
   * Overlay logic
   */
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  // for repositioning based on container
  const [portalPosition, setPortalPosition] = useState({
    top: 0,
    left: 0,
    height: 0,
  });

  // this is needed to trigger a re-render to populate refs
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // take position of container, to place overlay appropriately
    if (containerRef.current && overlayRef.current) {
      const target = containerRef.current.getBoundingClientRect();

      const top = target.top;
      const left = target.left;
      const height = target.height;

      setPortalPosition({ top, left, height });
    }
  }, [isClient, setPortalPosition]);

  return (
    <main
      ref={containerRef}
      className="flex min-h-0 grow flex-col bg-valence-white text-valence-black"
    >
      {!FeatureFlags.COVENANTS_ENABLED() &&
        containerRef?.current &&
        createPortal(
          <Overlay
            ref={overlayRef}
            position={{
              top: portalPosition.top,
              left: portalPosition.left,
              height: portalPosition.height,
            }}
          >
            <StatusBar text="Coming soon" variant="primary" />
          </Overlay>,
          containerRef?.current,
        )}

      <div className="flex min-h-0 grow flex-row items-stretch">
        <div className="flex w-[20rem] shrink-0 flex-col items-stretch overflow-hidden overflow-y-auto border-r border-valence-black pt-4">
          <div className="flex flex-col gap-2 border-b border-valence-black px-4 pb-8">
            <Image
              className="mb-6 mt-8"
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

            <p className="mt-4 font-bold">Covenant type</p>
            <DropdownDEPRECATED
              options={TYPE_OPTIONS}
              selected={covenantTypeSelection}
              onSelected={setCovenantType}
            />

            {covenantTypeSelection === "pol" && (
              <div className="mt-2 space-y-2">
                <p className="font-bold">How many parties?</p>
                <DropdownDEPRECATED
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

          <div className="flex grow flex-col items-stretch">
            <div className="flex flex-col gap-5 border-l-8 border-l-valence-red p-4 pb-8">
              <div className="flex flex-row items-center gap-2">
                <div className="h-5 w-5 rounded-sm bg-valence-red"></div>

                <h1 className="text-base font-bold text-valence-black">
                  Party A
                </h1>
              </div>

              {COVENANT_TYPES[covenantType]?.each.map((field) => (
                <Field
                  key={`party-a-field-${field.key}`}
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
                <div className="h-[1px] shrink-0 bg-valence-black"></div>

                <div className="flex flex-col gap-5 border-l-8 border-valence-blue p-4 pb-8">
                  <div className="flex flex-row items-center gap-2">
                    <div className="h-5 w-5 rounded-sm bg-valence-blue"></div>

                    <h1 className="text-base font-bold text-valence-black">
                      Party B
                    </h1>
                  </div>

                  {COVENANT_TYPES[covenantType]?.each.map((field) => (
                    <Field
                      key={`party-b-field-${field.key}`}
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
                <div className="h-[1px] shrink-0 bg-valence-black"></div>

                <div className="flex flex-col gap-5 border-l-8 border-valence-purple p-4 pb-8">
                  <div className="flex flex-row items-center gap-2">
                    <div className="h-5 w-5 rounded-sm bg-valence-purple"></div>

                    <h1 className="text-base font-bold text-valence-black">
                      Both Parties
                    </h1>
                  </div>

                  {COVENANT_TYPES[covenantType]!.both!.map((field) => (
                    <Field
                      key={`both-party-field-${field.key}`}
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

        <div className="flex grow flex-col bg-valence-lightgray">
          <div className="flex flex-row items-stretch justify-between border-b border-valence-black">
            <div className="flex flex-row items-stretch">
              <div
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center border-r border-valence-black p-4",
                  contractDisplayMode === "contract" && "bg-valence-white",
                )}
                onClick={() => setContractDisplayMode("contract")}
              >
                <p>Contract</p>
              </div>
              <div
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center border-r border-valence-black p-4",
                  contractDisplayMode === "json" && "bg-valence-white",
                )}
                onClick={() => setContractDisplayMode("json")}
              >
                <p>JSON</p>
              </div>
            </div>

            <div className="flex flex-row items-stretch">
              <div
                className="flex cursor-pointer flex-col items-center justify-center p-4 text-base"
                onClick={() => {
                  navigator.clipboard.writeText(json);
                }}
              >
                <p>Copy text</p>
              </div>
              <div
                className="flex cursor-pointer flex-col items-center justify-center p-4 text-base"
                onClick={() => {}}
              >
                <p>Download</p>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "flex grow flex-col overflow-y-auto text-valence-black",
              contractDisplayMode === "json" ? "font-mono" : "font-serif",
            )}
          >
            {contractDisplayMode === "json" ? (
              <div className="flex shrink-0 grow flex-row items-stretch">
                <div className="flex shrink-0 flex-col border-r border-valence-gray p-4 text-sm text-valence-gray">
                  {new Array((json.match(/\n/g) || "").length + 1)
                    .fill(0)
                    .map((_, i) => (
                      <p key={i}>{i + 1}</p>
                    ))}
                </div>

                <div className="grow p-4 text-sm">
                  <pre>{json}</pre>
                </div>
              </div>
            ) : (
              <div className="flex shrink-0 grow flex-col gap-4 p-8">
                {covenantSelected.makeContractText(
                  partyAData,
                  partyBData,
                  bothPartiesData,
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
      className={cn(
        "flex gap-2",
        field.type === "check"
          ? "flex-row items-center justify-between"
          : "flex-col",
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
        <DropdownDEPRECATED
          options={field.options}
          selected={value}
          onSelected={onChange}
        />
      ) : field.type === "group" ? (
        <div
          className={cn(
            "flex flex-col gap-4",
            field.indent && "border-l-2 border-valence-lightgray p-2 pl-4",
          )}
        >
          {field.fields.map((field, i) => (
            <Field
              key={`dropdown-${i}-${field.key}`} // low pri TODO: find a way to construct key without index
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
      bothData: Record<string, any>,
    ) => ReactNode;
    makeInstantiateMsg: (
      aData: Record<string, any>,
      bData: Record<string, any>,
      bothData: Record<string, any>,
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
            <AFieldRenderer>{aName}</AFieldRenderer> receives in return will be
            directed to <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer>{" "}
            on <AFieldRenderer>{aSource}</AFieldRenderer>.
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

          <h1 className="text-xl font-bold">
            II. Liquidity Provisioning Terms
          </h1>

          <h2 className="text-lg font-semibold">
            A. <AFieldRenderer>{aName}</AFieldRenderer> Details
          </h2>

          <p>
            <AFieldRenderer>{aName}</AFieldRenderer> will send{" "}
            <AFieldRenderer>
              {a.amount} {a.denom?.native}
            </AFieldRenderer>{" "}
            to the Covenant for liquidity provisioning. The Covenant will hold
            the liquidity provider (LP) tokens that result from providing
            liquidity. When the time comes to return any assets to{" "}
            <AFieldRenderer>{aName}</AFieldRenderer>, those assets will be
            directed to <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer>{" "}
            on <AFieldRenderer>{aSource}</AFieldRenderer>.
          </p>

          <h2 className="text-lg font-semibold">
            B. <BFieldRenderer>{bName}</BFieldRenderer> Details
          </h2>

          <p>
            <BFieldRenderer>{bName}</BFieldRenderer> will send{" "}
            <BFieldRenderer>
              {b.amount} {b.denom?.native}
            </BFieldRenderer>{" "}
            to the Covenant for liquidity provisioning. The Covenant will hold
            the liquidity provider (LP) tokens that result from providing
            liquidity. When the time comes to return any assets to{" "}
            <BFieldRenderer>{bName}</BFieldRenderer>, those assets will be
            directed to <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer>{" "}
            on <BFieldRenderer>{bSource}</BFieldRenderer>.
          </p>

          <h2 className="text-lg font-semibold">C. Deposit Deadline</h2>

          {!both.depositDeadlineStrategy ||
          both.depositDeadlineStrategy === "none" ? (
            <p>
              There is no deposit deadline. The liquidity provisioning will
              occur once both parties have sent their assets to the Covenant.
            </p>
          ) : (
            <p>
              Both parties have until{" "}
              <BothFieldRenderer>
                {both.depositDeadline?.time}
              </BothFieldRenderer>{" "}
              to send their assets to the Covenant. The liquidity provisioning
              will occur once both parties have sent their assets to the
              Covenant. If only one party has sent its assets to the Covenant by
              the time the deadline has been reached, no liquidity provisioning
              will occur, and the Covenant will return the assets to the sending
              party&apos;s return address.{" "}
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
            assets to the Covenant.
          </p>

          <p>
            The address authorized to withdraw{" "}
            <AFieldRenderer>{aName}</AFieldRenderer>&apos;s assets is{" "}
            <AFieldRenderer>{a.neutronAddress}</AFieldRenderer>, and the address
            authorized to withdraw <BFieldRenderer>{bName}</BFieldRenderer>
            &apos;s assets is{" "}
            <BFieldRenderer>{b.neutronAddress}</BFieldRenderer>.
          </p>

          <h2 className="text-lg font-semibold">E. Destination</h2>

          <p>
            Once both parties have sent their assets to the Covenant, the
            Covenant will use the assets to provide liquidity on the{" "}
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
              After <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer>{" "}
              days, the Covenant will automatically redeem the LP tokens for the
              underlying assets.
            </p>
          ) : both.completionTrigger === "both" ? (
            <p>
              After <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer>{" "}
              days, the Covenant will redeem the LP tokens for the underlying
              assets once both parties agree to redeem.
            </p>
          ) : both.completionTrigger === "either" ? (
            <p>
              After <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer>{" "}
              days, the Covenant will redeem the LP tokens for the underlying
              assets once either of the parties decides to redeem.
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
              <BothFieldRenderer>
                {both.ragequitPenalty?.value}
              </BothFieldRenderer>
              %, which will apply across all assets returned to the exiting
              party. All fee payments will be directed to the party that did not
              opt to exit early.
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
            <BothFieldRenderer>{both.acceptableRatioDelta}</BothFieldRenderer>%
            of the expected ratio by the time both parties have deposited their
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
            <BothFieldRenderer>{both.lpRetryDays}</BothFieldRenderer> days for
            the prices to fall back within{" "}
            <BothFieldRenderer>{both.acceptableRatioDelta}</BothFieldRenderer>%
            of the acceptable ratio. During this time, either party may withdraw
            its assets, or both parties could agree to a wider acceptable ratio
            delta. If no resolution is made within{" "}
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
            Covenant,{" "}
            <BothFieldRenderer>{both.fallbackSplit}</BothFieldRenderer>% will be
            directed to <AFieldRenderer>{aName}</AFieldRenderer>, and the
            remaining assets will be directed to{" "}
            <BFieldRenderer>{bName}</BFieldRenderer>.
          </p>

          <h2 className="text-lg font-semibold">K. Emergency administrator</h2>

          {both.emergencyAdminEnabled ? (
            <p>
              This Covenant&apos;s emergency administrator is{" "}
              <BothFieldRenderer>
                {both.emergencyAdmin?.value}
              </BothFieldRenderer>
            </p>
          ) : (
            <p>This covenant does not have an emergency administrator.</p>
          )}

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

          <h1 className="text-xl font-bold">
            II. Liquidity Provisioning Terms
          </h1>

          <h2 className="text-lg font-semibold">
            A. <AFieldRenderer>{aName}</AFieldRenderer> Details
          </h2>

          <p>
            <AFieldRenderer>{aName}</AFieldRenderer> will send{" "}
            <AFieldRenderer>
              {a.amount} {a.denom?.native}
            </AFieldRenderer>{" "}
            to the Covenant for liquidity provisioning. The Covenant will hold
            the liquidity provider (LP) tokens that result from providing
            liquidity. When the time comes to return any assets to{" "}
            <AFieldRenderer>{aName}</AFieldRenderer>, those assets will be
            directed to <AFieldRenderer>{a.returnedAssetDest}</AFieldRenderer>{" "}
            on <AFieldRenderer>{aSource}</AFieldRenderer>.
          </p>

          <h2 className="text-lg font-semibold">
            B. <BFieldRenderer>{bName}</BFieldRenderer> Details
          </h2>

          <p>
            <BFieldRenderer>{bName}</BFieldRenderer> will send{" "}
            <BFieldRenderer>
              {b.amount} {b.denom?.native}
            </BFieldRenderer>{" "}
            to the Covenant for liquidity provisioning. The Covenant will hold
            the liquidity provider (LP) tokens that result from providing
            liquidity. When the time comes to return any assets to{" "}
            <BFieldRenderer>{bName}</BFieldRenderer>, those assets will be
            directed to <BFieldRenderer>{b.returnedAssetDest}</BFieldRenderer>{" "}
            on <BFieldRenderer>{bSource}</BFieldRenderer>.
          </p>

          <h2 className="text-lg font-semibold">C. Deposit Deadline</h2>

          {!both.depositDeadlineStrategy ||
          both.depositDeadlineStrategy === "none" ? (
            <p>
              There is no deposit deadline. The liquidity provisioning will
              occur once both parties have sent their assets to the Covenant.
            </p>
          ) : (
            <p>
              Both parties have until{" "}
              <BothFieldRenderer>
                {both.depositDeadline?.time}
              </BothFieldRenderer>{" "}
              to send their assets to the Covenant. The liquidity provisioning
              will occur once both parties have sent their assets to the
              Covenant. If only one party has sent its assets to the Covenant by
              the time the deadline has been reached, no liquidity provisioning
              will occur, and the Covenant will return the assets to the sending
              party&apos;s return address.{" "}
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
            assets to the Covenant.
          </p>

          <p>
            The address authorized to withdraw{" "}
            <AFieldRenderer>{aName}</AFieldRenderer>&apos;s assets is{" "}
            <AFieldRenderer>{a.neutronAddress}</AFieldRenderer>, and the address
            authorized to withdraw <BFieldRenderer>{bName}</BFieldRenderer>
            &apos;s assets is{" "}
            <BFieldRenderer>{b.neutronAddress}</BFieldRenderer>.
          </p>

          <h2 className="text-lg font-semibold">E. Destination</h2>

          <p>
            Once both parties have sent their assets to the Covenant, the
            Covenant will use the assets to provide liquidity on the{" "}
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
              After <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer>{" "}
              days, the Covenant will automatically redeem the LP tokens for the
              underlying assets.
            </p>
          ) : both.completionTrigger === "both" ? (
            <p>
              After <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer>{" "}
              days, the Covenant will redeem the LP tokens for the underlying
              assets once both parties agree to redeem.
            </p>
          ) : both.completionTrigger === "either" ? (
            <p>
              After <BothFieldRenderer>{both.lpHoldDays}</BothFieldRenderer>{" "}
              days, the Covenant will redeem the LP tokens for the underlying
              assets once either of the parties decides to redeem.
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
              <BothFieldRenderer>
                {both.ragequitPenalty?.value}
              </BothFieldRenderer>
              %, which will apply across all assets returned to the exiting
              party. All fee payments will be directed to the party that did not
              opt to exit early.
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
            <BothFieldRenderer>{both.acceptableRatioDelta}</BothFieldRenderer>%
            of the expected ratio by the time both parties have deposited their
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
            <BothFieldRenderer>{both.lpRetryDays}</BothFieldRenderer> days for
            the prices to fall back within{" "}
            <BothFieldRenderer>{both.acceptableRatioDelta}</BothFieldRenderer>%
            of the acceptable ratio. During this time, either party may withdraw
            its assets, or both parties could agree to a wider acceptable ratio
            delta. If no resolution is made within{" "}
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
            Covenant,{" "}
            <BothFieldRenderer>{both.fallbackSplit}</BothFieldRenderer>% will be
            directed to <AFieldRenderer>{aName}</AFieldRenderer>, and the
            remaining assets will be directed to{" "}
            <BFieldRenderer>{bName}</BFieldRenderer>.
          </p>

          <h2 className="text-lg font-semibold">K. Emergency administrator</h2>

          {both.emergencyAdminEnabled ? (
            <p>
              This Covenant&apos;s emergency administrator is{" "}
              <BothFieldRenderer>
                {both.emergencyAdmin?.value}
              </BothFieldRenderer>
            </p>
          ) : (
            <p>This covenant does not have an emergency administrator.</p>
          )}

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
  <span className="rounded-sm bg-valence-red p-0.5 text-valence-white">
    {children}
  </span>
);

const BFieldRenderer = ({ children }: { children: ReactNode }) => (
  <span className="rounded-sm bg-valence-blue p-0.5 text-valence-white">
    {children}
  </span>
);

const BothFieldRenderer = ({ children }: { children: ReactNode }) => (
  <span className="rounded-sm bg-valence-purple p-0.5 text-valence-white">
    {children}
  </span>
);

const PLACEHOLDER_PARTY_A_DATA = {
  chainId: "neutron-1",
  name: " Neutron",
  returnedAssetDest:
    "neutron1ajjddqsr9spepwsrt4u2nxpy4hmheyek5uxqc2gsy7sgt905s86sa3xzy6",
  neutronAddress:
    "neutron1fk0v8pmzc96depwljsl9pevuzz5fnj9s4xy8xaaj8zyc5c3pc8vsm00exh",
  amount: "100,000.00",
  denom: {
    native: "NTRN",
  },
};
const PLACEHOLDER_PARTY_B_DATA = {
  chainId: "cosmoshub-4",
  name: "Cosmos Hub",
  returnedAssetDest:
    "cosmos1zq5nue004v9z9x7fvtkfhexavlr5ndg2fz5yet9pekjqedvwrqwqren3m7",
  neutronAddress:
    "neutron1g5pwy6uvlzqsqacux9en725l62g9zc0r3ufqtqz8kdcrcfl7649s0qhk06",
  amount: "8,264.153855",
  denom: {
    native: "NTRN",
  },
};
