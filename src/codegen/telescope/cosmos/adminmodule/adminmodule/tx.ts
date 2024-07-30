//@ts-nocheck
/* eslint-disable */
import {
  Any,
  AnyProtoMsg,
  AnyAmino,
  AnySDKType,
} from "../../../google/protobuf/any";
import { BinaryReader, BinaryWriter } from "../../../binary";
export interface MsgDeleteAdmin {
  creator: string;
  admin: string;
}
export interface MsgDeleteAdminProtoMsg {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgDeleteAdmin";
  value: Uint8Array;
}
export interface MsgDeleteAdminAmino {
  creator?: string;
  admin?: string;
}
export interface MsgDeleteAdminAminoMsg {
  type: "cosmos-sdk/MsgDeleteAdmin";
  value: MsgDeleteAdminAmino;
}
export interface MsgDeleteAdminSDKType {
  creator: string;
  admin: string;
}
export interface MsgDeleteAdminResponse {}
export interface MsgDeleteAdminResponseProtoMsg {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgDeleteAdminResponse";
  value: Uint8Array;
}
export interface MsgDeleteAdminResponseAmino {}
export interface MsgDeleteAdminResponseAminoMsg {
  type: "cosmos-sdk/MsgDeleteAdminResponse";
  value: MsgDeleteAdminResponseAmino;
}
export interface MsgDeleteAdminResponseSDKType {}
export interface MsgAddAdmin {
  creator: string;
  admin: string;
}
export interface MsgAddAdminProtoMsg {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgAddAdmin";
  value: Uint8Array;
}
export interface MsgAddAdminAmino {
  creator?: string;
  admin?: string;
}
export interface MsgAddAdminAminoMsg {
  type: "cosmos-sdk/MsgAddAdmin";
  value: MsgAddAdminAmino;
}
export interface MsgAddAdminSDKType {
  creator: string;
  admin: string;
}
export interface MsgAddAdminResponse {}
export interface MsgAddAdminResponseProtoMsg {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgAddAdminResponse";
  value: Uint8Array;
}
export interface MsgAddAdminResponseAmino {}
export interface MsgAddAdminResponseAminoMsg {
  type: "cosmos-sdk/MsgAddAdminResponse";
  value: MsgAddAdminResponseAmino;
}
export interface MsgAddAdminResponseSDKType {}
/**
 * MsgSubmitProposalLegacy defines an sdk.Msg type that supports submitting arbitrary
 * proposal Content.
 */
export interface MsgSubmitProposalLegacy {
  content?: Any | undefined;
  proposer: string;
}
export interface MsgSubmitProposalLegacyProtoMsg {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgSubmitProposalLegacy";
  value: Uint8Array;
}
export type MsgSubmitProposalLegacyEncoded = Omit<
  MsgSubmitProposalLegacy,
  "content"
> & {
  content?: AnyProtoMsg | undefined;
};
/**
 * MsgSubmitProposalLegacy defines an sdk.Msg type that supports submitting arbitrary
 * proposal Content.
 */
export interface MsgSubmitProposalLegacyAmino {
  content?: AnyAmino;
  proposer?: string;
}
export interface MsgSubmitProposalLegacyAminoMsg {
  type: "cosmos-sdk/MsgSubmitProposalLegacy";
  value: MsgSubmitProposalLegacyAmino;
}
/**
 * MsgSubmitProposalLegacy defines an sdk.Msg type that supports submitting arbitrary
 * proposal Content.
 */
export interface MsgSubmitProposalLegacySDKType {
  content?: AnySDKType | undefined;
  proposer: string;
}
/** MsgSubmitProposalLegacyResponse defines the Msg/SubmitProposalLegacy response type. */
export interface MsgSubmitProposalLegacyResponse {
  proposalId: bigint;
}
export interface MsgSubmitProposalLegacyResponseProtoMsg {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgSubmitProposalLegacyResponse";
  value: Uint8Array;
}
/** MsgSubmitProposalLegacyResponse defines the Msg/SubmitProposalLegacy response type. */
export interface MsgSubmitProposalLegacyResponseAmino {
  proposal_id: string;
}
export interface MsgSubmitProposalLegacyResponseAminoMsg {
  type: "cosmos-sdk/MsgSubmitProposalLegacyResponse";
  value: MsgSubmitProposalLegacyResponseAmino;
}
/** MsgSubmitProposalLegacyResponse defines the Msg/SubmitProposalLegacy response type. */
export interface MsgSubmitProposalLegacyResponseSDKType {
  proposal_id: bigint;
}
/**
 * MsgSubmitProposal defines an sdk.Msg type that supports submitting arbitrary
 * proposal Content.
 */
