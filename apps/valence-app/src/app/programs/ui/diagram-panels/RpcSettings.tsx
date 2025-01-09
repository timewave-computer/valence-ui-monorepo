import {
  FormRoot,
  FormField,
  InputLabel,
  Label,
  FormControl,
  TextInput,
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
          <Label>main chain</Label>
        </div>

        <FormField name="mainChainId" className="flex flex-col gap-1">
          <InputLabel label={formLabels.chainId} />
          <FormControl asChild>
            <TextInput {...register("main.chainId")} />
          </FormControl>
        </FormField>

        <FormField name="mainChainRpc" className="flex flex-col gap-1">
          <InputLabel label={formLabels.rpc} />
          <FormControl asChild>
            <TextInput {...register("main.rpc")} />
          </FormControl>
        </FormField>
        <FormField name="registryAddress" className="flex flex-col gap-1">
          <InputLabel label={formLabels.registryAddress} />
          <FormControl asChild>
            <TextInput {...register("main.registryAddress")} />
          </FormControl>
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
                  <InputLabel label={formLabels.chainId} />
                  <FormControl asChild>
                    <TextInput {...register(`otherChains.${i}.chainId`)} />
                  </FormControl>
                </FormField>
                <FormField
                  key={`rpc-input-${chain.rpc}`}
                  name={`otherChains.${i}.rpc`}
                  className="flex flex-col gap-1"
                >
                  <InputLabel label={formLabels.rpc} />
                  <FormControl asChild>
                    <TextInput {...register(`otherChains.${i}.rpc`)} />
                  </FormControl>
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
