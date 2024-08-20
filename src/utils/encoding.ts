import { toBase64, toUtf8 } from "@cosmjs/encoding";

/**
 * Encode stringified, utf8 encoded JSON to base64 string
 */
export const jsonToBase64 = (object: { [key: string]: any }) =>
  toBase64(jsonToUtf8(object));

/**
 *
 * covert json to string and encode to utf8
 */
export const jsonToUtf8 = (object: { [key: string]: any }) =>
  toUtf8(JSON.stringify(object));

/***
 * Convert number to uint128 string
 */
export const numberToUint128 = (num: number): string => {
  return BigInt(num).toString();
};
