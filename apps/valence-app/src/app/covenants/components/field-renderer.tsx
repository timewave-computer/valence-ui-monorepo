import { ReactNode } from "react";

export const AFieldRenderer = ({ children }: { children: ReactNode }) => (
  <span className="rounded-sm bg-valence-red p-0.5 text-valence-white">
    {children}
  </span>
);

export const BFieldRenderer = ({ children }: { children: ReactNode }) => (
  <span className="rounded-sm bg-valence-blue p-0.5 text-valence-white">
    {children}
  </span>
);

export const BothFieldRenderer = ({ children }: { children: ReactNode }) => (
  <span className="rounded-sm bg-valence-purple p-0.5 text-valence-white">
    {children}
  </span>
);
