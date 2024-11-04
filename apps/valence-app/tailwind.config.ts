/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/components/styles/**/*.{js,ts,jsx,tsx}", // here is path to Tailwind CSS components package
    "../../packages/components/lib/**/*.{js,ts,jsx,tsx}", // here is path to Tailwind CSS components package
  ],
  presets: [require("@valence-ui/config/tailwind/config")],
};

module.exports = tailwindConfig;
