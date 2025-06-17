import { type ProgramParserResult } from "@/app/programs/server";

export const program1: ProgramParserResult = {
  owner: "",
  name: "wbtc-test1",
  domains: {
    main: "neutron",
    external: [],
  },
  authorizations: [
    {
      duration: "forever",
      label: "program_fund",
      max_concurrent_executions: null,
      mode: {
        permissioned: {
          without_call_limit: [
            "neutron14fmxw54lgvheyn7m0p9efpr82fac68ysph96ch",
          ],
        },
      },
      not_before: {
        never: {},
      },
      priority: null,
      subroutine: {
        atomic: {
          functions: [
            {
              contract_address: {
                "|library_account_addr|":
                  "neutron1f2q6ls0sep3lr8mu78xc94vj856rnmsgvxs7ttu0sdq4j93uwqusxtrv0m",
              },
              domain: "main",
              message_details: {
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "split"],
                    },
                  ],
                },
                message_type: "cosmwasm_execute_msg",
              },
            },
          ],
          retry_logic: null,
        },
      },
    },
    {
      duration: "forever",
      label: "neutron_refund",
      max_concurrent_executions: null,
      mode: {
        permissioned: {
          without_call_limit: [
            "neutron14fmxw54lgvheyn7m0p9efpr82fac68ysph96ch",
          ],
        },
      },
      not_before: {
        never: {},
      },
      priority: null,
      subroutine: {
        atomic: {
          functions: [
            {
              contract_address: {
                "|library_account_addr|":
                  "neutron1889klly6ar2tztynraywlvgv2k8p06x5yvtfe6rpymec4wjysvsqsrys0m",
              },
              domain: "main",
              message_details: {
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "forward"],
                    },
                  ],
                },
                message_type: "cosmwasm_execute_msg",
              },
            },
            {
              contract_address: {
                "|library_account_addr|":
                  "neutron1cu6qmj57yfw6czphqmgrzt8r056gff854m3mjas0nfk7hpxrf90syhvqvn",
              },
              domain: "main",
              message_details: {
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "forward"],
                    },
                  ],
                },
                message_type: "cosmwasm_execute_msg",
              },
            },
            {
              contract_address: {
                "|library_account_addr|":
                  "neutron1hcg5myama77gtnv39euhmj38drqdnmqzedv0dm6ajxf4z5r0nzzs3vdvnh",
              },
              domain: "main",
              message_details: {
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "forward"],
                    },
                  ],
                },
                message_type: "cosmwasm_execute_msg",
              },
            },
            {
              contract_address: {
                "|library_account_addr|":
                  "neutron1t04pvrra43kcls535afx06ts0uxefygk98pzth89wp3klunmzhrsfpxejc",
              },
              domain: "main",
              message_details: {
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "forward"],
                    },
                  ],
                },
                message_type: "cosmwasm_execute_msg",
              },
            },
            {
              contract_address: {
                "|library_account_addr|":
                  "neutron1v4gvjfzcnu39e97yhjw8uvcz3320xjse0yla304c3hdhd77cv27qlylk4f",
              },
              domain: "main",
              message_details: {
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "forward"],
                    },
                  ],
                },
                message_type: "cosmwasm_execute_msg",
              },
            },
            {
              contract_address: {
                "|library_account_addr|":
                  "neutron1luqmsxecx77zjj4kgrczfw6m3nnv0vj4elf6sz0qp4xqmcap5mqqc2pvce",
              },
              domain: "main",
              message_details: {
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "forward"],
                    },
                  ],
                },
                message_type: "cosmwasm_execute_msg",
              },
            },
          ],
          retry_logic: null,
        },
      },
    },
    {
      duration: "forever",
      label: "neutron_deploy",
      max_concurrent_executions: null,
      mode: {
        permissioned: {
          without_call_limit: [
            "neutron14fmxw54lgvheyn7m0p9efpr82fac68ysph96ch",
          ],
        },
      },
      not_before: {
        never: {},
      },
      priority: null,
      subroutine: {
        atomic: {
          functions: [
            {
              contract_address: {
                "|library_account_addr|":
                  "neutron12jdq3juj983em0malenh3c3tx6scp5snsy4wdv85dyk7prr0lz5qv9vvy5",
              },
              domain: "main",
              message_details: {
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: [
                        "process_function",
                        "provide_double_sided_liquidity",
                      ],
                    },
                  ],
                },
                message_type: "cosmwasm_execute_msg",
              },
            },
            {
              contract_address: {
                "|library_account_addr|":
                  "neutron126d62t8ru5rsqqez4v9zz40z9t8m9zcft547rtn7ws87v6aq9n0qkd86hr",
              },
              domain: "main",
              message_details: {
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "lend"],
                    },
                  ],
                },
                message_type: "cosmwasm_execute_msg",
              },
            },
          ],
          retry_logic: null,
        },
      },
    },
    {
      duration: "forever",
      label: "neutron_withdraw",
      max_concurrent_executions: null,
      mode: {
        permissioned: {
          without_call_limit: [
            "neutron14fmxw54lgvheyn7m0p9efpr82fac68ysph96ch",
          ],
        },
      },
      not_before: {
        never: {},
      },
      priority: null,
      subroutine: {
        atomic: {
          functions: [
            {
              contract_address: {
                "|library_account_addr|":
                  "neutron14quslyppcmqehz0es6zxqgdhtdeemhzpseqgk80qqxk3nqt5sjzqszvhg5",
              },
              domain: "main",
              message_details: {
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: [
                        "process_function",
                        "withdraw_liquidity",
                      ],
                    },
                  ],
                },
                message_type: "cosmwasm_execute_msg",
              },
            },
            {
              contract_address: {
                "|library_account_addr|":
                  "neutron126d62t8ru5rsqqez4v9zz40z9t8m9zcft547rtn7ws87v6aq9n0qkd86hr",
              },
              domain: "main",
              message_details: {
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "withdraw"],
                    },
                  ],
                },
                message_type: "cosmwasm_execute_msg",
              },
            },
          ],
          retry_logic: null,
        },
      },
    },
  ],
  authorizationData: {
    authorization_addr:
      "neutron1089mlldjs40j8eadkplgeenmza4hn0l7cedhydtzq92mdvqeq8ysa5nle3",
    authorization_bridge_addrs: {},
    processor_addrs: {
      "CosmosCosmwasm:neutron":
        "neutron1fpey074mamxwumwgqu553up9nwgylss22u3gv75wu784zf47u9tq6n4n7g",
    },
    processor_bridge_addrs: [],
    processorData: {
      "CosmosCosmwasm:neutron": {
        address:
          "neutron1fpey074mamxwumwgqu553up9nwgylss22u3gv75wu784zf47u9tq6n4n7g",
        chainId: "neutron-1",
        chainName: "neutron",
        domainName: "neutron",
      },
    },
  },
  accounts: {
    "0": {
      addr: "neutron15austl00gd4qge0wqg5dxj4ytfyv9g6qkawh56gsd29tq47mq5qsrczrnr",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "ica",
      ty: {
        Addr: {
          addr: "neutron15austl00gd4qge0wqg5dxj4ytfyv9g6qkawh56gsd29tq47mq5qsrczrnr",
        },
      },
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "1": {
      addr: "neutron10z97we07usrynzyyfpn66dh6lprrz008hyqd30qjyvhz06nsw8ssfnccv8",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "deposit",
      ty: {
        Addr: {
          addr: "neutron10z97we07usrynzyyfpn66dh6lprrz008hyqd30qjyvhz06nsw8ssfnccv8",
        },
      },
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "2": {
      addr: "neutron1mzavmh8sh8h93sw6vj5hm0pcy7jx07vyqyyfjddktdw3z2shu9cqk0dcju",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "mars_deposit",
      ty: {
        Addr: {
          addr: "neutron1mzavmh8sh8h93sw6vj5hm0pcy7jx07vyqyyfjddktdw3z2shu9cqk0dcju",
        },
      },
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "3": {
      addr: "neutron1ufk92az9gcl0rz5e77a2ffgv7vamc247z05jdjfcf0cfjvvrh69qxyuemt",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "supervault_deposit",
      ty: {
        Addr: {
          addr: "neutron1ufk92az9gcl0rz5e77a2ffgv7vamc247z05jdjfcf0cfjvvrh69qxyuemt",
        },
      },
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "4": {
      addr: "neutron1c3trlqmfrqz6dlhprh32djmjy0rugrzdpd260w2lfntw7vezw08qm999v6",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "settlement_deposit",
      ty: {
        Addr: {
          addr: "neutron1c3trlqmfrqz6dlhprh32djmjy0rugrzdpd260w2lfntw7vezw08qm999v6",
        },
      },
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
  },
  libraries: {
    "0": {
      addr: "neutron1f2q6ls0sep3lr8mu78xc94vj856rnmsgvxs7ttu0sdq4j93uwqusxtrv0m",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "splitter",
      config: "None",
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "1": {
      addr: "neutron1889klly6ar2tztynraywlvgv2k8p06x5yvtfe6rpymec4wjysvsqsrys0m",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "test_astroport_atom_datom_ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9_forwarder",
      config: "None",
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "2": {
      addr: "neutron1cu6qmj57yfw6czphqmgrzt8r056gff854m3mjas0nfk7hpxrf90syhvqvn",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "test_astroport_atom_datom_factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom_forwarder",
      config: "None",
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "3": {
      addr: "neutron1hcg5myama77gtnv39euhmj38drqdnmqzedv0dm6ajxf4z5r0nzzs3vdvnh",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "test_mars_atom_ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9_forwarder",
      config: "None",
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "4": {
      addr: "neutron1t04pvrra43kcls535afx06ts0uxefygk98pzth89wp3klunmzhrsfpxejc",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "input_acc_refund_ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9_forwarder",
      config: "None",
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "5": {
      addr: "neutron1v4gvjfzcnu39e97yhjw8uvcz3320xjse0yla304c3hdhd77cv27qlylk4f",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "input_acc_refund_factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom_forwarder",
      config: "None",
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "6": {
      addr: "neutron1luqmsxecx77zjj4kgrczfw6m3nnv0vj4elf6sz0qp4xqmcap5mqqc2pvce",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "input_acc_refund_untrn_forwarder",
      config: "None",
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "7": {
      addr: "neutron12jdq3juj983em0malenh3c3tx6scp5snsy4wdv85dyk7prr0lz5qv9vvy5",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "test_astroport_atom_datom_lper",
      config: "None",
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "8": {
      addr: "neutron14quslyppcmqehz0es6zxqgdhtdeemhzpseqgk80qqxk3nqt5sjzqszvhg5",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "test_astroport_atom_datom_withdraw",
      config: "None",
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
    "9": {
      addr: "neutron126d62t8ru5rsqqez4v9zz40z9t8m9zcft547rtn7ws87v6aq9n0qkd86hr",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      name: "test_mars_atom_lper",
      config: "None",
      chainId: "neutron-1",
      chainName: "neutron",
      domainName: "neutron",
    },
  },
  links: {},
};
