export function compareStrings<T extends string>(
  a: T,
  b: T,
  ascending: boolean,
) {
  return ascending ? a.localeCompare(b) : b.localeCompare(a);
}
export function compareNumbers<T extends number>(
  a: T,
  b: T,
  ascending: boolean,
) {
  return ascending ? a - b : b - a;
}
