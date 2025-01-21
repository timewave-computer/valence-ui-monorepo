// two domains, bi directional
export const mockProgram2 = {
  id: 2,
  owner: "neutron1hj5fveer5cjtn4wd6wstzugjfdxzl0xpznmsky",
  links: {
    "0": {
      input_accounts_id: [0],
      output_accounts_id: [1],
      library_id: 0,
    },
    // "1": {
    //   input_accounts_id: [1],
    //   output_accounts_id: [0],
    //   library_id: 1,
    // },
  },
  accounts: {
    "0": {
      name: "base_account_1",
      ty: {
        Addr: {
          addr: "neutron1dtueann60wu9w9eaca73h43kq0qvvl9kjxzxge84x73h2dd5pfmq0rkc4x",
        },
      },
      domain: {
        CosmosCosmwasm: "neutron",
      },
      addr: "neutron173hvzyja4447jlqkkvjdejjwlwk9eaam27q2psm3evy70f7z34pq5247np",
    },
    "1": {
      name: "base_account_2",
      ty: {
        Addr: {
          addr: "neutron1upl754g65yaj4yc98ca5vcxxw28ej3rdh73lsa9lcv7hvy9p32jsyesqzu",
        },
      },
      domain: {
        CosmosCosmwasm: "stargaze",
      },
      addr: "stars1rfk0tqnc9shwsavrhyw3kdzecstes67vtz4axv",
    },
  },
  libraries: {
    "0": {
      name: "splitter_1",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      addr: "neutron15rldvafc5ufsf34fmjegyul32dm8uvjhg3xgk48j0qrrxqd8e0ssagamfj",
    },
    "1": {
      name: "splitter_2",
      domain: {
        CosmosCosmwasm: "neutron",
      },
      addr: "neutron12e9sfu7jg28z4dg5qhzjkf50tj05d5la5uwj2auqpedx5ph2757qhe336u",
    },
  },
  authorizations: [
    {
      label: "swap",
      mode: "permissionless",
      not_before: {
        never: {},
      },
      duration: "forever",
      max_concurrent_executions: null,
      subroutine: {
        atomic: {
          functions: [
            {
              domain: "main",
              message_details: {
                message_type: "cosmwasm_execute_msg",
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "split"],
                    },
                    {
                      must_be_value: [
                        ["process_function", "split", "ratio"],
                        "0.5",
                      ],
                    },
                  ],
                },
              },
              contract_address: {
                "|library_account_addr|":
                  "neutron15rldvafc5ufsf34fmjegyul32dm8uvjhg3xgk48j0qrrxqd8e0ssagamfj",
              },
            },
            {
              domain: "main",
              message_details: {
                message_type: "cosmwasm_execute_msg",
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "split"],
                    },
                  ],
                },
              },
              contract_address: {
                "|library_account_addr|":
                  "neutron12e9sfu7jg28z4dg5qhzjkf50tj05d5la5uwj2auqpedx5ph2757qhe336u",
              },
            },
          ],
          retry_logic: null,
        },
      },
      priority: null,
    },
    {
      label: "swap-2",
      mode: "permissionless",
      not_before: {
        never: {},
      },
      duration: "forever",
      max_concurrent_executions: null,
      subroutine: {
        atomic: {
          functions: [
            {
              domain: "main",
              message_details: {
                message_type: "cosmwasm_execute_msg",
                message: {
                  name: "process_function",
                  params_restrictions: [
                    {
                      must_be_included: ["process_function", "split"],
                    },
                  ],
                },
              },
              contract_address: {
                "|library_account_addr|":
                  "neutron12e9sfu7jg28z4dg5qhzjkf50tj05d5la5uwj2auqpedx5ph2757qhe336u",
              },
            },
          ],
          retry_logic: null,
        },
      },
      priority: null,
    },
  ],
  authorization_data: {
    authorization_addr:
      "neutron15wm4kkd69kdsn5qunuugh563tjufrr8ghehu0w6l7e7gqsahnlyqsnjzjd",
    processor_addrs: {
      "CosmosCosmwasm:neutron":
        "neutron1nc0uskt3gzn4tvdmpda0xejxphgwskkkynj7t9uuxj9aaa2lksks47f4e7",
    },
    authorization_bridge_addrs: {},
    processor_bridge_addrs: {},
  },
};
