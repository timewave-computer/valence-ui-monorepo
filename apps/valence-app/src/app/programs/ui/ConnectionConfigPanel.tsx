import { IconTooltipContent, WithIconAndTooltip } from "@/components";
import { cn } from "@/utils";
import { R } from "@tanstack/react-query-devtools/build/legacy/ReactQueryDevtools-Cn7cKi7o";
import { watch } from "fs";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";

type ConnectionConfigFormValues = {
  registryAddress: string;
  mainChainId: string;
  mainChainRpc: string;
  rpcs: Array<{
    chainRpc: string;
    chainId: string;
  }>;
};
export function ConnectionConfigPanel({
  onSubmit,
  defaultValues,
}: {
  onSubmit: () => void;
  defaultValues: ConnectionConfigFormValues;
}) {
  const { register, setValue } = useForm<ConnectionConfigFormValues>({
    defaultValues,
  });

  // form to set the registry address, 'main chain', and RPCs for mainchain and other chains
  // on submit, the data should refetch with given inputs (registry, mainchain id, rpcs)

  return (
    <div>
      <h1 className="text-lg font-bold">Connection Configuration</h1>
      <Form.Root className="flex flex-col gap-4 pt-4">
        <InputField
          containerClassName=""
          label="Registry Address"
          {...register("registryAddress")}
        />
        <InputField
          containerClassName=""
          label="Main Chain ID"
          {...register("mainChainId")}
        />
        {defaultValues.rpcs.map((rpc, i) => {
          return (
            <InputField
              key={`rpc-input-${i}`}
              containerClassName=""
              label={`Chain ID: ${rpc.chainId}`}
              {...register(`rpcs.${i}.chainRpc`)}
            />
          );
        })}
      </Form.Root>
    </div>
  );
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltipContent?: string;
  suffix?: string;
  containerClassName?: string;
}

function InputField({
  label,
  tooltipContent,
  suffix,
  className,
  containerClassName,
  ...props
}: InputFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1 ", containerClassName)}>
      <div className="text-xs font-medium">
        <WithIconAndTooltip
          {...(tooltipContent && {
            tooltipContent: (
              <IconTooltipContent title={label} text={tooltipContent} />
            ),
          })}
        >
          {label}
        </WithIconAndTooltip>
      </div>

      <div className="relative flex  items-center border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue ">
        <input
          {...props}
          // @ts-ignore
          onWheel={(e) => e.target?.blur()} // prevent scroll
          className={cn(
            "h-full grow  bg-transparent p-2 font-mono focus:outline-none",
            className,
          )}
        />
        {suffix && (
          <span className="pointer-events-none w-fit  font-mono px-2 pl-1">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
