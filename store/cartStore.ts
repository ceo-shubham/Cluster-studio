import { create } from "zustand";
import { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, customImageUrl?: string, finalImageUrl?: string, canvasState?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateCustomImage: (productId: string, customImageUrl: string, finalImageUrl?: string) => void;
  clearCart: () => void;
  clearCartForUser: (userId: string) => void;
  saveCartForUser: (userId: string) => void;
  loadCartForUser: (userId: string) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

// localStorage key per user
const cartKey = (userId: string) => `cs-cart-${userId}`;

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],

  addItem: (product, customImageUrl, finalImageUrl, canvasState) => {
    const existing = get().items.find((i) => i.product.id === product.id);
    if (existing) {
      set((state) => ({
        items: state.items.map((i) =>
          i.product.id === product.id
            ? {
                ...i,
                quantity: i.quantity + 1,
                customImageUrl: customImageUrl || i.customImageUrl,
                finalImageUrl: finalImageUrl || i.finalImageUrl,
                canvasState: canvasState || i.canvasState,
              }
            : i
        ),
      }));
    } else {
      set((state) => ({
        items: [...state.items, { product, quantity: 1, customImageUrl, finalImageUrl, canvasState }],
      }));
    }
  },

  removeItem: (productId) => {
    set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    }));
  },

  updateCustomImage: (productId, customImageUrl, finalImageUrl) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, customImageUrl, finalImageUrl } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  // Call on order placed — clears both memory and localStorage for this user
  clearCartForUser: (userId: string) => {
    set({ items: [] });
    if (typeof window !== "undefined") {
      localStorage.removeItem(`cs-cart-${userId}`);
    }
  },

  // Call on every cart change when user is logged in
  saveCartForUser: (userId: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(cartKey(userId), JSON.stringify(get().items));
    } catch { /* storage full or unavailable */ }
  },

  // Call on login — restores this user's saved cart
  loadCartForUser: (userId: string) => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(cartKey(userId));
      if (raw) {
        const saved: CartItem[] = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0) {
          set({ items: saved });
        }
      }
    } catch { /* corrupted data — ignore */ }
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));
