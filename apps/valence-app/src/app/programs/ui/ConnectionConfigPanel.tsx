import {
  FormRoot,
  FormField,
  FormTextInput,
  InputLabel,
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

const formLabels = {
  registryAddress: "Registry Address",
  mainChainId: "Main Chain ID",
  mainChainRpc: "Main Chain RPC",
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
        <InputLabel label={formLabels.registryAddress} />

        <FormTextInput {...register("registryAddress")} />
      </FormField>

      <FormField name="mainChainId" className="flex flex-col gap-1">
        <InputLabel label={formLabels.mainChainId} />

        <FormTextInput {...register("mainChainId")} />
      </FormField>

      {defaultValues.rpcs.map((rpc, i) => {
        return (
          <FormField
            key={`rpc-input-${rpc.chainId}`}
            name={`rpcs.${i}.chainRpc`}
            className="flex flex-col gap-1"
          >
            <InputLabel label={`${rpc.chainId} RPC:`} />

            <FormTextInput {...register(`rpcs.${i}.chainRpc`)} />
          </FormField>
        );
      })}
    </FormRoot>
  );
}
