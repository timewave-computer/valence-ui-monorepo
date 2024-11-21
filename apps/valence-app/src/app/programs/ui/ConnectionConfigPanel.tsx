import { FormRoot, FormInputField } from "@valence-ui/ui-components";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

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
  const { register, handleSubmit } = useForm<ConnectionConfigFormValues>({
    defaultValues,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event) return;
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit(onSubmit)();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit, onSubmit]);

  // form to set the registry address, 'main chain', and RPCs for mainchain and other chains
  // on submit, the data should refetch with given inputs (registry, mainchain id, rpcs)

  return (
    <div>
      <h1 className="text-lg font-bold">Connection Configuration</h1>
      <FormRoot
        onSubmit={() => {
          handleSubmit((data) => {
            console.log("SUBBMITTING", data);
            onSubmit();
          });
        }}
        className="flex flex-col gap-4 pt-4"
      >
        <FormInputField
          label="Registry Address"
          {...register("registryAddress")}
        />
        <FormInputField label="Main Chain ID" {...register("mainChainId")} />
        <FormInputField label="Main Chain RPC" {...register("mainChainRpc")} />
        {defaultValues.rpcs.map((rpc, i) => {
          return (
            <FormInputField
              key={`rpc-input-${i}`}
              label={`${rpc.chainId} RPC:`}
              {...register(`rpcs.${i}.chainRpc`)}
            />
          );
        })}
      </FormRoot>
    </div>
  );
}
