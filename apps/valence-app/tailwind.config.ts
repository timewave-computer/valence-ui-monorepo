/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [require("@valence-ui/config/tailwind/config")],
};

module.exports = tailwindConfig;
