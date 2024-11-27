import {
  FormRoot,
  FormField,
  FormTextInput,
  FormInputLabel,
  Label,
} from "@valence-ui/ui-components";
import { useForm } from "react-hook-form";
import { Fragment, useCallback, useEffect } from "react";

export type RpcSettingsFormValues = {
  main: {
    registryAddress: string;
    chainId: string;
    rpc: string;
    name: string;
  };
  otherChains: Array<{
    rpc: string;
    name: string;
    chainId: string;
  }>;
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
      className="flex flex-col gap-6 pt-4"
    >
      <div className="flex flex-col gap-4 pl-4 border-l-4  border-valence-mediumgray ">
        <div className="flex flex-row items-center gap-2 justify-between">
          {" "}
          <h2 className="font-semibold">{defaultValues.main.name} </h2>{" "}
          <Label className="" text="main chain" />
        </div>

        <FormField name="mainChainId" className="flex flex-col gap-1">
          <FormInputLabel label={formLabels.chainId} />

          <FormTextInput {...register("main.chainId")} />
        </FormField>

        <FormField name="mainChainRpc" className="flex flex-col gap-1">
          <FormInputLabel label={formLabels.rpc} />

          <FormTextInput {...register("main.rpc")} />
        </FormField>
        <FormField name="registryAddress" className="flex flex-col gap-1">
          <FormInputLabel label={formLabels.registryAddress} />

          <FormTextInput {...register("main.registryAddress")} />
        </FormField>
      </div>

      {defaultValues.otherChains.length > 0 && (
        <div className="flex flex-col gap-4 pl-4 border-l-4 border-valence-lightgray">
          {defaultValues.otherChains.map((chain, i) => {
            return (
              <Fragment key={`settings-input-${chain.chainId}`}>
                <h2 className="font-semibold">{chain.name} </h2>
                <FormField
                  name={`otherChains.${i}.chainId`}
                  className="flex flex-col gap-1"
                >
                  <FormInputLabel label={formLabels.chainId} />

                  <FormTextInput {...register(`otherChains.${i}.chainId`)} />
                </FormField>
                <FormField
                  key={`rpc-input-${chain.rpc}`}
                  name={`otherChains.${i}.rpc`}
                  className="flex flex-col gap-1"
                >
                  <FormInputLabel label={formLabels.rpc} />

                  <FormTextInput {...register(`otherChains.${i}.rpc`)} />
                </FormField>
              </Fragment>
            );
          })}
        </div>
      )}
    </FormRoot>
  );
}

const formLabels = {
  registryAddress: "Registry Address",
  chainId: "Chain ID",
  rpc: "RPC",
};
