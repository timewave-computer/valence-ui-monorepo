import { create } from "zustand";

interface DisplayStore {
  selectedAddresses: string[];
  selectAddresses: (addrs: string[]) => void;
}
export const useDisplayStore = create<DisplayStore>((set) => ({
  selectedAddresses: [],
  selectAddresses: (addresses) => set({ selectedAddresses: addresses }),
}));
