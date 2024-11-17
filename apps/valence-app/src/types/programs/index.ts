export type ProgramAccount = {
  id: string;
  domain: string;
  accountType: string;
};
export type ProgramLibrary = {
  id: string;
  domain: string;
  config: any;
};
export type ProgramLink = {
  id: string;
  service_id: string;
  input_accounts_id: string[];
  output_accounts_id: string[];
};
export type ProgramAuthorization = {
  label: string;
  mode: string;
  nbf?: number;
  max_conc_exec?: number;
  actions: any;
  prio?: string;
  state: string;
};
