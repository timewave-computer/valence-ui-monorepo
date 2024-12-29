"use client";
import {
  ConnectWalletButton,
  Dropdown,
  LinkText,
  MobileOverlay,
  ValenceProductBrand,
} from "@/components";
import { FeatureFlags, cn, useFeatureFlag } from "@/utils";
import { useState } from "react";
import Image from "next/image";
import { X_HANDLE, X_URL } from "@valence-ui/socials";
import { ComingSoonTooltipContent } from "@/components";
import { UTCDate } from "@date-fns/utc";
import { addDays } from "date-fns";
import { Field, COVENANT_TYPES } from "@/app/covenants/components";
import {
  CovenantTypeSelector,
  TYPE_OPTIONS,
  CovenantType,
  ContractDisplayMode,
  POL_TYPE_PARTIES_OPTIONS,
} from "@/app/covenants/const";

const CovenantPage = () => {
  const [covenantTypeSelection, setCovenantType] =
    useState<CovenantTypeSelector>(TYPE_OPTIONS[0].value);
  const [numParties, setNumParties] = useState<"1" | "2">("2");

  const covenantType =
    covenantTypeSelection === CovenantTypeSelector.Swap
      ? CovenantType.SwapLp
      : numParties === "1"
        ? CovenantType.OnePartyPol
        : CovenantType.TwoPartyPol;
  const covenantSelected =
    COVENANT_TYPES[covenantType] || Object.values(COVENANT_TYPES)[0];

  const [contractDisplayMode, setContractDisplayMode] =
    useState<ContractDisplayMode>(ContractDisplayMode.Contract);

  const [partyAData, setPartyAData] = useState<Record<string, any>>(
    PLACEHOLDER_PARTY_A_DATA,
  );
  const [partyBData, setPartyBData] = useState<Record<string, any>>(
    PLACEHOLDER_PARTY_B_DATA,
  );

  const [bothPartiesData, setBothPartiesData] = useState<Record<string, any>>(
    PLACEHOLDER_BOTH_PARTIES_DATA,
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

  // used to track when hovering over scrollable side panel
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // to track cursor when it moves
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  const [isDisabledElementHovered, setIsDisabledElementHovered] =
    useState(false);
  const [delayHandler, setDelayHandler] = useState<number | null>(null);

  // hack to keep tooltip open when moving mouse towards it
  const debouncedMouseEnter = () => {
    setIsDisabledElementHovered(true);
    if (delayHandler !== null) clearTimeout(delayHandler);
  };
  const debouncedMouseLeave = () => {
    setDelayHandler(
      window.setTimeout(() => {
        setIsDisabledElementHovered(false);
      }, 100),
    );
  };

  const canViewPol = useFeatureFlag(FeatureFlags.COVENANTS_VIEW_POL);

  return (
    <main className="flex min-h-0 grow flex-col bg-valence-white text-valence-black">
      <MobileOverlay text="Covenants are only available on desktop." />
      <div className="hidden min-h-0 grow flex-row items-stretch sm:flex">
        <div
          onPointerMove={handlePointerMove}
          className="  flex w-[24rem] shrink-0  flex-col items-stretch overflow-hidden overflow-y-auto  border-r border-valence-black"
        >
          <div className="flex flex-col gap-4 p-4">
            <ValenceProductBrand
              img={
                <Image
                  priority={true}
                  className="mb-6 mt-8"
                  src="/img/covenant.svg"
                  alt="Covenant illustration"
                  width={134}
                  height={80}
                />
              }
            >
              <h1 className="text-xl font-bold">Covenants (beta)</h1>

              <p>
                Crypto-native agreements. Contact{" "}
                <LinkText
                  className="border-valence-black font-medium text-valence-black hover:border-b"
                  href={X_URL}
                >
                  {X_HANDLE}
                </LinkText>{" "}
                if your organization wants early access to Covenants.
              </p>
            </ValenceProductBrand>
            <ConnectWalletButton
              connectCta="            Connect your wallet create a covenant."
              debouncedMouseEnter={debouncedMouseEnter}
              debouncedMouseLeave={debouncedMouseLeave}
              disabled={true}
            />

            <div className="flex flex-col gap-2">
              <p className=" font-bold">Covenant type</p>
              {canViewPol ? (
                <Dropdown
                  options={TYPE_OPTIONS}
                  selected={covenantTypeSelection}
                  onSelected={(e) => {
                    setCovenantType(e);

                    if (e === CovenantTypeSelector.Pol) {
                      setBothPartiesData(PLACEHOLDER_BOTH_PARTIES_DATA);
                    } else {
                      setBothPartiesData({
                        ...PLACEHOLDER_BOTH_PARTIES_DATA,
                        ...PLACEHOLDER_BOTH_LIQUIDITY_DATA,
                      });
                    }
                    setCovenantType(e);
                  }}
                />
              ) : (
                <Dropdown
                  onMouseMove={debouncedMouseEnter}
                  onMouseEnter={debouncedMouseEnter}
                  onMouseLeave={debouncedMouseLeave}
                  isDisabled={true}
                  options={TYPE_OPTIONS}
                  selected={covenantTypeSelection}
                  // @ts-ignore
                  onSelected={setCovenantType}
                />
              )}
              {covenantTypeSelection === "pol" && (
                <div className="mt-2 space-y-2">
                  <p className="font-bold">How many parties?</p>
                  <Dropdown
                    options={POL_TYPE_PARTIES_OPTIONS}
                    selected={numParties}
                    // @ts-ignore
                    onSelected={setNumParties}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="relative flex grow flex-col items-stretch">
            <div
              onMouseMove={debouncedMouseEnter}
              onMouseEnter={debouncedMouseEnter}
              onMouseLeave={debouncedMouseLeave}
              className="absolute z-20 flex h-full w-full flex-col bg-valence-black/25 "
            />

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

        <div className="relative flex grow flex-col  bg-valence-lightgray">
          {isDisabledElementHovered && (
            <div
              style={{
                top: `${cursorPosition.y - 88}px`, // assign height of tooltip dynamically
              }}
              className={cn(
                "z-5 absolute left-[10px] flex w-64 grow border-[0.5px]",
                "animate-in  fade-in-0 zoom-in-95 border-valence-black bg-valence-white p-4 drop-shadow-md",
              )}
              onMouseEnter={debouncedMouseEnter}
              onMouseLeave={debouncedMouseLeave}
            >
              <ComingSoonTooltipContent />
            </div>
          )}
          <div className="flex flex-row items-stretch justify-between border-b border-valence-black">
            <div className="flex flex-row items-stretch">
              <div
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center border-r border-valence-black p-4",
                  contractDisplayMode === "contract" && "bg-valence-white",
                )}
                onClick={() =>
                  setContractDisplayMode(ContractDisplayMode.Contract)
                }
              >
                <p>Contract</p>
              </div>
              <div
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center border-r border-valence-black p-4",
                  contractDisplayMode === "json" && "bg-valence-white",
                )}
                onClick={() => setContractDisplayMode(ContractDisplayMode.JSON)}
              >
                <p>JSON</p>
              </div>
            </div>

            <div className="flex flex-row items-stretch">
              {contractDisplayMode === "json" && (
                <div
                  className="flex cursor-pointer flex-col items-center justify-center p-4 text-base"
                  onClick={() => {
                    navigator.clipboard.writeText(json);
                  }}
                >
                  <p>Copy JSON</p>
                </div>
              )}
              {contractDisplayMode === "contract" && (
                <div className="flex cursor-pointer flex-col items-center justify-center p-4 text-base">
                  <a target="_blank" download href="/ntrn-atom-swap.txt">
                    Download
                  </a>
                </div>
              )}
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

const PLACEHOLDER_PARTY_A_DATA = {
  chainId: "neutron-1",
  name: "Neutron",
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
    native: "ATOM",
    neutronIbc:
      "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
  },
  channelIds: {
    hostToNeutron: "channel-569",
    neutronToHost: "channel-1",
  },
  fromNeutronConnection: "connection-809",
  ibcTransferTimeout: "7200",
};

const PLACEHOLDER_BOTH_LIQUIDITY_DATA = {
  liquidityDestination: {
    pool: "NTRN/ATOM",
    dex: "ASTROPORT",
  },
  lpHoldDays: 30,
  acceptableRatioDelta: 10,
};

const PLACEHOLDER_BOTH_PARTIES_DATA = {
  covenantName: "NTRN/ATOM Swap",
  depositDeadlineStrategy: "time",
  clockTickMaxGas: 50,
  depositDeadline: {
    time: new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZoneName: "short",
    }).format(addDays(new UTCDate(), 30)),
  },
};
