//@ts-nocheck
/* eslint-disable */
import * as _134 from "./tokenfactory/v1beta1/authorityMetadata";
import * as _135 from "./tokenfactory/v1beta1/genesis";
import * as _136 from "./tokenfactory/v1beta1/params";
import * as _137 from "./tokenfactory/v1beta1/query";
import * as _138 from "./tokenfactory/v1beta1/tx";
import * as _139 from "./wasm/v1/authz";
import * as _140 from "./wasm/v1/genesis";
import * as _141 from "./wasm/v1/ibc";
import * as _142 from "./wasm/v1/proposal";
import * as _143 from "./wasm/v1/query";
import * as _144 from "./wasm/v1/tx";
import * as _145 from "./wasm/v1/types";
import * as _203 from "./tokenfactory/v1beta1/tx.amino";
import * as _204 from "./wasm/v1/tx.amino";
import * as _205 from "./tokenfactory/v1beta1/tx.registry";
import * as _206 from "./wasm/v1/tx.registry";
export namespace cosmwasm {
  export namespace tokenfactory {
    export const v1beta1 = {
      ..._134,
      ..._135,
      ..._136,
      ..._137,
      ..._138,
      ..._203,
      ..._205,
    };
  }
  export namespace wasm {
    export const v1 = {
      ..._139,
      ..._140,
      ..._141,
      ..._142,
      ..._143,
      ..._144,
      ..._145,
      ..._204,
      ..._206,
    };
  }
}
