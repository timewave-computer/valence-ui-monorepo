import {
  MsgExecuteContract,
  MsgInstantiateContract2,
  MsgSend,
} from "./generated-files";
import { AminoConverters } from "@cosmjs/stargate";

// paired down version just with what we need
export const aminoConverters: AminoConverters = {
  "/cosmwasm.wasm.v1.MsgInstantiateContract2": {
    aminoType: "wasm/MsgInstantiateContract2",
    toAmino: MsgInstantiateContract2.toAmino,
    fromAmino: MsgInstantiateContract2.fromAmino,
  },
  "/cosmwasm.wasm.v1.MsgExecuteContract": {
    aminoType: "wasm/MsgExecuteContract",
    toAmino: MsgExecuteContract.toAmino,
    fromAmino: MsgExecuteContract.fromAmino,
  },
  "/cosmos.bank.v1beta1.MsgSend": {
    aminoType: "cosmos-sdk/MsgSend",
    toAmino: MsgSend.toAmino,
    fromAmino: MsgSend.fromAmino,
  },
};
