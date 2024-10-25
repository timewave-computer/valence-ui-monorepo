
/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  extends: [require.resolve('@valence-ui/config/eslint')],
  ignorePatterns: ['.next', '.turbo', 'node_modules', 'out', 'next-env.d.ts'],
  root: true,
}

module.exports = eslintConfig