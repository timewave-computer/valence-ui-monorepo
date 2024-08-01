import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warn: "#ff7b00",
        "valence-black": "#000000",
        "valence-white": "#FFFFFF",
        "valence-red": "#FF2A00",
        "valence-blue": "#00A3FF",
        "valence-purple": "#806780",
        "valence-pink": "#EA80D1",
        "valence-green": "#4EBB5B",
        "valence-yellow": "#FFBC57",
        "valence-brown": "#800000",
        "valence-gray": "#A0A0A0",
        "valence-mediumgray": "#C9C9C9",
        "valence-lightgray": "#E9E9E9",
        "graph-red": "#FF2A00",
        "graph-blue": "#00A3FF",
        "graph-pink": "#EA80D1",
        "graph-green": "#4EBB5B",
        "graph-orange": "#FFBC57",
        "graph-brown": "#800000",
        "graph-gray": "#BABABA",
        "graph-yellow": "#C2C600",
        "graph-purple": "#8476DE",
        "graph-teal": "#17CFCF",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["SF Pro", ...defaultTheme.fontFamily.sans],
        serif: ["Times", "Times New Roman", ...defaultTheme.fontFamily.serif],
        mono: ["SF Mono", "SFMono-Regular", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
export default config;
