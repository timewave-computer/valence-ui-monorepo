//@ts-nocheck
import {
  MsgExecuteContract,
  MsgInstantiateContract2,
  MsgSend,
} from "./generated-files";

// paired down version just with what we need
export const AminoConverter = {
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
    animoType: "cosmos-sdk/MsgSend",
    toAmino: MsgSend.toAmino,
    fromAmino: MsgSend.fromAmino,
  },
};
