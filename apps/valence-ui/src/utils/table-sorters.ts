export function compareStrings<T extends string>(
  a: T,
  b: T,
  ascending: boolean,
) {
  return ascending ? a.localeCompare(b) : b.localeCompare(a);
}
export function compareNumbers<T extends number | string>(
  _a: T,
  _b: T,
  ascending: boolean,
) {
  const a = Number(_a);
  const b = Number(_b);
  return ascending ? a - b : b - a;
}
