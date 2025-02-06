import localFont from "@next/font/local";

export const Unica77Mono = localFont({
  variable: "--font-unica-mono",
  src: [
    {
      path: "./public/fonts/Unica77Mono/Unica77MonoLLWeb-Light.woff2",
      weight: "300", // font-light
    },
    {
      path: "./public/fonts/Unica77Mono/Unica77MonoLLWeb-Regular.woff2",
      weight: "400", // font-normal
    },
    {
      path: "./public/fonts/Unica77Mono/Unica77MonoLLWeb-Bold.woff2",
      weight: "700", // font-bold
    },
  ],
});

export const Unica77 = localFont({
  variable: "--font-unica-sans",
  src: [
    {
      path: "./public/fonts/Unica77/Unica77LLWeb-Light.woff2",
      weight: "300", // font-light
    },
    {
      path: "./public/fonts/Unica77/Unica77LLWeb-Regular.woff2",
      weight: "400", // font-normal
    },
    {
      path: "./public/fonts/Unica77/Unica77LLWeb-Italic.woff2",
      weight: "400", // font-normal
      style: "italic",
    },
    {
      path: "./public/fonts/Unica77/Unica77LLWeb-Medium.woff2",
      weight: "500", // font-medium
    },
    {
      path: "./public/fonts/Unica77/Unica77LLWeb-Bold.woff2",
      weight: "600", // font-semibold
    },
    {
      path: "./public/fonts/Unica77/Unica77LLWeb-Black.woff2",
      weight: "700", // font-bold
    },
  ],
});
