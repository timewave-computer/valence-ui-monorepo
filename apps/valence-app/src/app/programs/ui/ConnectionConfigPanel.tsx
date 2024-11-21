import {
  FormRoot,
  FormField,
  FormLabel,
  FormControl,
} from "@valence-ui/ui-components";
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
    <FormRoot
      onSubmit={() => {
        handleSubmit((data) => {
          console.log("SUBBMITTING", data);
          onSubmit();
        });
      }}
      className="flex flex-col gap-4 pt-4"
    >
      <FormField name="registryAddress" className="flex flex-col gap-1">
        <FormLabel label="Registry Address" />
        <FormControl {...register("registryAddress")} />
      </FormField>

      <FormField name="mainChainId" className="flex flex-col gap-1">
        <FormLabel label="Main Chain ID" />
        <FormControl {...register("mainChainId")} />
      </FormField>

      {defaultValues.rpcs.map((rpc, i) => {
        return (
          <FormField
            key={`rpc-input-${rpc.chainId}`}
            name={`rpcs.${i}.chainRpc`}
            className="flex flex-col gap-1"
          >
            <FormLabel label={`${rpc.chainId} RPC:`} />
            <FormControl {...register(`rpcs.${i}.chainRpc`)} />
          </FormField>
        );
      })}
    </FormRoot>
  );
}
