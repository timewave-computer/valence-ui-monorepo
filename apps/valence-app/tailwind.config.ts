/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: [
    "./src/{components,app}/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui-components/**/*.{js,ts,jsx,tsx}", // here is path to Tailwind CSS components package,
    "!../../packages/ui-components/node_modules/**/*", // Exclude node_modules in ui-components
  ],
  presets: [require("@valence-ui/config/tailwind/config")],
};

module.exports = tailwindConfig;
