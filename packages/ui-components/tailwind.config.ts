/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/*.{css}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  presets: [require("@valence-ui/config/tailwind/config")],
};

module.exports = tailwindConfig;
