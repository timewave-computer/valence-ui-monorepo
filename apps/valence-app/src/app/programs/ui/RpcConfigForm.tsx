"use client";
import {
  Button,
  FormField,
  FormRoot,
  Heading,
  InputLabel,
  TextInput,
} from "@valence-ui/ui-components";
import { useForm } from "react-hook-form";
import { useQueryArgs } from "@/app/programs/ui";
import { debounce } from "lodash";
import { ChainInfo } from "@keplr-wallet/types";
import { SigningStargateClient } from "@cosmjs/stargate";

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
  const [queryConfig, setQueryConfig] = useQueryArgs();

  const mainChain = queryConfig.main;
  const externalChains = queryConfig.external;

  //@ts-ignore
  const { keplr } = window;

  const testChainInfo = getTestnetChainInfo({
    chainId: "neutron-1-test-2",
    chainName: "Neutron Local 2",
    rpcUrl: queryConfig.main.rpcUrl,
  });
  console.log("test chain info", testChainInfo);

  const connectWithSigner = async () => {
    await keplr.experimentalSuggestChain(testChainInfo);
    await keplr.enable("neutron-1-test-2");

    //@ts-ignore
    const offlineSigner = window.getOfflineSigner!("neutron-1-test-2");
    console.log("offline signer", offlineSigner);

    const creator = (await offlineSigner.getAccounts())[0].address;
    console.log("creator", creator);

    try {
      // const res = await fetch(testChainInfo.rpc)
      // console.log('FETCH RES',res)
      const signingClient = await SigningStargateClient.connectWithSigner(
        testChainInfo.rpc,
        offlineSigner,
      );
      console.log("signing client ", signingClient);
    } catch (e) {
      console.log("error connecting with signer", e);
    }
  };

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
  }, 300);

  return (
    <div>
      <Button onClick={connectWithSigner}>Connect with Signer</Button>
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

const getTestnetChainInfo = ({
  chainId,
  chainName,
  rpcUrl,
}: {
  chainId: string;
  chainName: string;
  rpcUrl: string;
}): ChainInfo => {
  return {
    chainId: `${chainId}`,
    chainName: `${chainName}`,
    // rpc: '127.0.0.1:60652',
    // rpc:'http://localhost:60652',
    rpc: "https://8661-2601-8c-4982-6aa0-9159-995b-b8ce-3426.ngrok-free.app",
    rest: "https://ebb6-2601-8c-4982-6aa0-9159-995b-b8ce-3426.ngrok-free.app",
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "neutron",
      bech32PrefixAccPub: "neutron" + "pub",
      bech32PrefixValAddr: "neutron" + "valoper",
      bech32PrefixValPub: "neutron" + "valoperpub",
      bech32PrefixConsAddr: "neutron" + "valcons",
      bech32PrefixConsPub: "neutron" + "valconspub",
    },
    currencies: [
      {
        coinDenom: "NTRN",
        coinMinimalDenom: "untrn",
        coinDecimals: 6,
        coinGeckoId: "neutron-3",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "NTRN",
        coinMinimalDenom: "untrn",
        coinDecimals: 6,
        coinGeckoId: "neutron-3",
        gasPriceStep: {
          low: 1,
          average: 1,
          high: 1,
        },
      },
    ],
    stakeCurrency: {
      coinDenom: "NTRN",
      coinMinimalDenom: "untrn",
      coinDecimals: 6,
      coinGeckoId: "neutron-3",
    },
    features: ["ibc-transfer"],
  };
};
