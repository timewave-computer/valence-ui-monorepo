import {
  FormRoot,
  FormField,
  FormTextInput,
  FormInputLabel,
} from "@valence-ui/ui-components";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";

export type RpcSettingsFormValues = {
  registryAddress: string;
  mainChainId: string;
  mainChainRpc: string;
  otherRpcs: Array<{
    chainRpc: string;
    chainId: string;
  }>;
};

const formLabels = {
  registryAddress: "Registry Address",
  mainChainId: "Main Chain ID",
  mainChainRpc: "Main Chain RPC",
};
export function RpcSettingsPanel({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (args: RpcSettingsFormValues) => void;
  defaultValues: RpcSettingsFormValues;
}) {
  const { register, getValues } = useForm<RpcSettingsFormValues>({
    defaultValues,
  });

  const handleSubmitForm = useCallback(() => {
    const formValues = getValues();
    onSubmit(formValues);
  }, [getValues, onSubmit]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event) return;
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmitForm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSubmit, handleSubmitForm]);

  return (
    <FormRoot
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmitForm();
      }}
      className="flex flex-col gap-4 pt-4"
    >
      <FormField name="registryAddress" className="flex flex-col gap-1">
        <FormInputLabel label={formLabels.registryAddress} />

        <FormTextInput {...register("registryAddress")} />
      </FormField>

      <FormField name="mainChainId" className="flex flex-col gap-1">
        <FormInputLabel label={formLabels.mainChainId} />

        <FormTextInput {...register("mainChainId")} />
      </FormField>

      <FormField name="mainChainRpc" className="flex flex-col gap-1">
        <FormInputLabel label={formLabels.mainChainRpc} />

        <FormTextInput {...register("mainChainRpc")} />
      </FormField>

      {defaultValues.otherRpcs.map((rpc, i) => {
        return (
          <FormField
            key={`rpc-input-${rpc.chainId}`}
            name={`rpcs.${i}.chainRpc`}
            className="flex flex-col gap-1"
          >
            <FormInputLabel label={`${rpc.chainId} RPC:`} />

            <FormTextInput {...register(`otherRpcs.${i}.chainRpc`)} />
          </FormField>
        );
      })}
    </FormRoot>
  );
}
