import { create } from "zustand";

interface GiftFinderState {
  isOpen: boolean;
  openGiftFinder: () => void;
  closeGiftFinder: () => void;
  toggleGiftFinder: () => void;
}

export const useGiftFinderStore = create<GiftFinderState>((set) => ({
  isOpen: false,
  openGiftFinder: () => set({ isOpen: true }),
  closeGiftFinder: () => set({ isOpen: false }),
  toggleGiftFinder: () => set((state) => ({ isOpen: !state.isOpen })),
}));
