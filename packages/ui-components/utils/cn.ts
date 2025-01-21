import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge<"text">({
  extend: {
    classGroups: {
      text: [
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h1",
        "text-h2",
        "text-h3",
        "text-body",
        "text-sm",
        "text-xs",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
