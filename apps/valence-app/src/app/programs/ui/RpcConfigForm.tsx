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
import { type QueryConfig } from "@/app/programs/server";

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
export const RpcConfigForm = ({
  queryConfig,
  setQueryConfig,
}: {
  queryConfig: QueryConfig;
  setQueryConfig: (config: QueryConfig) => void;
}) => {
  const mainChain = queryConfig.main;
  const externalChains = queryConfig.external ?? [];

  const { register, handleSubmit } = useForm<RpcConfigFormValues>({
    defaultValues: {
      main: {
        name: mainChain.name,
        chainId: mainChain.chainId,
        registryAddress: mainChain.registryAddress,
        rpcUrl: mainChain.rpcUrl,
      },
      externalChains: externalChains?.map((c) => {
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
  }, 1200);

  return (
    <div>
      <FormRoot
        onChange={handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2 ">
          <Heading level="h3">Main Chain: {mainChain.name}</Heading>

          <FormField name="main.rpcUrl">
            <InputLabel size="sm" label={`RPC URL`} />

            <TextInput
              size="sm"
              {...register("main.rpcUrl")}
              placeholder="https://"
            />
          </FormField>

          <FormField name="main.chainId">
            <InputLabel size="sm" label={`Chain ID (for signing)`} />

            <TextInput
              size="sm"
              {...register("main.chainId")}
              placeholder="neutron-1"
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
          <>
            {externalChains.map((chain, index) => {
              return (
                <div className="flex flex-col gap-2">
                  <Heading level="h3">External Chain: {chain.name}</Heading>
                  <FormField
                    key={`chain-rpcurl-${chain.chainId}`}
                    name={`chains.${index}.rpcUrl`}
                  >
                    <InputLabel size="sm" label={"RPC URL"} />
                    <TextInput
                      size="sm"
                      {...register(`externalChains.${index}.rpcUrl`)}
                      placeholder="https://"
                    />
                  </FormField>
                  <FormField
                    key={`chain-chainId-${chain.chainId}`}
                    name={`chains.${index}.chainId`}
                  >
                    <InputLabel size="sm" label={"Chain ID (for signing)"} />
                    <TextInput
                      size="sm"
                      {...register(`externalChains.${index}.chainId`)}
                      placeholder="chain-1"
                    />
                  </FormField>
                </div>
              );
            })}
          </>
        )}
      </FormRoot>
    </div>
  );
};
