export const mockProgram1 = {
  workflow: {
    id: 3,
    owner: "neutron1hj5fveer5cjtn4wd6wstzugjfdxzl0xpznmsky",
    links: {
      "0": {
        input_accounts_id: [0],
        output_accounts_id: [1],
        library_id: 0,
      },
    },
    accounts: {
      "0": {
        name: "test_1",
        ty: {
          Base: {
            admin: null,
          },
        },
        domain: {
          CosmosCosmwasm: "neutron",
        },
        addr: "neutron1ecelyw9upcv20hzlx54t6hx78hls949a5th07n7d7k545ujnl6lqr0hjxn",
      },
      "1": {
        name: "test_2",
        ty: {
          Base: {
            admin: null,
          },
        },
        domain: {
          CosmosCosmwasm: "neutron",
        },
        addr: "neutron1sdehhexqcm9tppydg4w5ysdqkzkac0ekcg3473sl635vecd0qq7qkxn67r",
      },
    },
    libraries: {
      "0": {
        name: "test_splitter",
        domain: {
          CosmosCosmwasm: "neutron",
        },
        config: {
          ValenceSplitterService: {
            input_addr: {
              "|service_account_addr|":
                "neutron1ecelyw9upcv20hzlx54t6hx78hls949a5th07n7d7k545ujnl6lqr0hjxn",
            },
            splits: [
              {
                denom: {
                  native: "test",
                },
                account: {
                  "|service_account_addr|":
                    "neutron1sdehhexqcm9tppydg4w5ysdqkzkac0ekcg3473sl635vecd0qq7qkxn67r",
                },
                amount: {
                  fixed_amount: "1000000000",
                },
              },
            ],
          },
        },
        addr: "neutron1n66wet7z04p85wgh594g20yp0zm9wu3r2eqp08ga9ecqlkqwujqsmjv5yz",
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
        actions_config: {
          atomic: {
            actions: [
              {
                domain: "main",
                message_details: {
                  message_type: "cosmwasm_execute_msg",
                  message: {
                    name: "process_action",
                    params_restrictions: [
                      {
                        must_be_included: ["process_action", "split"],
                      },
                    ],
                  },
                },
                contract_address: {
                  "|service_account_addr|":
                    "neutron1n66wet7z04p85wgh594g20yp0zm9wu3r2eqp08ga9ecqlkqwujqsmjv5yz",
                },
              },
            ],
            retry_logic: null,
          },
        },
        priority: null,
        subroutine: {
          atomic: {
            functions: [],
          },
        },
      },
    ],
    authorization_data: {
      authorization_addr:
        "neutron1fu4ezg9lt9026eayu8gmdvchv2p82q0s6asehc3zemjehyfx2lps7a0545",
      processor_addrs: {
        "CosmosCosmwasm:neutron":
          "neutron1y0pj5qghutdppun0u65a934dmwfrq2seru4ehdglyqylvyt50yasgej4nd",
      },
      authorization_bridge_addrs: {},
      processor_bridge_addrs: {},
    },
  },
  error: "",
};
