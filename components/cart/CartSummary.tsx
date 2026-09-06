"use client";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartSummary() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const totalItemsCount = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center bg-white rounded-3xl border border-[#EFE7DC] p-8 shadow-2xs">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-center text-[#5E1224]">
          <ShoppingBag size={28} />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-[#221518]">Your Cart is Empty</h2>
          <p className="text-xs text-[#736B6D] mt-1">Discover customized mugs, t-shirts, bottles and personalized gifts.</p>
        </div>
        <Link
          href="/"
          className="bg-[#5E1224] hover:bg-[#470A18] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          Browse Gifts &amp; Fashion
        </Link>
      </div>
    );
  }

  const subtotal = totalPrice();
  const shippingFee = subtotal > 499 ? 0 : 60;
  const discount = 0;
  const finalTotal = subtotal + shippingFee - discount;

  return (
    <div className="space-y-6">
      
      {/* ── Cart Items List ── */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="bg-white rounded-2xl border border-[#EFE7DC] p-4 flex gap-4 shadow-2xs relative"
          >
            {/* Thumbnail on Coaster */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#EFE7DC] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.finalImageUrl || item.product.cardImage || item.product.image}
                alt={item.product.name}
                className="w-full h-full object-contain p-1"
              />
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#221518] truncate">
                    {item.product.name}
                  </h3>
                  <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md mt-0.5">
                    {item.customImageUrl ? "Customized" : "Personalized Gift"}
                  </span>
                </div>

                {/* Remove Trash Button */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-[#8C7A7E] hover:text-rose-600 transition-colors p-1"
                  aria-label={`Remove ${item.product.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Price & Quantity Stepper */}
              <div className="flex items-center justify-between pt-2">
                <div className="inline-flex items-center border border-[#EFE7DC] rounded-lg overflow-hidden bg-[#FAF7F2]">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-[#EFE7DC] transition-colors text-[#221518]"
                    aria-label="Decrease"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-3 font-bold text-xs text-[#221518]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-[#EFE7DC] transition-colors text-[#221518]"
                    aria-label="Increase"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <span className="font-extrabold text-sm sm:text-base text-[#221518]">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── PRICE DETAILS SUMMARY ── */}
      <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 sm:p-6 space-y-3 shadow-2xs">
        <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#221518] pb-2 border-b border-[#EFE7DC]">
          PRICE DETAILS
        </h3>

        <div className="space-y-2 text-xs text-[#5C4F52]">
          <div className="flex justify-between">
            <span>Subtotal ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})</span>
            <span className="font-bold text-[#221518]">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span className={`font-bold ${shippingFee === 0 ? "text-emerald-700" : "text-[#221518]"}`}>
              {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span className="font-bold text-emerald-700">-₹{discount}</span>
          </div>

          <div className="pt-2 border-t border-[#EFE7DC] flex justify-between text-base font-extrabold text-[#221518]">
            <span className="font-serif">Total</span>
            <span className="text-[#5E1224]">{formatPrice(finalTotal)}</span>
          </div>
        </div>

        {/* Proceed to Checkout CTA */}
        <div className="pt-3 space-y-2.5">
          <Link
            href="/checkout"
            className="w-full block text-center bg-[#5E1224] hover:bg-[#470A18] text-white font-bold py-4 rounded-2xl shadow-md transition-all active:scale-98 text-xs uppercase tracking-wider"
          >
            PROCEED TO CHECKOUT
          </Link>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-[#736B6D] hover:text-[#5E1224] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
