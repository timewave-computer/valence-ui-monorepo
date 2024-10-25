"use strict";
/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: ["./lib/**/*.{js,ts,jsx,tsx,mdx}", "./styles/*.{css}"],
  presets: [require("@valence-ui/config/tailwind/config")],
};
module.exports = tailwindConfig;
