export let DEFAULT_ACCOUNT = "";
if (process.env.NODE_ENV === "development") {
  DEFAULT_ACCOUNT = process.env.NEXT_PUBLIC_DEFAULT_ACCT ?? "";
}
