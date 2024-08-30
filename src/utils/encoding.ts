import { fromUtf8, toBase64, toUtf8, fromBase64 } from "@cosmjs/encoding";

/**
 * Encode stringified, utf8 encoded JSON to base64 string
 */
export const jsonToBase64 = (object: { [key: string]: any }) =>
  toBase64(jsonToUtf8(object));

/**
 * Decode base64 string to utf8 encoded JSON and parse to object
 */
export const base64ToJson = (base64String: string): { [key: string]: any } =>
  utf8ToJson(fromBase64(base64String));

/**
 *
 * covert json to string and encode to utf8
 */
export const jsonToUtf8 = (object: { [key: string]: any }) =>
  toUtf8(JSON.stringify(object));

/**
 *
 * decode utf8 to string and parse to json
 */
export const utf8ToJson = (utf8String: Uint8Array): { [key: string]: any } =>
  JSON.parse(fromUtf8(utf8String));

/***
 * Convert number to uint128 string
 */
export const numberToUint128 = (num: number): string => {
  return BigInt(num).toString();
};
