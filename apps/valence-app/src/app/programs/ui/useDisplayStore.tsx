import { create } from "zustand";

interface DisplayStore {
  selected: string[];
  select: (addrs: string[]) => void;
}
export const useDisplayStore = create<DisplayStore>((set) => ({
  selected: [],
  select: (addresses) => set({ selected: addresses }),
}));
