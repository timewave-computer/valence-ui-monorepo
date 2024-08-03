/* tslint:disable */
/* eslint-disable */
/**
 * @param {any} input
 * @returns {any}
 */
export function do_pid(input: {
  pid: {
    p: number;
    i: number;
    d: number;
  };
  input: string;
  target: string;
  dt: string; // always 1, change in time.
  last_i: string;
  last_input: string;
}): any;

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly do_pid: (a: number) => number;
  readonly interface_version_8: () => void;
  readonly allocate: (a: number) => number;
  readonly deallocate: (a: number) => void;
  readonly requires_stargate: () => void;
  readonly requires_iterator: () => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {SyncInitInput} module
 *
 * @returns {InitOutput}
 */
export function initSync(module: SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?: InitInput | Promise<InitInput>,
): Promise<InitOutput>;
