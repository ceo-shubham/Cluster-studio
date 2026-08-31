"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { IS_CLERK_CONFIGURED } from "@/lib/useClerkAuth";
import CartAutoSave from "./CartAutoSave";

export default function CartSummary() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <ShoppingBag size={64} className="text-rose-200" />
        <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
        <Link
          href="/#products"
          className="bg-[#670D1F] hover:bg-[#520817] text-white px-6 py-3 rounded-xl font-bold transition-colors shadow"
        >
          Browse Personalized Gifts
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Auto-saves cart to localStorage when user is logged in */}
      {IS_CLERK_CONFIGURED && <CartAutoSave />}

      {items.map((item) => (
        <div key={item.product.id} className="bg-white rounded-2xl shadow-sm border border-amber-100/70 p-4 flex gap-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-gray-200">
            <Image
              src={item.finalImageUrl || item.product.image}
              alt={item.product.name}
              fill
              className="object-contain p-1"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{item.product.name}</h3>
            <p className="text-xs text-[#670D1F] font-semibold">{item.product.category}</p>
            {item.customImageUrl && (
              <p className="text-xs text-emerald-600 mt-0.5 font-medium">✓ Custom design attached</p>
            )}
            <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="p-1.5 hover:bg-gray-200 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-2 font-bold text-sm text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="p-1.5 hover:bg-gray-200 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="font-extrabold text-[#670D1F] text-base">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          </div>

          <button
            onClick={() => removeItem(item.product.id)}
            className="text-gray-400 hover:text-red-600 shrink-0 self-start mt-1 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-amber-100/80 mt-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1.5">
          <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span className="font-bold text-gray-900">{formatPrice(totalPrice())}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Delivery</span>
          <span className="text-emerald-700 font-bold">FREE</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-[#670D1F] border-t border-amber-200/80 pt-3">
          <span className="font-serif">Grand Total</span>
          <span>{formatPrice(totalPrice())}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 w-full block text-center bg-[#670D1F] hover:bg-[#520817] text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm uppercase tracking-wider"
        >
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}
