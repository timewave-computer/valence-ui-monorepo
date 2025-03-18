"use client";
import { LOCAL_DEV_DOC_URL } from "@valence-ui/socials";
import {
  Button,
  Sheet,
  SheetTrigger,
  SheetContent,
  LinkText,
  FormField,
  FormRoot,
  Heading,
  InputLabel,
  TextInput,
} from "@valence-ui/ui-components";
import { type ProgramQueryConfig } from "@/app/programs/server";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";

type RpcConfigFormValues = {
  main: {
    registryAddress: string;
    rpc: string;
    chainName: string;
    domainName: string;
    chainId: string;
  };
  externalChains?: Array<{
    chainId: string;
    rpc: string;
    chainName: string;
    domainName: string;
  }>;
};

export const ProgramRpcSettings = ({
  queryConfig,
  setQueryConfig,
}: {
  queryConfig: ProgramQueryConfig;
  setQueryConfig: (config: ProgramQueryConfig) => void;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">RPC Settings</Button>
      </SheetTrigger>
      <SheetContent title="RPC Settings" className="w-1/2" side="right">
        <Heading level="h2">RPC Settings</Heading>
        <div>
          <p className="text-sm">
            The programs UI can connect to any public RPC endpoint.
          </p>
          <LinkText
            blankTarget={true}
            href={LOCAL_DEV_DOC_URL}
            className="text-sm"
            variant="highlighted"
          >
            Learn how to use this UI with local development.
          </LinkText>
        </div>

        <RpcSettingsForm
          queryConfig={queryConfig}
          setQueryConfig={setQueryConfig}
        />
      </SheetContent>
    </Sheet>
  );
};

/**
 * Needs to be its own component so form refreshes when sheet closes
 */
const RpcSettingsForm = ({
  queryConfig,
  setQueryConfig,
}: {
  queryConfig: ProgramQueryConfig;
  setQueryConfig: (config: ProgramQueryConfig) => void;
}) => {
  const mainDomain = queryConfig.main;
  const externalDomains = queryConfig.external;

  const { register, handleSubmit } = useForm<RpcConfigFormValues>({
    defaultValues: {
      main: {
        domainName: mainDomain.domainName,
        chainName: mainDomain.chainName,
        chainId: mainDomain.chainId,
        registryAddress: mainDomain.registryAddress,
        rpc: mainDomain.rpc,
      },
      externalChains: externalDomains?.map((c) => {
        return {
          chainId: c.chainId,
          rpc: c.rpc,
          domainName: c.domainName,
          chainName: c.chainName,
        };
      }),
    },
  });

  const handleSubmitForm = debounce((values: RpcConfigFormValues) => {
    setQueryConfig({
      main: {
        registryAddress: values.main.registryAddress,
        domainName: values.main.domainName,
        chainName: values.main.chainName,
        chainId: values.main.chainId,
        rpc: values.main.rpc,
      },
      external: [
        ...(values.externalChains?.map((chain) => ({
          chainId: chain.chainId,
          rpc: chain.rpc,
          chainName: chain.chainName,
          domainName: chain.domainName,
        })) ?? []),
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
          <Heading level="h3">Main Chain: {mainDomain.domainName}</Heading>

          <FormField name="main.rpc">
            <InputLabel size="sm" label={`RPC URL`} />

            <TextInput
              size="sm"
              {...register("main.rpc")}
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
        {externalDomains && externalDomains.length > 0 && (
          <>
            {externalDomains.map((chain, index) => {
              return (
                <div
                  key={`externalchain-${chain.domainName}`}
                  className="flex flex-col gap-2"
                >
                  <Heading level="h3">
                    External Chain: {chain.domainName}
                  </Heading>
                  <FormField
                    key={`chain-rpcurl-${chain.domainName}`}
                    name={`chains.${index}.rpc`}
                  >
                    <InputLabel size="sm" label={"RPC URL"} />
                    <TextInput
                      size="sm"
                      {...register(`externalChains.${index}.rpc`)}
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
