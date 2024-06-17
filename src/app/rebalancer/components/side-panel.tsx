"use client";
import {
  Button,
  DropdownDEPRECATED,
  DropdownOption,
  DropdownTextField,
  NumberInput,
} from "@/components";
import { FetchAccountConfigReturnValue } from "@/server/actions";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BsPlus, BsX } from "react-icons/bs";
import { ComingSoonTooltipContent, TooltipWrapper } from "@/components";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { useEdgeConfig } from "@/hooks";
import { cn } from "@/utils";

export const SidePanel: React.FC<{
  account: string;
  setAccount: (s: string) => void;
  isLoading: boolean;
  isValidAccount: boolean;
}> = ({ account, setAccount, isLoading, isValidAccount }) => {
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<FetchAccountConfigReturnValue>([
    QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG,
    account,
  ]);
  const { data } = useEdgeConfig();

  const { setValue, watch, control } = useForm<RebalancerConfig>({
    defaultValues: {
      pidPreset: "default",
    },
  });

  const tokenOptions =
    config?.targets.map((target) => ({
      label: target.asset.recommended_symbol ?? target.asset.symbol,
      value: target.denom,
    })) ?? [];

  useEffect(() => {
    if (!isValidAccount || !config) {
      // clear
      setValue("tokens", []);
      setValue("baseToken", "");
      setValue("pidPreset", "");
      return;
    } else {
      setValue(
        "tokens",
        config.targets.map((target) => ({
          denom: target.denom,
          percent: (target.percentage * 100).toString(),
        })),
      );
      setValue("baseToken", config.baseDenom);
      setValue("pidPreset", "default");
    }
  }, [setValue, config, isValidAccount]);

  const {
    fields: tokenFields,
    append: addToken,
    remove: removeToken,
  } = useFieldArray({
    control,
    name: "tokens",
  });

  // used to track when hovering over scrollable side panel
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // to track cursor when it moves
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [delayHandler, setDelayHandler] = useState<number | null>(null); // hack to keep tooltip open when moving mouse towards it
  const debouncedMouseEnter = () => {
    setIsPanelHovered(true);
    if (delayHandler !== null) clearTimeout(delayHandler);
  };
  const debouncedMouseLeave = () => {
    setDelayHandler(
      window.setTimeout(() => {
        setIsPanelHovered(false);
      }, 100),
    );
  };

  return (
    <>
      {isPanelHovered && (
        <div
          onMouseEnter={debouncedMouseEnter}
          onMouseLeave={debouncedMouseLeave}
          style={{
            top: `${cursorPosition.y - 88}px`, // assign height of tooltip dynamically
          }}
          className={cn(
            "absolute left-[392px] z-50 flex w-64 grow border-[0.5px]",
            "animate-in  fade-in-0 zoom-in-95 border-valence-black bg-valence-white p-4 drop-shadow-md",
          )}
        >
          <ComingSoonTooltipContent />
        </div>
      )}
      <div className="flex flex-col  gap-6 border-b border-valence-black p-4 pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold">Rebalancer account</h1>

          <DropdownTextField
            options={
              data?.featured_rebalancer_accounts ?? DEFAULT_FEATURED_ACCOUNTS
            }
            value={account}
            onChange={(value) => setAccount(value)}
            placeholder="neutron12345..."
          />
          <TooltipWrapper
            sideOffset={24}
            asChild
            content={<ComingSoonTooltipContent />}
          >
            <Button className="mt-2" onClick={() => {}} disabled>
              Connect wallet
            </Button>
          </TooltipWrapper>
        </div>
      </div>

      <div
        onPointerMove={handlePointerMove}
        className="relative flex grow flex-col border-b  border-valence-black"
      >
        <div
          onMouseMove={debouncedMouseEnter}
          onMouseEnter={debouncedMouseEnter}
          onMouseLeave={debouncedMouseLeave}
          className="absolute z-10 flex h-full w-full flex-col bg-valence-black/25"
        />

        <div className="flex flex-col  gap-6 p-4 pb-8 ">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center justify-between">
              <p className="font-bold">Asset Targets</p>
              <button
                className="flex flex-row items-center justify-center"
                onClick={() =>
                  addToken({
                    denom: "uusdc",
                    percent: "25",
                  })
                }
              >
                <BsPlus className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {tokenFields.map(({ id }, index) => (
                <div
                  key={`tokens-${id}`}
                  className="flex flex-row items-stretch"
                >
                  <DropdownDEPRECATED
                    isLoading={isLoading}
                    options={tokenOptions}
                    selected={watch(`tokens.${index}.denom`)}
                    onSelected={(value) =>
                      setValue(`tokens.${index}.denom`, value)
                    }
                    containerClassName="!min-w-[8rem] !border-r-0 pr-4"
                  />

                  <NumberInput
                    containerClassName="grow"
                    min={0.01}
                    max={100}
                    hidePlusMinus
                    input={watch(`tokens.${index}.percent`)}
                    onChange={(value) =>
                      setValue(`tokens.${index}.percent`, value)
                    }
                    unit="%"
                  />

                  <button
                    className="ml-3 flex flex-row items-center justify-center"
                    onClick={() => removeToken(index)}
                  >
                    <BsX className="h-6 w-6" />
                  </button>
                </div>
              ))}
              {/* dummy component for loading state */}
              {tokenFields.length === 0 && isLoading && (
                <>
                  {" "}
                  <DropdownDEPRECATED
                    isLoading={isLoading}
                    options={[]}
                    selected=""
                    onSelected={() => {}}
                  />{" "}
                  <DropdownDEPRECATED
                    isLoading={isLoading}
                    options={[]}
                    selected=""
                    onSelected={() => {}}
                  />
                </>
              )}
              {/* dummy component for empty state */}
              {tokenFields.length === 0 && !isLoading && (
                <div className="flex flex-row items-stretch">
                  <DropdownDEPRECATED
                    isLoading={isLoading}
                    options={tokenOptions}
                    selected=""
                    onSelected={() => {}}
                    containerClassName="!min-w-[8rem] !border-r-0 pr-4"
                  />

                  <NumberInput
                    containerClassName="grow"
                    min={0.01}
                    max={100}
                    hidePlusMinus
                    input={""}
                    placeholder="0.00"
                    onChange={() => {}}
                    unit="%"
                  />

                  <button
                    className="ml-3 flex flex-row items-center justify-center"
                    onClick={() => {}}
                  >
                    <BsX className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-bold">Rebalance Speed</p>
            <DropdownDEPRECATED
              isLoading={isLoading}
              options={PID_PRESET_OPTIONS}
              selected={watch("pidPreset")}
              onSelected={(value) => setValue("pidPreset", value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-bold">Base token</p>
            <DropdownDEPRECATED
              isLoading={isLoading}
              options={tokenOptions}
              selected={watch("baseToken")}
              onSelected={(value) => setValue("baseToken", value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const PID_PRESET_OPTIONS: { label: string; value: string }[] = [
  {
    label: "Default",
    value: "default",
  },
  {
    label: "Correct faster",
    value: "faster",
  },
  {
    label: "Correct slower",
    value: "slower",
  },
];

export type RebalancerConfig = {
  baseToken: string;
  tokens: Token[];
  pidPreset: string;
};

export type Token = {
  denom: string;
  percent: string;
};

export const DEFAULT_FEATURED_ACCOUNTS: DropdownOption<string>[] = [
  {
    label: "Timewave Rebalancer",
    value: "neutron13pvwjc3ctlv53u9c543h6la8e2cupkwcahe5ujccdc4nwfgann7ss0xynz",
  },
];
