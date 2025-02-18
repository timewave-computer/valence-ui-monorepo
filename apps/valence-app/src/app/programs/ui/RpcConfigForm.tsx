"use client";
import {
  FormField,
  FormRoot,
  Heading,
  InputLabel,
  TextInput,
} from "@valence-ui/ui-components";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { useQueryArgs } from "@/app/programs/ui";

type RpcConfigFormValues = {
  main: {
    registryAddress: string;
    rpcUrl: string;
    name: string;
    chainId: string;
  };
  externalChains: Array<{
    chainId: string;
    rpcUrl: string;
    name: string;
  }>;
};
export const RpcConfigForm = ({}: {}) => {
  const { queryConfig, setQueryConfig } = useQueryArgs();
  const mainChain = queryConfig.main;
  const externalChains = queryConfig.external;

  const { register, handleSubmit } = useForm<RpcConfigFormValues>({
    defaultValues: {
      main: {
        name: mainChain.name,
        chainId: mainChain.chainId,
        registryAddress: mainChain.registryAddress,
        rpcUrl: mainChain.rpcUrl,
      },
      externalChains: externalChains.map((c) => {
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
        registryAddress: values.main.registryAddress,
        name: values.main.name,
        chainId: values.main.chainId,
        rpcUrl: values.main.rpcUrl,
      },

      external: [
        ...values.externalChains.map((chain) => ({
          chainId: chain.chainId,
          rpc: chain.rpcUrl,
          name: chain.name,
        })),
      ],
    });
  }, 800);

  return (
    <div>
      <FormRoot
        onChange={handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2 ">
          <Heading level="h3">Main Chain</Heading>
          <FormField name="main.rpcUrl">
            <InputLabel
              size="sm"
              label={`${mainChain.name} RPC URL (${mainChain.chainId})`}
            />

            <TextInput
              size="sm"
              {...register("main.rpcUrl")}
              placeholder="https://"
            />
          </FormField>
          <FormField name="main.registryAddress">
            <InputLabel size="sm" label="Program registry address" />

            <TextInput
              size="sm"
              {...register("main.registryAddress")}
              placeholder="neutron1234..."
            />
          </FormField>
        </div>
        {externalChains.length > 0 && (
          <div className="flex flex-col gap-2">
            <Heading level="h3">External Chains</Heading>
            {externalChains.map((chain, index) => {
              return (
                <FormField
                  key={`chain-rpcurl-${chain.chainId}`}
                  name={`chains.${index}.rpcUrl`}
                >
                  <InputLabel
                    size="sm"
                    label={`${chain.name} RPC URL (${chain.chainId})`}
                  />
                  <TextInput
                    size="sm"
                    {...register(`externalChains.${index}.rpcUrl`)}
                    placeholder="https://"
                  />
                </FormField>
              );
            })}
          </div>
        )}
      </FormRoot>
    </div>
  );
};
