import { type Coin, type EncodeObject } from "@cosmjs/proto-signing";
import { CosmWasmClient, instantiate2Address } from "@cosmjs/cosmwasm-stargate";
import { chainConfig } from "@/const/config";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { InstantiateMsg as ValenceAccountInstatiateMessage } from "@/codegen/ts-codegen/Account.types";
import { baseToMicroDenomString } from "./denom-math";
import { RebalancerData } from "@/codegen/ts-codegen/Rebalancer.types";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { fromHex, toUtf8 } from "@cosmjs/encoding";
import Decimal from "decimal.js";

import { UTCDate } from "@date-fns/utc";
import { jsonToBase64, jsonToUtf8 } from "@/utils";
import {
  MsgExecuteContract,
  MsgInstantiateContract2,
} from "@/app/smol_telescope/cosmwasm";

export const makeCreateRebalancerMessages = async ({
  creatorAddress,
  cosmwasmClient,
  config,
}: {
  creatorAddress: string;
  cosmwasmClient: CosmWasmClient;
  config: CreateRebalancerForm;
}): Promise<EncodeObject[]> => {
  const valenceAccountCodeId = chainConfig.codeIds.Account;

  // TODO: in production this should include address of the creator
  const salt = "valence" + UTCDate.now().toString();

  // deterministically generate account address
  const predictableValenceAddress = await generatePredictableAddress({
    creatorAddress: creatorAddress,
    codeId: valenceAccountCodeId,
    salt,
    cosmwasmClient,
  });

  return [
    {
      typeUrl: MsgInstantiateContract2.typeUrl,
      value: makeInstantiateMessageBody({
        creatorAddress,
        cosmwasmClient,
        config,
        codeId: valenceAccountCodeId,
        salt,
      }),
    },
    {
      typeUrl: MsgExecuteContract.typeUrl,
      value: makeRegisterMessage({
        creatorAddress,
        predictableValenceAddress,
      }),
    },
  ];
};

const makeInstantiateMessageBody = ({
  config,
  creatorAddress,
  codeId,
  salt,
}: {
  creatorAddress: string;
  cosmwasmClient: CosmWasmClient;
  config: CreateRebalancerForm;
  codeId: number;
  salt: string;
}): MsgInstantiateContract2 => {
  const SERVICE_FEE = chainConfig.serviceFee;
  // convert to micro units
  const convertedFunds = config.assets
    .map((asset) => {
      // if service fee part of starting funds, include
      if (asset.denom === SERVICE_FEE.denom) {
        return {
          denom: asset.denom,
          amount: baseToMicroDenomString(
            Number(asset.startingAmount) + SERVICE_FEE.amount,
            6,
          ), // TODO: get correct decimals
        } as Coin;
      } else
        return {
          denom: asset.denom,
          amount: baseToMicroDenomString(asset.startingAmount, 6), // TODO: get correct decimals
        } as Coin;
    })
    .sort((a, b) => a.denom!.localeCompare(b.denom!)); // TODO: remove !, adjust type from form -> required input

  // add service fee
  if (!convertedFunds.find((f) => f.denom === SERVICE_FEE.denom)) {
    convertedFunds.push({
      denom: SERVICE_FEE.denom,
      amount: baseToMicroDenomString(SERVICE_FEE.amount, 6),
    } as Coin);
  }

  return {
    sender: creatorAddress,
    admin: creatorAddress,
    codeId: BigInt(codeId),
    label: "Valence Account",
    msg: jsonToUtf8({
      services_manager: chainConfig.addresses.servicesManager,
    } as ValenceAccountInstatiateMessage),
    funds: convertedFunds,
    salt: toUtf8(salt),
    fixMsg: false,
  };
};

const makeRegisterMessage = ({
  creatorAddress,
  predictableValenceAddress,
}: {
  creatorAddress: string;
  predictableValenceAddress: string;
}): MsgExecuteContract => {
  return {
    // TODO: trustee, max bps, min balance
    contract: predictableValenceAddress,
    msg: jsonToUtf8({
      register_to_service: {
        data: jsonToBase64({
          base_denom: "untrn",
          pid: {
            p: new Decimal(".2").toString(),
            i: "0", // TODO: map over config and use decimal.js for all
            d: "0",
          },
          target_override_strategy: "proportional",
          targets: [
            { denom: "untrn", bps: 10 * 100 },
            {
              denom:
                "factory/neutron1phx0sz708k3t6xdnyc98hgkyhra4tp44et5s68/rebalancer-test",
              bps: 90 * 100,
            },
          ],
        } as RebalancerData),
        service_name: "rebalancer",
      },
    }),
    sender: creatorAddress,
    funds: [],
  };
};

const generatePredictableAddress = async ({
  codeId,
  salt,
  cosmwasmClient,
  creatorAddress,
}: {
  codeId: number;
  salt: string;
  cosmwasmClient: CosmWasmClient;
  creatorAddress: string;
}): Promise<string> => {
  // Load checksum of the contract code.
  const codeDetails = await cosmwasmClient.getCodeDetails(codeId);
  if (!codeDetails) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.CREATE_REBALANCER_CODE_ID_ERROR} ${codeId}`,
    );
  }
  return instantiate2Address(
    fromHex(codeDetails.checksum),
    creatorAddress,
    toUtf8(salt),
    chainConfig.chain.bech32_prefix,
  );
};
