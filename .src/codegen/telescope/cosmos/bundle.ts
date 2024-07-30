import * as _2 from "./adminmodule/adminmodule/genesis";
import * as _3 from "./adminmodule/adminmodule/query";
import * as _4 from "./adminmodule/adminmodule/tx";
import * as _5 from "./app/runtime/v1alpha1/module";
import * as _6 from "./app/v1alpha1/config";
import * as _7 from "./app/v1alpha1/module";
import * as _8 from "./app/v1alpha1/query";
import * as _9 from "./auth/module/v1/module";
import * as _10 from "./auth/v1beta1/auth";
import * as _11 from "./auth/v1beta1/genesis";
import * as _12 from "./auth/v1beta1/query";
import * as _13 from "./auth/v1beta1/tx";
import * as _14 from "./authz/module/v1/module";
import * as _15 from "./authz/v1beta1/authz";
import * as _16 from "./authz/v1beta1/event";
import * as _17 from "./authz/v1beta1/genesis";
import * as _18 from "./authz/v1beta1/query";
import * as _19 from "./authz/v1beta1/tx";
import * as _20 from "./autocli/v1/options";
import * as _21 from "./autocli/v1/query";
import * as _22 from "./bank/module/v1/module";
import * as _23 from "./bank/v1beta1/authz";
import * as _24 from "./bank/v1beta1/bank";
import * as _25 from "./bank/v1beta1/genesis";
import * as _26 from "./bank/v1beta1/query";
import * as _27 from "./bank/v1beta1/tx";
import * as _28 from "./base/abci/v1beta1/abci";
import * as _29 from "./base/node/v1beta1/query";
import * as _30 from "./base/query/v1beta1/pagination";
import * as _31 from "./base/reflection/v1beta1/reflection";
import * as _32 from "./base/reflection/v2alpha1/reflection";
import * as _33 from "./base/tendermint/v1beta1/query";
import * as _34 from "./base/tendermint/v1beta1/types";
import * as _35 from "./base/v1beta1/coin";
import * as _36 from "./circuit/module/v1/module";
import * as _37 from "./circuit/v1/query";
import * as _38 from "./circuit/v1/tx";
import * as _39 from "./circuit/v1/types";
import * as _40 from "./consensus/module/v1/module";
import * as _41 from "./consensus/v1/query";
import * as _42 from "./consensus/v1/tx";
import * as _43 from "./crisis/module/v1/module";
import * as _44 from "./crisis/v1beta1/genesis";
import * as _45 from "./crisis/v1beta1/tx";
import * as _46 from "./crypto/ed25519/keys";
import * as _47 from "./crypto/hd/v1/hd";
import * as _48 from "./crypto/keyring/v1/record";
import * as _49 from "./crypto/multisig/keys";
import * as _50 from "./crypto/secp256k1/keys";
import * as _51 from "./crypto/secp256r1/keys";
import * as _52 from "./distribution/module/v1/module";
import * as _53 from "./distribution/v1beta1/distribution";
import * as _54 from "./distribution/v1beta1/genesis";
import * as _55 from "./distribution/v1beta1/query";
import * as _56 from "./distribution/v1beta1/tx";
import * as _57 from "./evidence/module/v1/module";
import * as _58 from "./evidence/v1beta1/evidence";
import * as _59 from "./evidence/v1beta1/genesis";
import * as _60 from "./evidence/v1beta1/query";
import * as _61 from "./evidence/v1beta1/tx";
import * as _62 from "./feegrant/module/v1/module";
import * as _63 from "./feegrant/v1beta1/feegrant";
import * as _64 from "./feegrant/v1beta1/genesis";
import * as _65 from "./feegrant/v1beta1/query";
import * as _66 from "./feegrant/v1beta1/tx";
import * as _67 from "./genutil/module/v1/module";
import * as _68 from "./genutil/v1beta1/genesis";
import * as _69 from "./gov/module/v1/module";
import * as _70 from "./gov/v1/genesis";
import * as _71 from "./gov/v1/gov";
import * as _72 from "./gov/v1/query";
import * as _73 from "./gov/v1/tx";
import * as _74 from "./gov/v1beta1/genesis";
import * as _75 from "./gov/v1beta1/gov";
import * as _76 from "./gov/v1beta1/query";
import * as _77 from "./gov/v1beta1/tx";
import * as _78 from "./group/module/v1/module";
import * as _79 from "./group/v1/events";
import * as _80 from "./group/v1/genesis";
import * as _81 from "./group/v1/query";
import * as _82 from "./group/v1/tx";
import * as _83 from "./group/v1/types";
import * as _84 from "./ics23/v1/proofs";
import * as _85 from "./mint/module/v1/module";
import * as _86 from "./mint/v1beta1/genesis";
import * as _87 from "./mint/v1beta1/mint";
import * as _88 from "./mint/v1beta1/query";
import * as _89 from "./mint/v1beta1/tx";
import * as _90 from "./msg/textual/v1/textual";
import * as _91 from "./msg/v1/msg";
import * as _92 from "./nft/module/v1/module";
import * as _93 from "./nft/v1beta1/event";
import * as _94 from "./nft/v1beta1/genesis";
import * as _95 from "./nft/v1beta1/nft";
import * as _96 from "./nft/v1beta1/query";
import * as _97 from "./nft/v1beta1/tx";
import * as _98 from "./orm/module/v1alpha1/module";
import * as _99 from "./orm/query/v1alpha1/query";
import * as _100 from "./orm/v1/orm";
import * as _101 from "./orm/v1alpha1/schema";
import * as _102 from "./params/module/v1/module";
import * as _103 from "./params/v1beta1/params";
import * as _104 from "./params/v1beta1/query";
import * as _105 from "./query/v1/query";
import * as _106 from "./reflection/v1/reflection";
import * as _107 from "./slashing/module/v1/module";
import * as _108 from "./slashing/v1beta1/genesis";
import * as _109 from "./slashing/v1beta1/query";
import * as _110 from "./slashing/v1beta1/slashing";
import * as _111 from "./slashing/v1beta1/tx";
import * as _112 from "./staking/module/v1/module";
import * as _113 from "./staking/v1beta1/authz";
import * as _114 from "./staking/v1beta1/genesis";
import * as _115 from "./staking/v1beta1/query";
import * as _116 from "./staking/v1beta1/staking";
import * as _117 from "./staking/v1beta1/tx";
import * as _118 from "./store/internal/kv/v1beta1/kv";
import * as _119 from "./store/snapshots/v1/snapshot";
import * as _120 from "./store/streaming/abci/grpc";
import * as _121 from "./store/v1beta1/commit_info";
import * as _122 from "./store/v1beta1/listening";
import * as _123 from "./tx/config/v1/config";
import * as _124 from "./tx/signing/v1beta1/signing";
import * as _125 from "./tx/v1beta1/service";
import * as _126 from "./tx/v1beta1/tx";
import * as _127 from "./upgrade/module/v1/module";
import * as _128 from "./upgrade/v1beta1/query";
import * as _129 from "./upgrade/v1beta1/tx";
import * as _130 from "./upgrade/v1beta1/upgrade";
import * as _131 from "./vesting/module/v1/module";
import * as _132 from "./vesting/v1beta1/tx";
import * as _133 from "./vesting/v1beta1/vesting";
import * as _165 from "./adminmodule/adminmodule/tx.amino";
import * as _166 from "./auth/v1beta1/tx.amino";
import * as _167 from "./authz/v1beta1/tx.amino";
import * as _168 from "./bank/v1beta1/tx.amino";
import * as _169 from "./circuit/v1/tx.amino";
import * as _170 from "./consensus/v1/tx.amino";
import * as _171 from "./crisis/v1beta1/tx.amino";
import * as _172 from "./distribution/v1beta1/tx.amino";
import * as _173 from "./evidence/v1beta1/tx.amino";
import * as _174 from "./feegrant/v1beta1/tx.amino";
import * as _175 from "./gov/v1/tx.amino";
import * as _176 from "./gov/v1beta1/tx.amino";
import * as _177 from "./group/v1/tx.amino";
import * as _178 from "./mint/v1beta1/tx.amino";
import * as _179 from "./nft/v1beta1/tx.amino";
import * as _180 from "./slashing/v1beta1/tx.amino";
import * as _181 from "./staking/v1beta1/tx.amino";
import * as _182 from "./upgrade/v1beta1/tx.amino";
import * as _183 from "./vesting/v1beta1/tx.amino";
import * as _184 from "./adminmodule/adminmodule/tx.registry";
import * as _185 from "./auth/v1beta1/tx.registry";
import * as _186 from "./authz/v1beta1/tx.registry";
import * as _187 from "./bank/v1beta1/tx.registry";
import * as _188 from "./circuit/v1/tx.registry";
import * as _189 from "./consensus/v1/tx.registry";
import * as _190 from "./crisis/v1beta1/tx.registry";
import * as _191 from "./distribution/v1beta1/tx.registry";
import * as _192 from "./evidence/v1beta1/tx.registry";
import * as _193 from "./feegrant/v1beta1/tx.registry";
import * as _194 from "./gov/v1/tx.registry";
import * as _195 from "./gov/v1beta1/tx.registry";
import * as _196 from "./group/v1/tx.registry";
import * as _197 from "./mint/v1beta1/tx.registry";
import * as _198 from "./nft/v1beta1/tx.registry";
import * as _199 from "./slashing/v1beta1/tx.registry";
import * as _200 from "./staking/v1beta1/tx.registry";
import * as _201 from "./upgrade/v1beta1/tx.registry";
import * as _202 from "./vesting/v1beta1/tx.registry";
export namespace cosmos {
  export namespace adminmodule {
    export const adminmodule = {
      ..._2,
      ..._3,
      ..._4,
      ..._165,
      ..._184,
    };
  }
  export namespace app {
    export namespace runtime {
      export const v1alpha1 = {
        ..._5,
      };
    }
    export const v1alpha1 = {
      ..._6,
      ..._7,
      ..._8,
    };
  }
  export namespace auth {
    export namespace module {
      export const v1 = {
        ..._9,
      };
    }
    export const v1beta1 = {
      ..._10,
      ..._11,
      ..._12,
      ..._13,
      ..._166,
      ..._185,
    };
  }
  export namespace authz {
    export namespace module {
      export const v1 = {
        ..._14,
      };
    }
    export const v1beta1 = {
      ..._15,
      ..._16,
      ..._17,
      ..._18,
      ..._19,
      ..._167,
      ..._186,
    };
  }
  export namespace autocli {
    export const v1 = {
      ..._20,
      ..._21,
    };
  }
  export namespace bank {
    export namespace module {
      export const v1 = {
        ..._22,
      };
    }
    export const v1beta1 = {
      ..._23,
      ..._24,
      ..._25,
      ..._26,
      ..._27,
      ..._168,
      ..._187,
    };
  }
  export namespace base {
    export namespace abci {
      export const v1beta1 = {
        ..._28,
      };
    }
    export namespace node {
      export const v1beta1 = {
        ..._29,
      };
    }
    export namespace query {
      export const v1beta1 = {
        ..._30,
      };
    }
    export namespace reflection {
      export const v1beta1 = {
        ..._31,
      };
      export const v2alpha1 = {
        ..._32,
      };
    }
    export namespace tendermint {
      export const v1beta1 = {
        ..._33,
        ..._34,
      };
    }
    export const v1beta1 = {
      ..._35,
    };
  }
  export namespace circuit {
    export namespace module {
      export const v1 = {
        ..._36,
      };
    }
    export const v1 = {
      ..._37,
      ..._38,
      ..._39,
      ..._169,
      ..._188,
    };
  }
  export namespace consensus {
    export namespace module {
      export const v1 = {
        ..._40,
      };
    }
    export const v1 = {
      ..._41,
      ..._42,
      ..._170,
      ..._189,
    };
  }
  export namespace crisis {
    export namespace module {
      export const v1 = {
        ..._43,
      };
    }
    export const v1beta1 = {
      ..._44,
      ..._45,
      ..._171,
      ..._190,
    };
  }
  export namespace crypto {
    export const ed25519 = {
      ..._46,
    };
    export namespace hd {
      export const v1 = {
        ..._47,
      };
    }
    export namespace keyring {
      export const v1 = {
        ..._48,
      };
    }
    export const multisig = {
      ..._49,
    };
    export const secp256k1 = {
      ..._50,
    };
    export const secp256r1 = {
      ..._51,
    };
  }
  export namespace distribution {
    export namespace module {
      export const v1 = {
        ..._52,
      };
    }
    export const v1beta1 = {
      ..._53,
      ..._54,
      ..._55,
      ..._56,
      ..._172,
      ..._191,
    };
  }
  export namespace evidence {
    export namespace module {
      export const v1 = {
        ..._57,
      };
    }
    export const v1beta1 = {
      ..._58,
      ..._59,
      ..._60,
      ..._61,
      ..._173,
      ..._192,
    };
  }
  export namespace feegrant {
    export namespace module {
      export const v1 = {
        ..._62,
      };
    }
    export const v1beta1 = {
      ..._63,
      ..._64,
      ..._65,
      ..._66,
      ..._174,
      ..._193,
    };
  }
  export namespace genutil {
    export namespace module {
      export const v1 = {
        ..._67,
      };
    }
    export const v1beta1 = {
      ..._68,
    };
  }
  export namespace gov {
    export namespace module {
      export const v1 = {
        ..._69,
      };
    }
    export const v1 = {
      ..._70,
      ..._71,
      ..._72,
      ..._73,
      ..._175,
      ..._194,
    };
    export const v1beta1 = {
      ..._74,
      ..._75,
      ..._76,
      ..._77,
      ..._176,
      ..._195,
    };
  }
  export namespace group {
    export namespace module {
      export const v1 = {
        ..._78,
      };
    }
    export const v1 = {
      ..._79,
      ..._80,
      ..._81,
      ..._82,
      ..._83,
      ..._177,
      ..._196,
    };
  }
  export namespace ics23 {
    export const v1 = {
      ..._84,
    };
  }
  export namespace mint {
    export namespace module {
      export const v1 = {
        ..._85,
      };
    }
    export const v1beta1 = {
      ..._86,
      ..._87,
      ..._88,
      ..._89,
      ..._178,
      ..._197,
    };
  }
  export namespace msg {
    export namespace textual {
      export const v1 = {
        ..._90,
      };
    }
    export const v1 = {
      ..._91,
    };
  }
  export namespace nft {
    export namespace module {
      export const v1 = {
        ..._92,
      };
    }
    export const v1beta1 = {
      ..._93,
      ..._94,
      ..._95,
      ..._96,
      ..._97,
      ..._179,
      ..._198,
    };
  }
  export namespace orm {
    export namespace module {
      export const v1alpha1 = {
        ..._98,
      };
    }
    export namespace query {
      export const v1alpha1 = {
        ..._99,
      };
    }
    export const v1 = {
      ..._100,
    };
    export const v1alpha1 = {
      ..._101,
    };
  }
  export namespace params {
    export namespace module {
      export const v1 = {
        ..._102,
      };
    }
    export const v1beta1 = {
      ..._103,
      ..._104,
    };
  }
  export namespace query {
    export const v1 = {
      ..._105,
    };
  }
  export namespace reflection {
    export const v1 = {
      ..._106,
    };
  }
  export namespace slashing {
    export namespace module {
      export const v1 = {
        ..._107,
      };
    }
    export const v1beta1 = {
      ..._108,
      ..._109,
      ..._110,
      ..._111,
      ..._180,
      ..._199,
    };
  }
  export namespace staking {
    export namespace module {
      export const v1 = {
        ..._112,
      };
    }
    export const v1beta1 = {
      ..._113,
      ..._114,
      ..._115,
      ..._116,
      ..._117,
      ..._181,
      ..._200,
    };
  }
  export namespace store {
    export namespace internal {
      export namespace kv {
        export const v1beta1 = {
          ..._118,
        };
      }
    }
    export namespace snapshots {
      export const v1 = {
        ..._119,
      };
    }
    export namespace streaming {
      export const abci = {
        ..._120,
      };
    }
    export const v1beta1 = {
      ..._121,
      ..._122,
    };
  }
  export namespace tx {
    export namespace config {
      export const v1 = {
        ..._123,
      };
    }
    export namespace signing {
      export const v1beta1 = {
        ..._124,
      };
    }
    export const v1beta1 = {
      ..._125,
      ..._126,
    };
  }
  export namespace upgrade {
    export namespace module {
      export const v1 = {
        ..._127,
      };
    }
    export const v1beta1 = {
      ..._128,
      ..._129,
      ..._130,
      ..._182,
      ..._201,
    };
  }
  export namespace vesting {
    export namespace module {
      export const v1 = {
        ..._131,
      };
    }
    export const v1beta1 = {
      ..._132,
      ..._133,
      ..._183,
      ..._202,
    };
  }
}
