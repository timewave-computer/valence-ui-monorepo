/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  extends: [
    "next/core-web-vitals",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "turbo",
  ],
};

export default eslintConfig;
