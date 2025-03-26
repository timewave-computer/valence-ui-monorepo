/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui-components/**/*.{js,ts,jsx,tsx}", // here is path to Tailwind CSS components package,
    "!../../packages/ui-components/node_modules/**/*", // Exclude node_modules in ui-components
  ],
  presets: [require("@valence-ui/project-config/tailwind/config")],
};

module.exports = tailwindConfig;
