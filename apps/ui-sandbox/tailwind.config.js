/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui-components/**/*.{js,ts,jsx,tsx}", // here is path to Tailwind CSS components package,
    "!../../packages/ui-components/node_modules/**/*", // Exclude node_modules in ui-components,
  ],
  presets: [require("@valence-ui/project-config/tailwind/config")],
  theme: {
    extend: {},
  },
  plugins: [],
};
