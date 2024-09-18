//@ts-nocheck - error on Registry type
import { GeneratedType } from "@cosmjs/proto-signing";
import {
  MsgExecuteContract,
  MsgInstantiateContract2,
  MsgSend,
} from "./generated-files";

/***
 *  Used for generating amino typs
 */
export const protoRegistry: ReadonlyArray<[string, GeneratedType]> = [
  ["/cosmwasm.wasm.v1.MsgInstantiateContract2", MsgInstantiateContract2],
  ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract],
  ["/cosmos.bank.v1beta1.MsgSend", MsgSend],
];
