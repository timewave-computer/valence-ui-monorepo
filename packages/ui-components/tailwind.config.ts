/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: ["./lib/**/*.{js,ts,jsx,tsx,mdx}", "./styles/*.{css}"],

  presets: [require("@valence-ui/project-config/tailwind/config")],
};

export default tailwindConfig;
