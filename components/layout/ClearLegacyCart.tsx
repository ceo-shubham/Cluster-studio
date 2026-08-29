"use client";
import { useEffect } from "react";

// One-time cleanup: remove the old persisted cart key from localStorage
// (from when cart used zustand/persist — now cart is in-memory only)
export default function ClearLegacyCart() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cluster-studio-cart");
    }
  }, []);
  return null;
}
