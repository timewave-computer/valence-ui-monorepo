import { RebalancerUpdateData } from "@valence-ui/generated-types/cosmwasm/types/Rebalancer.types";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { jsonToBase64, jsonToUtf8, numberToUint128 } from "@/utils";
import { MsgExecuteContract } from "@/smol_telescope/generated-files";
import { hasDenom } from "@/app/rebalancer/utils";

export const makeUpdateRebalancerMessage = ({
  creatorAddress,
  predictableValenceAddress,
  config,
}: {
  config: CreateRebalancerForm;
  creatorAddress: string;
  predictableValenceAddress: string;
}): MsgExecuteContract => {
  const data: RebalancerUpdateData = {
    base_denom: config.baseTokenDenom,
    pid: {
      p: parseFloat(config.pid.p).toString(),
      i: parseFloat(config.pid.i).toString(),
      d: parseFloat(config.pid.d).toString(),
    },
    target_override_strategy: config.targetOverrideStrategy,
    targets: config.targets.filter(hasDenom).map((target) => ({
      denom: target.denom,
      bps: target.bps * 100, // ("10%"=> 1000)
      ...(!!target.minimumAmount && {
        min_balance: numberToUint128(target.minimumAmount),
      }),
    })),
    trustee: config.trustee ? { set: config.trustee } : "clear",
    max_limit_bps: config.maxLimit ? { set: config.maxLimit } : "clear",
  };
  return {
    contract: predictableValenceAddress,
    msg: jsonToUtf8({
      update_service: {
        data: jsonToBase64(data),
        service_name: "rebalancer",
      },
    }),
    sender: creatorAddress,
    funds: [],
  };
};
