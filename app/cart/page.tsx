"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CartSummary from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EFE7DC]">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#221518]">
            Your Cart {totalItems > 0 && <span className="text-[#5E1224]">({totalItems})</span>}
          </h1>
          <p className="text-xs text-[#736B6D] mt-0.5">
            Review your personalized items before checkout.
          </p>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold text-[#5E1224] hover:underline flex items-center gap-1"
        >
          <ChevronLeft size={14} />
          <span>Shop More</span>
        </Link>
      </div>

      <CartSummary />
    </div>
  );
}
