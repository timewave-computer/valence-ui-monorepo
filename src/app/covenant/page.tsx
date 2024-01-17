"use client";

import {
  Button,
  Checkbox,
  Dropdown,
  DropdownOption,
  TextInput,
} from "@/components";
import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";

const CovenantPage = () => {
  const [covenantType, setCovenantType] = useState<CovenantType>(
    TYPE_OPTIONS[0].value
  );
  const [contractDisplayMode, setContractDisplayMode] = useState<
    "contract" | "json"
  >("contract");

  const [partyA, setPartyA] = useState("");
  const [partyAData, setPartyAData] = useState<Record<string, any>>({});

  const [partyB, setPartyB] = useState("");
  const [partyBData, setPartyBData] = useState<Record<string, any>>({});

  const [bothPartiesData, setBothPartiesData] = useState<Record<string, any>>(
    {}
  );

  const [partyAParameterA, setPartyAParameterA] = useState("");
  const [partyAParameterB, setPartyAParameterB] = useState("");
  const [partyAParameterC, setPartyAParameterC] = useState("");
  const [partyAParameterD, setPartyAParameterD] = useState("");
  const [partyAParameterE, setPartyAParameterE] = useState(true);

  const [partyBParameterA, setPartyBParameterA] = useState("");
  const [partyBParameterB, setPartyBParameterB] = useState("");
  const [partyBParameterC, setPartyBParameterC] = useState("");
  const [partyBParameterD, setPartyBParameterD] = useState("");
  const [partyBParameterE, setPartyBParameterE] = useState(true);

  return (
    <main className="flex grow min-h-0 flex-col bg-white text-black">
      <div className="flex flex-row items-stretch grow min-h-0">
        <div className="overflow-y-auto flex flex-col items-stretch w-[28rem] shrink-0 border-r border-black overflow-hidden">
          <div className="px-4 py-6 flex flex-col gap-2 border-bs border-black">
            <Image
              src="/img/covenant.png"
              alt="Covenant illustration"
              width={140}
              height={89}
            />

            <h1 className="text-xl font-bold mt-2">Covenant</h1>

            <p className="text-sm">
              To begin, choose a party on each side and set the covenant
              parameters. Pressing &quot;Propose&quot; will then deploy a smart
              contract with the covenant terms and create a governance proposal
              for each party. They can then choose whether to participate in the
              agreement.
            </p>

            <p className="font-bold mt-4">Covenant type</p>
            <Dropdown
              options={TYPE_OPTIONS}
              selected={covenantType}
              onSelected={setCovenantType}
            />

            <Button className="mt-2" onClick={() => {}}>Propose</Button>
          </div>

          <div className="flex flex-col items-stretch grow">
            <div className="p-4 flex flex-col gap-5 border-l-[6px] border-l-valence-red">
              <div className="flex flex-row items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-valence-red"></div>

                <h1 className="text-base font-medium">Party A</h1>
              </div>

              <TextInput
                input={partyA}
                onChange={setPartyA}
                placeholder="Party A"
              />

              {FIELDS[covenantType]?.each.map((field) => (
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

            {FIELDS[covenantType]?.parties === 2 && (
              <>
                <div className="h-[2px] bg-black shrink-0"></div>

                <div className="p-4 flex flex-col gap-5 border-l-[6px] border-valence-blue">
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-valence-blue"></div>

                    <h1 className="text-base font-medium">Party A</h1>
                  </div>

                  <TextInput
                    input={partyB}
                    onChange={setPartyB}
                    placeholder="Party B"
                  />

                  {FIELDS[covenantType]?.each.map((field) => (
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

            {FIELDS[covenantType]?.both && (
              <>
                <div className="h-[2px] bg-black shrink-0"></div>

                <div className="p-4 flex flex-col gap-5 border-l-[6px] border-valence-purple pb-20">
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-valence-purple"></div>

                    <h1 className="text-base font-medium">Both Parties</h1>
                  </div>

                  {FIELDS[covenantType]!.both!.map((field) => (
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

        <div className="flex flex-col bg-valence-bg-gray text-sm grow">
          <div className="flex flex-row items-stretch justify-between border-b border-black">
            <div className="flex flex-row items-stretch">
              <div
                className={clsx(
                  "border-r border-black flex flex-col justify-center items-center p-4 cursor-pointer",
                  contractDisplayMode === "contract" && "bg-white"
                )}
                onClick={() => setContractDisplayMode("contract")}
              >
                <p>Contract</p>
              </div>
              <div
                className={clsx(
                  "border-r border-black flex flex-col justify-center items-center p-4 cursor-pointer",
                  contractDisplayMode === "json" && "bg-white"
                )}
                onClick={() => setContractDisplayMode("json")}
              >
                <p>JSON</p>
              </div>
            </div>

            <div className="flex flex-row items-stretch">
              <div
                className="flex flex-col justify-center items-center p-4 cursor-pointer"
                onClick={() => {}}
              >
                <p>Copy text</p>
              </div>
              <div
                className="flex flex-col justify-center items-center p-4 cursor-pointer"
                onClick={() => {}}
              >
                <p>Download</p>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto text-xs flex flex-col gap-4 font-mono text-black grow p-8">
            <p>I. Initial terms</p>

            <div className="mt-6 ml-6 flex flex-col gap-4">
              <p>
                <span className="py-0.5 bg-valence-red text-white">
                  {partyA || "Party A"}
                </span>{" "}
                agrees to the following:{" "}
              </p>

              <p className="pl-4">
                Bacon ipsum dolor amet pork chop ball tip venison meatloaf
                burgdoggen{" "}
                <span className="py-0.5 bg-valence-red text-white">
                  {partyAParameterA || "Parameter A"}
                </span>{" "}
                tri-tip landjaeger. Tri-tip leberkas beef, alcatra tenderloin
                chislic pork chop short ribs sausage short loin. Fatback flank
                tongue, prosciutto boudin ground round beef ball tip sausage
                tenderloin. Burgdoggen cow alcatra, biltong picanha short ribs
                beef venison shoulder leberkas tongue strip steak shankle{" "}
                <span className="py-0.5 bg-valence-red text-white">
                  {partyAParameterB || "Parameter B"}
                </span>
                .
              </p>
            </div>

            <div className="mt-4 ml-6 flex flex-col gap-4">
              <p>
                <span className="py-0.5 bg-valence-blue text-white">
                  {partyB || "Party B"}
                </span>{" "}
                agrees to the following:{" "}
              </p>

              <p className="pl-4">
                Cow doner strip steak flank pork loin beef ham hock shank{" "}
                <span className="py-0.5 bg-valence-blue text-white">
                  {partyBParameterA || "Parameter A"}
                </span>{" "}
                bresaola tenderloin salami pork belly chislic. Ball tip doner
                swine chicken cow pancetta ham hock pork loin pork turkey
                fatback. Kevin ball tip tongue shank spare ribs, sirloin doner
                turkey beef ribs shoulder boudin fatback{" "}
                <span className="py-0.5 bg-valence-blue text-white">
                  {partyBParameterB || "Parameter B"}
                </span>
                .
              </p>
            </div>

            <p className="mt-8">II. Early release</p>
            <p className="ml-6 mt-2">
              In the event one or both parties wants to terminate this agreement
              before its natural conclusion, they have set forth the following
              terms.
            </p>

            <div className="mt-4 ml-6 flex flex-col gap-4">
              <p>
                <span className="py-0.5 bg-valence-red text-white">
                  {partyA || "Party A"}
                </span>{" "}
                ground round alcatra, picanha pig cupim pancetta turducken
                meatloaf fatback jerky. Sausage ball tip beef ribs, meatball
                ribeye t-bone{" "}
                <span className="py-0.5 bg-valence-red text-white">
                  {partyAParameterC || "Parameter C"}
                </span>{" "}
                turkey. Meatloaf pork loin pancetta, pork chop porchetta chislic
                prosciutto beef bacon leberkas bresaola drumstick cow alcatra
                rump. Kevin burgdoggen ham hock, meatloaf ground round shoulder
                beef turducken spare ribs short loin kielbasa{" "}
                <span className="py-0.5 bg-valence-red text-white">
                  {partyAParameterD || "Parameter D"}
                </span>
                .
              </p>
            </div>

            <div className="mt-4 ml-6 flex flex-col gap-4">
              <p>
                <span className="py-0.5 bg-valence-blue text-white">
                  {partyB || "Party B"}
                </span>{" "}
                bacon jerky spare ribs strip steak doner meatball alcatra rump
                sirloin{" "}
                <span className="py-0.5 bg-valence-blue text-white">
                  {partyBParameterC || "Parameter C"}
                </span>{" "}
                venison ground round jowl. Buffalo pancetta chicken bacon. Short
                ribs prosciutto filet mignon pork chop venison buffalo short
                loin jerky swine{" "}
                <span className="py-0.5 bg-valence-blue text-white">
                  {partyBParameterD || "Parameter D"}
                </span>
                , drumstick shoulder.
              </p>
            </div>

            <p className="mt-8">III. Conclusion</p>
            <p className="ml-6 mt-2">
              Upon the conclusion of this agreement,{" "}
              <span className="py-0.5 bg-valence-red text-white">
                {partyA || "Party A"}
              </span>{" "}
              agrees to{" "}
              {partyAParameterE
                ? "sirloin rump alcatra pastrami pork t-bone andouille filet mignon chislic buffalo"
                : "filet mignon drumstick pork loin andouille turkey landjaeger salami ham"}
              , whereas{" "}
              <span className="py-0.5 bg-valence-blue text-white">
                {partyB || "Party B"}
              </span>{" "}
              agrees to
              {partyBParameterE
                ? "short loin t-bone pancetta doner tri-tip cow meatball meatloaf fatback"
                : "burgdoggen ground round frankfurter jowl corned beef pancetta pig pork"}
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CovenantPage;

type CovenantType = "swapLp" | "onePartyPol" | "twoPartyPol";

type Field = {
  key: string;
  label?: string;
  if?: (data: any) => boolean;
} & (
  | {
      type: "text";
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
        "flex relative",
        field.type === "group"
          ? "flex-col gap-2"
          : "flex-row gap-6 items-center"
      )}
    >
      {!!field.label && <p className="w-32">{field.label}</p>}

      {field.type === "text" ? (
        <TextInput input={value} onChange={onChange} />
      ) : field.type === "check" ? (
        <Checkbox checked={!!value} onChange={onChange} />
      ) : field.type === "dropdown" ? (
        <Dropdown
          options={field.options}
          selected={value}
          onSelected={onChange}
        />
      ) : field.type === "group" ? (
        <div className="pl-4 flex flex-col gap-2">
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

const TYPE_OPTIONS: { label: string; value: CovenantType }[] = [
  {
    label: "Swap and LP",
    value: "swapLp",
  },
  {
    label: "One-Party POL",
    value: "onePartyPol",
  },
  {
    label: "Two-Party POL",
    value: "twoPartyPol",
  },
];

const PARAMETER_OPTIONS = [
  {
    label: "Option 1",
    value: "Option 1",
  },
  {
    label: "Option 2",
    value: "Option 2",
  },
  {
    label: "Option 3",
    value: "Option 3",
  },
];

const FIELDS: Record<
  CovenantType,
  {
    parties: 1 | 2;
    each: Field[];
    both?: Field[];
  }
> = {
  swapLp: {
    parties: 2,
    each: [
      {
        key: "returnedAssetDest",
        type: "dropdown",
        label: "Destination for returned assets",
        options: [
          {
            label: "Community pool",
            value: "communityPool",
          },
          {
            label: "Address",
            value: "address",
          },
        ],
      },
      {
        key: "returnedAssetDestAddress",
        type: "group",
        if: (data) => data?.returnedAssetDest === "address",
        fields: [
          {
            key: "value",
            type: "text",
            label: "Return address",
          },
        ],
      },
      {
        key: "neutronAddress",
        type: "text",
        label: "Party-authorized Neutron address",
      },
      {
        key: "denom",
        type: "group",
        label: "Denom",
        fields: [
          {
            key: "native",
            type: "text",
            label: "Native",
          },
          {
            key: "neutronIbc",
            type: "text",
            label: "Neutron IBC",
          },
        ],
      },
      {
        key: "amount",
        type: "text",
        label: "Amount",
      },
      {
        key: "channelIds",
        type: "group",
        label: "Channel IDs",
        fields: [
          {
            key: "hostToNeutron",
            type: "text",
            label: "To Neutron",
          },
          {
            key: "neutronToHost",
            type: "text",
            label: "From Neutron",
          },
        ],
      },
      {
        key: "fromNeutronConnection",
        type: "text",
        label: "Connection from Neutron",
      },
      {
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
            label: "Block height",
            value: "blockHeight",
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
            key: "blockHeight",
            type: "text",
            label: "Block height",
            if: (data) => data?.depositDeadlineStrategy === "blockHeight",
          },
          {
            key: "Time",
            type: "text",
            label: "Time",
            if: (data) => data?.depositDeadlineStrategy === "time",
          },
        ],
      },
      {
        key: "convenantLabel",
        type: "text",
        label: "Convenant Label",
      },
      {
        key: "clockTickMaxGas",
        type: "text",
        label: "Clock tick max gas",
      },
    ],
  },
  onePartyPol: {
    parties: 1,
    each: [
      {
        key: "returnedAssetDest",
        type: "dropdown",
        label: "Destination for returned assets",
        options: [
          {
            label: "Community pool",
            value: "communityPool",
          },
          {
            label: "Address",
            value: "address",
          },
        ],
      },
      {
        key: "returnedAssetDestAddress",
        type: "group",
        if: (data) => data?.returnedAssetDest === "address",
        fields: [
          {
            key: "value",
            type: "text",
            label: "Return address",
          },
        ],
      },
      {
        key: "neutronAddress",
        type: "text",
        label: "Party-authorized Neutron address",
      },
      {
        key: "denom",
        type: "group",
        label: "Denom",
        fields: [
          {
            key: "native",
            type: "text",
            label: "Native",
          },
          {
            key: "neutronIbc",
            type: "text",
            label: "Neutron IBC",
          },
        ],
      },
      {
        key: "amount",
        type: "text",
        label: "Amount",
      },
      {
        key: "channelIds",
        type: "group",
        label: "Channel IDs",
        fields: [
          {
            key: "hostToNeutron",
            type: "text",
            label: "To Neutron",
          },
          {
            key: "neutronToHost",
            type: "text",
            label: "From Neutron",
          },
        ],
      },
      {
        key: "fromNeutronConnection",
        type: "text",
        label: "Connection from Neutron",
      },
      {
        key: "ibcTransferTimeout",
        type: "text",
        label: "IBC transfer timeout (seconds)",
      },
      {
        key: "liquidStaking",
        type: "group",
        label: "Liquid staking",
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
              },
              {
                key: "connection",
                type: "text",
                label: "Connection",
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
              },
              {
                key: "ibcNeutronLs",
                type: "text",
                label: "IBC denom on Neutron",
              },
            ],
          },
        ],
      },
      {
        key: "liquidityDestination",
        type: "group",
        label: "Liquidity destination",
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
  },
  twoPartyPol: {
    parties: 2,
    each: [
      {
        key: "returnedAssetDest",
        type: "dropdown",
        label: "Destination for returned assets",
        options: [
          {
            label: "Community pool",
            value: "communityPool",
          },
          {
            label: "Address",
            value: "address",
          },
        ],
      },
      {
        key: "returnedAssetDestAddress",
        type: "group",
        if: (data) => data?.returnedAssetDest === "address",
        fields: [
          {
            key: "value",
            type: "text",
            label: "Return address",
          },
        ],
      },
      {
        key: "neutronAddress",
        type: "text",
        label: "Party-authorized Neutron address",
      },
      {
        key: "denom",
        type: "group",
        label: "Denom",
        fields: [
          {
            key: "native",
            type: "text",
            label: "Native",
          },
          {
            key: "neutronIbc",
            type: "text",
            label: "Neutron IBC",
          },
        ],
      },
      {
        key: "amount",
        type: "text",
        label: "Amount",
      },
      {
        key: "channelIds",
        type: "group",
        label: "Channel IDs",
        fields: [
          {
            key: "hostToNeutron",
            type: "text",
            label: "To Neutron",
          },
          {
            key: "neutronToHost",
            type: "text",
            label: "From Neutron",
          },
        ],
      },
      {
        key: "fromNeutronConnection",
        type: "text",
        label: "Connection from Neutron",
      },
      {
        key: "ibcTransferTimeout",
        type: "text",
        label: "IBC transfer timeout (seconds)",
      },
    ],
    both: [
      {
        key: "type",
        type: "dropdown",
        label: "Type",
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
        key: "splitPercent",
        type: "group",
        if: (data) => data?.type === "split",
        fields: [
          {
            key: "value",
            type: "text",
            label: "Split percent",
          },
        ],
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
            label: "Block height",
            value: "blockHeight",
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
            key: "blockHeight",
            type: "text",
            label: "Block height",
            if: (data) => data?.depositDeadlineStrategy === "blockHeight",
          },
          {
            key: "Time",
            type: "text",
            label: "Time",
            if: (data) => data?.depositDeadlineStrategy === "time",
          },
        ],
      },
      {
        key: "durationStrategy",
        type: "dropdown",
        label: "Duration",
        options: [
          {
            label: "None",
            value: "none",
          },
          {
            label: "Block height",
            value: "blockHeight",
          },
          {
            label: "Time",
            value: "time",
          },
        ],
      },
      {
        key: "duration",
        type: "group",
        if: (data) =>
          !!data?.durationStrategy && data.durationStrategy !== "none",
        fields: [
          {
            key: "blockHeight",
            type: "text",
            label: "Block height",
            if: (data) => data?.durationStrategy === "blockHeight",
          },
          {
            key: "Time",
            type: "text",
            label: "Time",
            if: (data) => data?.durationStrategy === "time",
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
  },
};
