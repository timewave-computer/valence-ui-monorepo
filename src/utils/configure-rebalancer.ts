import type { EncodeObject } from "@cosmjs/proto-signing";
import { CosmWasmClient, instantiate2Address } from "@cosmjs/cosmwasm-stargate";
import { fromHex, toUtf8 } from "@cosmjs/encoding";
import { chainConfig } from "@/const/config";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { InstantiateMsg as ValenceAccountInstatiateMessage } from "@/codegen/Account.types";
import { USDC_DENOM } from "@/const/chain-data";
import { baseToMicroDenomString } from "./denom-math";
import { RebalancerData } from "@/codegen/Rebalancer.types";
import { MsgInstantiateContract2 } from "@/types/cosmos";

const VALENCE_INSTANTIATE_2_SALT = "valence-instantiate-2";
const SERVICES_MANAGER_ADDRESS = chainConfig.addresses.servicesManager;

export const makeTransactionMessages = async ({
  creatorAddress,
  cosmwasmClient,
}: {
  creatorAddress: string;
  cosmwasmClient: CosmWasmClient;
}) => {
  const CODE_ID = chainConfig.codeIds.Account;
  // Load checksum of the contract code.
  const codeDetails = await cosmwasmClient.getCodeDetails(CODE_ID);
  if (!codeDetails) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.CREATE_REBALANCER_CODE_ID_ERROR} ${CODE_ID}`,
    );
  }

  // deterministically generate valence account address
  const predictableValenceAddress = instantiate2Address(
    fromHex(codeDetails.checksum),
    creatorAddress,
    toUtf8(VALENCE_INSTANTIATE_2_SALT),
    chainConfig.chain.bech32_prefix,
  );

  const instatiateMessage: ValenceAccountInstatiateMessage = {
    services_manager: SERVICES_MANAGER_ADDRESS,
  };

  const instantiate2Message: MsgInstantiateContract2 = {
    sender: creatorAddress,
    admin: creatorAddress,
    codeId: BigInt(CODE_ID),
    label: "Valence Account",
    msg: toUtf8(JSON.stringify(instatiateMessage)),
    funds: [
      {
        denom: USDC_DENOM,
        amount: baseToMicroDenomString(25, 8),
      },
      {
        denom: "untrn",
        amount: baseToMicroDenomString(100, 8),
      },
    ].sort((a, b) => a.denom.localeCompare(b.denom)), //  Neutron errors with `invalid coins` if the funds list is not alphabetized.
    salt: toUtf8(VALENCE_INSTANTIATE_2_SALT),
    fixMsg: false,
  };

  const registerMessage: {
    data: RebalancerData;
    register_for: string;
  } = {
    data: {
      base_denom: USDC_DENOM,
      // max_limit_bps TODO
      pid: {
        p: "1000",
        i: "0",
        d: "0",
      },
      target_override_strategy: "proportional",
      targets: [
        {
          bps: 10,
          denom: "untrn",
          // min_balance TODO
        },
        {
          bps: 90,
          denom: USDC_DENOM,
          // min_balance  TODO
        },
      ],
      // trustee TODO
    },
    register_for: creatorAddress,
  };

  const messages: EncodeObject[] = [
    // create valence account
    {
      typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
      value: instantiate2Message,
    },
    // register account with rebalancer
    {
      typeUrl: "/cosmos.authz.v1beta1.MsgExec", // TODO: is this correct??
      value: registerMessage,
    },
  ];

  return messages;
};
