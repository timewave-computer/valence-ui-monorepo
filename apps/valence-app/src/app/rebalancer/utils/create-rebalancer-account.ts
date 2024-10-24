import { type Coin, type EncodeObject } from "@cosmjs/proto-signing";
import { CosmWasmClient, instantiate2Address } from "@cosmjs/cosmwasm-stargate";
import { chainConfig } from "@/const/config";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { InstantiateMsg as ValenceAccountInstatiateMessage } from "@/codegen/ts-codegen/Account.types";
import { baseToMicroDenomString } from "@/utils/denom-math";
import { RebalancerData } from "@/codegen/ts-codegen/Rebalancer.types";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { fromBase64, fromHex, fromUtf8, toUtf8 } from "@cosmjs/encoding";
import { jsonToBase64, jsonToUtf8, numberToUint128, utf8ToJson } from "@/utils";
import {
  MsgExecuteContract,
  MsgInstantiateContract2,
} from "@/smol_telescope/generated-files";
import { hasDenom } from "@/app/rebalancer/utils";

/**
 * If the value starts with a decimal point, add a leading zero.
 */
const ifDecimalPadWithLeadingZero = (value: number | string): string => {
  let numString: string = typeof value === "string" ? value : value.toString();
  if (numString.startsWith(".")) {
    numString = `0${numString}`;
  }
  return numString;
};

export const makeCreateRebalancerMessages = async ({
  creatorAddress,
  cosmwasmClient,
  config,
}: {
  creatorAddress: string;
  cosmwasmClient: CosmWasmClient;
  config: CreateRebalancerForm;
}): Promise<{
  valenceAddress: string;
  messages: EncodeObject[];
}> => {
  const valenceAccountCodeId = chainConfig.codeIds.Account;

  /**
   * The salt used to generate a predictable valence account address.
   */
  const salt = `valence-ui-v1`;

  // deterministically generate account address
  const predictableValenceAddress = await generatePredictableAddress({
    creatorAddress: creatorAddress,
    codeId: valenceAccountCodeId,
    salt,
    cosmwasmClient,
  });
  return {
    messages: [
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
          config,
          creatorAddress,
          predictableValenceAddress,
        }),
      },
    ],
    valenceAddress: predictableValenceAddress,
  };
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
  const convertedFunds = config.initialAssets
    .map((asset) => {
      // if service fee part of starting funds, include
      if (asset.denom === SERVICE_FEE.denom) {
        return {
          denom: asset.denom,
          amount: baseToMicroDenomString(
            Number(asset.startingAmount) + SERVICE_FEE.amount,
            SERVICE_FEE.decimalPoints,
          ),
        } as Coin;
      } else
        return {
          denom: asset.denom,
          amount: baseToMicroDenomString(
            asset.startingAmount ?? 0,
            SERVICE_FEE.decimalPoints,
          ),
        } as Coin;
    })
    .filter((f) => f.amount !== "0")
    .sort((a, b) => a.denom!.localeCompare(b.denom!)); // TODO: remove !, adjust type from form -> required input

  // add service fee
  if (!convertedFunds.find((f) => f.denom === SERVICE_FEE.denom)) {
    convertedFunds.push({
      denom: SERVICE_FEE.denom,
      amount: baseToMicroDenomString(
        SERVICE_FEE.amount,
        SERVICE_FEE.decimalPoints,
      ),
    } as Coin);
  }

  return {
    sender: creatorAddress,
    admin: creatorAddress,
    codeId: BigInt(codeId),
    label: "Rebalancer Account",
    msg: jsonToUtf8({
      services_manager: chainConfig.addresses.servicesManager,
    } as ValenceAccountInstatiateMessage),
    funds: convertedFunds,
    salt: toUtf8(salt),
    fixMsg: false,
  };
};

export const decodeInstatiateMessage = (obj: EncodeObject): any => {
  return {
    ...obj,
    value: {
      ...obj.value,
      msg: utf8ToJson(obj.value.msg),
      salt: fromUtf8(obj.value.salt),
    },
  };
};

export const decodeRegisterMessage = (obj: EncodeObject): any => {
  const msg = utf8ToJson(obj.value.msg);
  const data = fromBase64(msg.register_to_service.data);
  return {
    ...obj,
    value: {
      ...obj.value,
      msg: {
        ...msg,
        register_to_service: {
          ...msg.register_to_service,
          data: utf8ToJson(data),
        },
      },
    },
  };
};

const makeRegisterMessage = ({
  creatorAddress,
  predictableValenceAddress,
  config,
}: {
  config: CreateRebalancerForm;
  creatorAddress: string;
  predictableValenceAddress: string;
}): MsgExecuteContract => {
  const data: RebalancerData = {
    base_denom: config.baseTokenDenom,
    pid: {
      p: ifDecimalPadWithLeadingZero(parseFloat(config.pid.p).toString()),
      i: ifDecimalPadWithLeadingZero(parseFloat(config.pid.i).toString()),
      d: ifDecimalPadWithLeadingZero(parseFloat(config.pid.d).toString()),
    },
    ...(!!config.maxLimit && {
      max_limit_bps: config.maxLimit * 100, // ("10%"=> 1000)
    }),
    target_override_strategy: config.targetOverrideStrategy,
    targets: config.targets.filter(hasDenom).map((target) => ({
      denom: target.denom,
      bps: target.bps * 100, // ("10%"=> 1000)
      ...(!!target.minimumAmount && {
        min_balance: numberToUint128(target.minimumAmount),
      }),
    })),
    ...(!!config.trustee &&
      config.trustee !== "" && { trustee: config.trustee }),
  };
  return {
    contract: predictableValenceAddress,
    msg: jsonToUtf8({
      ["register_to_service"]: {
        data: jsonToBase64(data),
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

  // appease typescript overload
  if (!chainConfig.chain.bech32_prefix) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.CREATE_REBALANCER_CHAIN_PREFIX_ERROR}`,
    );
  }
  return instantiate2Address(
    fromHex(codeDetails.checksum),
    creatorAddress,
    toUtf8(salt),
    chainConfig.chain.bech32_prefix,
  );
};
