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
        "valence-gray": "#D6D6D6",
        "valence-red": "#FF2A00",
        "valence-blue": "#00A3FF",
        "valence-purple": "#806780",
        "valence-bg-gray": "#E9E9E9",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["SF Pro", ...defaultTheme.fontFamily.sans],
        serif: ["Times", ...defaultTheme.fontFamily.serif],
        mono: ["SF Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
export default config;
