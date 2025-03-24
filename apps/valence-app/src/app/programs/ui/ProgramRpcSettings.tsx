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
import {
  ProgramParserResult,
  type ProgramQueryConfig,
} from "@/app/programs/server";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

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
  domains,
  initialQueryConfig,
}: {
  domains?: ProgramParserResult["domains"];
  queryConfig: ProgramQueryConfig;
  setQueryConfig: (config: ProgramQueryConfig) => void;
  initialQueryConfig: ProgramQueryConfig;
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
          initialQueryConfig={initialQueryConfig}
          domains={domains}
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
  domains: _domains,
  initialQueryConfig,
}: {
  domains?: ProgramParserResult["domains"];
  initialQueryConfig: ProgramQueryConfig;

  queryConfig: ProgramQueryConfig;
  setQueryConfig: (config: ProgramQueryConfig) => void;
}) => {
  // this will persist domains across refetches, so form does not lose fields during refetch
  const [domains, setDomains] = useState(_domains);
  useEffect(() => {
    if (_domains) {
      setDomains(_domains);
    }
  }, [_domains]);

  const mainDomainName = domains?.main;
  const externalDomainNames = domains?.external;

  const mainDomainQueryConfig = queryConfig.main;

  // generate form from program config. if params are not specified in url, it will show as blank
  const { register, handleSubmit } = useForm<RpcConfigFormValues>({
    defaultValues: {
      main: {
        domainName: mainDomainName,
        chainName: mainDomainQueryConfig.chainName,
        chainId: mainDomainQueryConfig.chainId,
        registryAddress: mainDomainQueryConfig.registryAddress,
        rpc: mainDomainQueryConfig.rpc,
      },
      externalChains: externalDomainNames?.map((externalDomainName) => {
        // first check url params
        let externalDomainConfig = queryConfig?.external?.find(
          (config) => config.domainName === externalDomainName,
        );

        // otherwise access the default values that come with the fetch
        if (!externalDomainConfig) {
          externalDomainConfig = initialQueryConfig?.external?.find(
            (config) => config.domainName === externalDomainName,
          );
        }

        return {
          chainId: externalDomainConfig?.chainId ?? undefined,
          rpc: externalDomainConfig?.rpc ?? undefined,
          domainName: externalDomainName,
          chainName: externalDomainName,
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
  // TODO!!: base from program domain setup instead of query config
  return (
    <div>
      <FormRoot
        onChange={handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2 ">
          <Heading level="h3">Main Chain: {mainDomainName}</Heading>

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
        {externalDomainNames && externalDomainNames.length > 0 && (
          <>
            {externalDomainNames.map((externalDomainName, index) => {
              return (
                <div
                  key={`externalchain-${externalDomainName}`}
                  className="flex flex-col gap-2"
                >
                  <Heading level="h3">
                    External Chain: {externalDomainName}
                  </Heading>
                  <FormField
                    key={`chain-rpcurl-${externalDomainName}`}
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
                    key={`chain-chainId-${externalDomainName}}`}
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
