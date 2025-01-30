"use client";
import {
  FormField,
  FormRoot,
  InputLabel,
  Label,
  TextInput,
} from "@valence-ui/ui-components";
import { useForm } from "react-hook-form";
import { useQueryArgs } from "@/app/programs/ui";
import { debounce } from "lodash";

type RpcConfigFormValues = {
  main: {
    rpcUrl: string;
  };
  chains: Array<{
    chainId: string;
    rpcUrl: string;
    name: string;
  }>;
};
export const RpcConfigForm = ({}: {}) => {
  const [queryConfig, setQueryConfig] = useQueryArgs();

  const mainChain = queryConfig.main;
  const restOfChains = queryConfig.allChains.filter(
    (c) => c.chainId !== mainChain.chainId,
  );
  const { register, handleSubmit } = useForm<RpcConfigFormValues>({
    defaultValues: {
      main: {
        rpcUrl: mainChain.rpc,
      },
      chains: restOfChains.map((c) => {
        return {
          chainId: c.chainId,
          rpcUrl: c.rpc,
          name: c.name,
        };
      }),
    },
  });

  const handleSubmitForm = debounce((values: RpcConfigFormValues) => {
    setQueryConfig({
      main: {
        registryAddress: mainChain.registryAddress,
        name: mainChain.name,
        chainId: mainChain.chainId,
        rpc: values.main.rpcUrl,
      },
      allChains: [
        {
          chainId: mainChain.chainId,
          rpc: values.main.rpcUrl,
          name: mainChain.name,
          crosschain: false,
        },
        ...values.chains.map((chain) => ({
          chainId: chain.chainId,
          rpc: chain.rpcUrl,
          name: chain.name,
          crosschain: true,
        })),
      ],
    });
  }, 300);

  return (
    <div>
      <FormRoot
        onChange={handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-4"
      >
        <FormField name="main chain rpc">
          <div className="flex flex-row gap-2 items-center pb-2">
            {" "}
            <InputLabel noGap label={`${mainChain.chainId}`} />
            <Label>Main Chain</Label>
          </div>
          <TextInput {...register("main.rpcUrl")} placeholder="https://" />
        </FormField>

        {restOfChains.map((chain, index) => {
          return (
            <FormField
              key={`chain-rpcurl-${chain.chainId}`}
              name={`chains.${index}.rpcUrl`}
            >
              <InputLabel label={`${chain.chainId}`} />
              <TextInput
                {...register(`chains.${index}.rpcUrl`)}
                placeholder="https://"
              />
            </FormField>
          );
        })}
      </FormRoot>
    </div>
  );
};
