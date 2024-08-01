//@ts-nocheck - error on Registry type
import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgExecuteContract, MsgInstantiateContract2 } from "./cosmwasm";

export const SMOL_registry: ReadonlyArray<[string, GeneratedType]> = [
  ["/cosmwasm.wasm.v1.MsgInstantiateContract2", MsgInstantiateContract2],
  ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract],
];
