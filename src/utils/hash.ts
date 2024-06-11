export function fnv1aHash(str: string) {
  let hash = BigInt(2166136261);
  for (let i = 0; i < str.length; i++) {
    hash ^= BigInt(str.charCodeAt(i));
    hash *= BigInt(16777619);
  }
  return hash;
}
