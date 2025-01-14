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
        "valence-mediumred": "#FF2A00B2",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: [
          "var(--font-unica-sans)",
          "SF Pro",
          ...defaultTheme.fontFamily.sans,
        ],
        sf: ["SF Pro", ...defaultTheme.fontFamily.sans],
        serif: ["Times", "Times New Roman", ...defaultTheme.fontFamily.serif],
        mono: [
          "var(--font-unica-mono)",
          "SF Mono",
          "SFMono-Regular",
          ...defaultTheme.fontFamily.mono,
        ],
      },
      fontSize: {
        // major second (1.125x)
        h1: ["2.0275rem", { lineHeight: "2.375rem" }], // 32.44px / 38px text-5xl
        h2: ["1.8019rem", { lineHeight: "2.125rem" }], // 28.83px / 34px text-4xl
        h3: ["1.6019rem", { lineHeight: "1.875rem" }], // 25.63px / 30px text-3xl
        h4: ["1.425rem", { lineHeight: "1.75rem" }], // 22.8px / 28px text-2xl
        h5: ["1.2663rem", { lineHeight: "1.625rem" }], // 20.26px / 26px text-xl
        h6: ["1.125rem", { lineHeight: "1.5rem" }], // 18px / 24px text-lg
        base: ["1rem", { lineHeight: "1.375rem" }], // 16px / 22px text-base
        sm: ["0.9025rem", { lineHeight: "1.25rem" }], // 14.44px / 20px
        xs: ["0.8rem", { lineHeight: "1.125rem" }], // 12.8px / 18px
      },
      animation: {
        "pulse-fetching":
          "pulse-fetching 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "pulse-fetching": {
          "0%, 50%, 100%": { opacity: "1", transform: "scale(1)" },
          "25%, 75%": { opacity: "0.3", transform: "scale(0.98)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