export interface MsgSubmitProposal {
  /** messages are the arbitrary messages to be executed if proposal passes. */
  messages: Any[];
  proposer: string;
}
export interface MsgSubmitProposalProtoMsg {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgSubmitProposal";
  value: Uint8Array;
}
/**
 * MsgSubmitProposal defines an sdk.Msg type that supports submitting arbitrary
 * proposal Content.
 */
export interface MsgSubmitProposalAmino {
  /** messages are the arbitrary messages to be executed if proposal passes. */
  messages?: AnyAmino[];
  proposer?: string;
}
export interface MsgSubmitProposalAminoMsg {
  type: "cosmos-sdk/MsgSubmitProposal";
  value: MsgSubmitProposalAmino;
}
/**
 * MsgSubmitProposal defines an sdk.Msg type that supports submitting arbitrary
 * proposal Content.
 */
export interface MsgSubmitProposalSDKType {
  messages: AnySDKType[];
  proposer: string;
}
/** MsgSubmitProposalResponse defines the Msg/SubmitProposal response type. */
export interface MsgSubmitProposalResponse {
  proposalId: bigint;
}
export interface MsgSubmitProposalResponseProtoMsg {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgSubmitProposalResponse";
  value: Uint8Array;
}
/** MsgSubmitProposalResponse defines the Msg/SubmitProposal response type. */
export interface MsgSubmitProposalResponseAmino {
  proposal_id: string;
}
export interface MsgSubmitProposalResponseAminoMsg {
  type: "cosmos-sdk/MsgSubmitProposalResponse";
  value: MsgSubmitProposalResponseAmino;
}
/** MsgSubmitProposalResponse defines the Msg/SubmitProposal response type. */
export interface MsgSubmitProposalResponseSDKType {
  proposal_id: bigint;
}
function createBaseMsgDeleteAdmin(): MsgDeleteAdmin {
  return {
    creator: "",
    admin: "",
  };
}
export const MsgDeleteAdmin = {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgDeleteAdmin",
  encode(
    message: MsgDeleteAdmin,
    writer: BinaryWriter = BinaryWriter.create(),
  ): BinaryWriter {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.admin !== "") {
      writer.uint32(18).string(message.admin);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgDeleteAdmin {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeleteAdmin();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.admin = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgDeleteAdmin>): MsgDeleteAdmin {
    const message = createBaseMsgDeleteAdmin();
    message.creator = object.creator ?? "";
    message.admin = object.admin ?? "";
    return message;
  },
  fromAmino(object: MsgDeleteAdminAmino): MsgDeleteAdmin {
    const message = createBaseMsgDeleteAdmin();
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    }
    if (object.admin !== undefined && object.admin !== null) {
      message.admin = object.admin;
    }
    return message;
  },
  toAmino(message: MsgDeleteAdmin): MsgDeleteAdminAmino {
    const obj: any = {};
    obj.creator = message.creator === "" ? undefined : message.creator;
    obj.admin = message.admin === "" ? undefined : message.admin;
    return obj;
  },
  fromAminoMsg(object: MsgDeleteAdminAminoMsg): MsgDeleteAdmin {
    return MsgDeleteAdmin.fromAmino(object.value);
  },
  toAminoMsg(message: MsgDeleteAdmin): MsgDeleteAdminAminoMsg {
    return {
      type: "cosmos-sdk/MsgDeleteAdmin",
      value: MsgDeleteAdmin.toAmino(message),
    };
  },
  fromProtoMsg(message: MsgDeleteAdminProtoMsg): MsgDeleteAdmin {
    return MsgDeleteAdmin.decode(message.value);
  },
  toProto(message: MsgDeleteAdmin): Uint8Array {
    return MsgDeleteAdmin.encode(message).finish();
  },
  toProtoMsg(message: MsgDeleteAdmin): MsgDeleteAdminProtoMsg {
    return {
      typeUrl: "/cosmos.adminmodule.adminmodule.MsgDeleteAdmin",
      value: MsgDeleteAdmin.encode(message).finish(),
    };
  },
};
function createBaseMsgDeleteAdminResponse(): MsgDeleteAdminResponse {
  return {};
}
export const MsgDeleteAdminResponse = {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgDeleteAdminResponse",
  encode(
    _: MsgDeleteAdminResponse,
    writer: BinaryWriter = BinaryWriter.create(),
  ): BinaryWriter {
    return writer;
  },
  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): MsgDeleteAdminResponse {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeleteAdminResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(_: Partial<MsgDeleteAdminResponse>): MsgDeleteAdminResponse {
    const message = createBaseMsgDeleteAdminResponse();
    return message;
  },
  fromAmino(_: MsgDeleteAdminResponseAmino): MsgDeleteAdminResponse {
    const message = createBaseMsgDeleteAdminResponse();
    return message;
  },
  toAmino(_: MsgDeleteAdminResponse): MsgDeleteAdminResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgDeleteAdminResponseAminoMsg): MsgDeleteAdminResponse {
    return MsgDeleteAdminResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgDeleteAdminResponse): MsgDeleteAdminResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgDeleteAdminResponse",
      value: MsgDeleteAdminResponse.toAmino(message),
    };
  },
  fromProtoMsg(
    message: MsgDeleteAdminResponseProtoMsg,
  ): MsgDeleteAdminResponse {
    return MsgDeleteAdminResponse.decode(message.value);
  },
  toProto(message: MsgDeleteAdminResponse): Uint8Array {
    return MsgDeleteAdminResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgDeleteAdminResponse): MsgDeleteAdminResponseProtoMsg {
    return {
      typeUrl: "/cosmos.adminmodule.adminmodule.MsgDeleteAdminResponse",
      value: MsgDeleteAdminResponse.encode(message).finish(),
    };
  },
};
function createBaseMsgAddAdmin(): MsgAddAdmin {
  return {
    creator: "",
    admin: "",
  };
}
export const MsgAddAdmin = {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgAddAdmin",
  encode(
    message: MsgAddAdmin,
    writer: BinaryWriter = BinaryWriter.create(),
  ): BinaryWriter {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.admin !== "") {
      writer.uint32(18).string(message.admin);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgAddAdmin {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgAddAdmin();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.admin = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgAddAdmin>): MsgAddAdmin {
    const message = createBaseMsgAddAdmin();
    message.creator = object.creator ?? "";
    message.admin = object.admin ?? "";
    return message;
  },
  fromAmino(object: MsgAddAdminAmino): MsgAddAdmin {
    const message = createBaseMsgAddAdmin();
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    }
    if (object.admin !== undefined && object.admin !== null) {
      message.admin = object.admin;
    }
    return message;
  },
  toAmino(message: MsgAddAdmin): MsgAddAdminAmino {
    const obj: any = {};
    obj.creator = message.creator === "" ? undefined : message.creator;
    obj.admin = message.admin === "" ? undefined : message.admin;
    return obj;
  },
  fromAminoMsg(object: MsgAddAdminAminoMsg): MsgAddAdmin {
    return MsgAddAdmin.fromAmino(object.value);
  },
  toAminoMsg(message: MsgAddAdmin): MsgAddAdminAminoMsg {
    return {
      type: "cosmos-sdk/MsgAddAdmin",
      value: MsgAddAdmin.toAmino(message),
    };
  },
  fromProtoMsg(message: MsgAddAdminProtoMsg): MsgAddAdmin {
    return MsgAddAdmin.decode(message.value);
  },
  toProto(message: MsgAddAdmin): Uint8Array {
    return MsgAddAdmin.encode(message).finish();
  },
  toProtoMsg(message: MsgAddAdmin): MsgAddAdminProtoMsg {
    return {
      typeUrl: "/cosmos.adminmodule.adminmodule.MsgAddAdmin",
      value: MsgAddAdmin.encode(message).finish(),
    };
  },
};
function createBaseMsgAddAdminResponse(): MsgAddAdminResponse {
  return {};
}
export const MsgAddAdminResponse = {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgAddAdminResponse",
  encode(
    _: MsgAddAdminResponse,
    writer: BinaryWriter = BinaryWriter.create(),
  ): BinaryWriter {
    return writer;
  },
  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): MsgAddAdminResponse {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgAddAdminResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(_: Partial<MsgAddAdminResponse>): MsgAddAdminResponse {
    const message = createBaseMsgAddAdminResponse();
    return message;
  },
  fromAmino(_: MsgAddAdminResponseAmino): MsgAddAdminResponse {
    const message = createBaseMsgAddAdminResponse();
    return message;
  },
  toAmino(_: MsgAddAdminResponse): MsgAddAdminResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgAddAdminResponseAminoMsg): MsgAddAdminResponse {
    return MsgAddAdminResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgAddAdminResponse): MsgAddAdminResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgAddAdminResponse",
      value: MsgAddAdminResponse.toAmino(message),
    };
  },
  fromProtoMsg(message: MsgAddAdminResponseProtoMsg): MsgAddAdminResponse {
    return MsgAddAdminResponse.decode(message.value);
  },
  toProto(message: MsgAddAdminResponse): Uint8Array {
    return MsgAddAdminResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgAddAdminResponse): MsgAddAdminResponseProtoMsg {
    return {
      typeUrl: "/cosmos.adminmodule.adminmodule.MsgAddAdminResponse",
      value: MsgAddAdminResponse.encode(message).finish(),
    };
  },
};
function createBaseMsgSubmitProposalLegacy(): MsgSubmitProposalLegacy {
  return {
    content: undefined,
    proposer: "",
  };
}
export const MsgSubmitProposalLegacy = {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgSubmitProposalLegacy",
  encode(
    message: MsgSubmitProposalLegacy,
    writer: BinaryWriter = BinaryWriter.create(),
  ): BinaryWriter {
    if (message.content !== undefined) {
      Any.encode(message.content as Any, writer.uint32(10).fork()).ldelim();
    }
    if (message.proposer !== "") {
      writer.uint32(18).string(message.proposer);
    }
    return writer;
  },
  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): MsgSubmitProposalLegacy {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitProposalLegacy();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.content = Content_InterfaceDecoder(reader) as Any;
          break;
        case 2:
          message.proposer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(
    object: Partial<MsgSubmitProposalLegacy>,
  ): MsgSubmitProposalLegacy {
    const message = createBaseMsgSubmitProposalLegacy();
    message.content =
      object.content !== undefined && object.content !== null
        ? Any.fromPartial(object.content)
        : undefined;
    message.proposer = object.proposer ?? "";
    return message;
  },
  fromAmino(object: MsgSubmitProposalLegacyAmino): MsgSubmitProposalLegacy {
    const message = createBaseMsgSubmitProposalLegacy();
    if (object.content !== undefined && object.content !== null) {
      message.content = Content_FromAmino(object.content);
    }
    if (object.proposer !== undefined && object.proposer !== null) {
      message.proposer = object.proposer;
    }
    return message;
  },
  toAmino(message: MsgSubmitProposalLegacy): MsgSubmitProposalLegacyAmino {
    const obj: any = {};
    obj.content = message.content
      ? Content_ToAmino(message.content as Any)
      : undefined;
    obj.proposer = message.proposer === "" ? undefined : message.proposer;
    return obj;
  },
  fromAminoMsg(
    object: MsgSubmitProposalLegacyAminoMsg,
  ): MsgSubmitProposalLegacy {
    return MsgSubmitProposalLegacy.fromAmino(object.value);
  },
  toAminoMsg(
    message: MsgSubmitProposalLegacy,
  ): MsgSubmitProposalLegacyAminoMsg {
    return {
      type: "cosmos-sdk/MsgSubmitProposalLegacy",
      value: MsgSubmitProposalLegacy.toAmino(message),
    };
  },
  fromProtoMsg(
    message: MsgSubmitProposalLegacyProtoMsg,
  ): MsgSubmitProposalLegacy {
    return MsgSubmitProposalLegacy.decode(message.value);
  },
  toProto(message: MsgSubmitProposalLegacy): Uint8Array {
    return MsgSubmitProposalLegacy.encode(message).finish();
  },
  toProtoMsg(
    message: MsgSubmitProposalLegacy,
  ): MsgSubmitProposalLegacyProtoMsg {
    return {
      typeUrl: "/cosmos.adminmodule.adminmodule.MsgSubmitProposalLegacy",
      value: MsgSubmitProposalLegacy.encode(message).finish(),
    };
  },
};
function createBaseMsgSubmitProposalLegacyResponse(): MsgSubmitProposalLegacyResponse {
  return {
    proposalId: BigInt(0),
  };
}
export const MsgSubmitProposalLegacyResponse = {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgSubmitProposalLegacyResponse",
  encode(
    message: MsgSubmitProposalLegacyResponse,
    writer: BinaryWriter = BinaryWriter.create(),
  ): BinaryWriter {
    if (message.proposalId !== BigInt(0)) {
      writer.uint32(8).uint64(message.proposalId);
    }
    return writer;
  },
  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): MsgSubmitProposalLegacyResponse {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitProposalLegacyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.proposalId = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(
    object: Partial<MsgSubmitProposalLegacyResponse>,
  ): MsgSubmitProposalLegacyResponse {
    const message = createBaseMsgSubmitProposalLegacyResponse();
    message.proposalId =
      object.proposalId !== undefined && object.proposalId !== null
        ? BigInt(object.proposalId.toString())
        : BigInt(0);
    return message;
  },
  fromAmino(
    object: MsgSubmitProposalLegacyResponseAmino,
  ): MsgSubmitProposalLegacyResponse {
    const message = createBaseMsgSubmitProposalLegacyResponse();
    if (object.proposal_id !== undefined && object.proposal_id !== null) {
      message.proposalId = BigInt(object.proposal_id);
    }
    return message;
  },
  toAmino(
    message: MsgSubmitProposalLegacyResponse,
  ): MsgSubmitProposalLegacyResponseAmino {
    const obj: any = {};
    obj.proposal_id = message.proposalId ? message.proposalId.toString() : "0";
    return obj;
  },
  fromAminoMsg(
    object: MsgSubmitProposalLegacyResponseAminoMsg,
  ): MsgSubmitProposalLegacyResponse {
    return MsgSubmitProposalLegacyResponse.fromAmino(object.value);
  },
  toAminoMsg(
    message: MsgSubmitProposalLegacyResponse,
  ): MsgSubmitProposalLegacyResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgSubmitProposalLegacyResponse",
      value: MsgSubmitProposalLegacyResponse.toAmino(message),
    };
  },
  fromProtoMsg(
    message: MsgSubmitProposalLegacyResponseProtoMsg,
  ): MsgSubmitProposalLegacyResponse {
    return MsgSubmitProposalLegacyResponse.decode(message.value);
  },
  toProto(message: MsgSubmitProposalLegacyResponse): Uint8Array {
    return MsgSubmitProposalLegacyResponse.encode(message).finish();
  },
  toProtoMsg(
    message: MsgSubmitProposalLegacyResponse,
  ): MsgSubmitProposalLegacyResponseProtoMsg {
    return {
      typeUrl:
        "/cosmos.adminmodule.adminmodule.MsgSubmitProposalLegacyResponse",
      value: MsgSubmitProposalLegacyResponse.encode(message).finish(),
    };
  },
};
function createBaseMsgSubmitProposal(): MsgSubmitProposal {
  return {
    messages: [],
    proposer: "",
  };
}
export const MsgSubmitProposal = {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgSubmitProposal",
  encode(
    message: MsgSubmitProposal,
    writer: BinaryWriter = BinaryWriter.create(),
  ): BinaryWriter {
    for (const v of message.messages) {
      Any.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.proposer !== "") {
      writer.uint32(18).string(message.proposer);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSubmitProposal {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.messages.push(Any.decode(reader, reader.uint32()));
          break;
        case 2:
          message.proposer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgSubmitProposal>): MsgSubmitProposal {
    const message = createBaseMsgSubmitProposal();
    message.messages = object.messages?.map((e) => Any.fromPartial(e)) || [];
    message.proposer = object.proposer ?? "";
    return message;
  },
  fromAmino(object: MsgSubmitProposalAmino): MsgSubmitProposal {
    const message = createBaseMsgSubmitProposal();
    message.messages = object.messages?.map((e) => Any.fromAmino(e)) || [];
    if (object.proposer !== undefined && object.proposer !== null) {
      message.proposer = object.proposer;
    }
    return message;
  },
  toAmino(message: MsgSubmitProposal): MsgSubmitProposalAmino {
    const obj: any = {};
    if (message.messages) {
      obj.messages = message.messages.map((e) =>
        e ? Any.toAmino(e) : undefined,
      );
    } else {
      obj.messages = message.messages;
    }
    obj.proposer = message.proposer === "" ? undefined : message.proposer;
    return obj;
  },
  fromAminoMsg(object: MsgSubmitProposalAminoMsg): MsgSubmitProposal {
    return MsgSubmitProposal.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSubmitProposal): MsgSubmitProposalAminoMsg {
    return {
      type: "cosmos-sdk/MsgSubmitProposal",
      value: MsgSubmitProposal.toAmino(message),
    };
  },
  fromProtoMsg(message: MsgSubmitProposalProtoMsg): MsgSubmitProposal {
    return MsgSubmitProposal.decode(message.value);
  },
  toProto(message: MsgSubmitProposal): Uint8Array {
    return MsgSubmitProposal.encode(message).finish();
  },
  toProtoMsg(message: MsgSubmitProposal): MsgSubmitProposalProtoMsg {
    return {
      typeUrl: "/cosmos.adminmodule.adminmodule.MsgSubmitProposal",
      value: MsgSubmitProposal.encode(message).finish(),
    };
  },
};
function createBaseMsgSubmitProposalResponse(): MsgSubmitProposalResponse {
  return {
    proposalId: BigInt(0),
  };
}
export const MsgSubmitProposalResponse = {
  typeUrl: "/cosmos.adminmodule.adminmodule.MsgSubmitProposalResponse",
  encode(
    message: MsgSubmitProposalResponse,
    writer: BinaryWriter = BinaryWriter.create(),
  ): BinaryWriter {
    if (message.proposalId !== BigInt(0)) {
      writer.uint32(8).uint64(message.proposalId);
    }
    return writer;
  },
  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): MsgSubmitProposalResponse {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitProposalResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.proposalId = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(
    object: Partial<MsgSubmitProposalResponse>,
  ): MsgSubmitProposalResponse {
    const message = createBaseMsgSubmitProposalResponse();
    message.proposalId =
      object.proposalId !== undefined && object.proposalId !== null
        ? BigInt(object.proposalId.toString())
        : BigInt(0);
    return message;
  },
  fromAmino(object: MsgSubmitProposalResponseAmino): MsgSubmitProposalResponse {
    const message = createBaseMsgSubmitProposalResponse();
    if (object.proposal_id !== undefined && object.proposal_id !== null) {
      message.proposalId = BigInt(object.proposal_id);
    }
    return message;
  },
  toAmino(message: MsgSubmitProposalResponse): MsgSubmitProposalResponseAmino {
    const obj: any = {};
    obj.proposal_id = message.proposalId ? message.proposalId.toString() : "0";
    return obj;
  },
  fromAminoMsg(
    object: MsgSubmitProposalResponseAminoMsg,
  ): MsgSubmitProposalResponse {
    return MsgSubmitProposalResponse.fromAmino(object.value);
  },
  toAminoMsg(
    message: MsgSubmitProposalResponse,
  ): MsgSubmitProposalResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgSubmitProposalResponse",
      value: MsgSubmitProposalResponse.toAmino(message),
    };
  },
  fromProtoMsg(
    message: MsgSubmitProposalResponseProtoMsg,
  ): MsgSubmitProposalResponse {
    return MsgSubmitProposalResponse.decode(message.value);
  },
  toProto(message: MsgSubmitProposalResponse): Uint8Array {
    return MsgSubmitProposalResponse.encode(message).finish();
  },
  toProtoMsg(
    message: MsgSubmitProposalResponse,
  ): MsgSubmitProposalResponseProtoMsg {
    return {
      typeUrl: "/cosmos.adminmodule.adminmodule.MsgSubmitProposalResponse",
      value: MsgSubmitProposalResponse.encode(message).finish(),
    };
  },
};
export const Content_InterfaceDecoder = (
  input: BinaryReader | Uint8Array,
): Any => {
  const reader =
    input instanceof BinaryReader ? input : new BinaryReader(input);
  const data = Any.decode(reader, reader.uint32());
  switch (data.typeUrl) {
    default:
      return data;
  }
};
export const Content_FromAmino = (content: AnyAmino): Any => {
  return Any.fromAmino(content);
};
export const Content_ToAmino = (content: Any) => {
  return Any.toAmino(content);
};
