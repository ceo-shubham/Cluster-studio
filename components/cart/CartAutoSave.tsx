"use client";
// Only rendered when Clerk IS configured — safe to use Clerk hooks here
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useCartStore } from "@/store/cartStore";

export default function CartAutoSave() {
  const { userId } = useAuth();
  const items = useCartStore((s) => s.items);
  const saveCartForUser = useCartStore((s) => s.saveCartForUser);

  // Whenever cart items change and user is logged in → save to localStorage
  useEffect(() => {
    if (userId) saveCartForUser(userId);
  }, [items, userId, saveCartForUser]);

  return null;
}
