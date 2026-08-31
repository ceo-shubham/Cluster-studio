import { create } from "zustand";
import { Product } from "@/types";

interface WishlistStore {
  items: Product[];
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: () => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: () => number;
  clearWishlist: () => void;
}

const STORAGE_KEY = "cs-wishlist-v1";

export const useWishlistStore = create<WishlistStore>((set, get) => {
  // Initialize from localStorage if in browser
  let initialItems: Product[] = [];
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        initialItems = JSON.parse(saved);
      }
    } catch {
      initialItems = [];
    }
  }

  const persist = (items: Product[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore storage error
      }
    }
  };

  return {
    items: initialItems,
    isOpen: false,
    openWishlist: () => set({ isOpen: true }),
    closeWishlist: () => set({ isOpen: false }),
    toggleWishlist: () => set((state) => ({ isOpen: !state.isOpen })),

    addItem: (product: Product) => {
      const exists = get().items.some((i) => i.id === product.id);
      if (!exists) {
        const next = [...get().items, product];
        persist(next);
        set({ items: next });
      }
    },

    removeItem: (productId: string) => {
      const next = get().items.filter((i) => i.id !== productId);
      persist(next);
      set({ items: next });
    },

    isInWishlist: (productId: string) => {
      return get().items.some((i) => i.id === productId);
    },

    totalItems: () => get().items.length,

    clearWishlist: () => {
      persist([]);
      set({ items: [] });
    },
  };
});
