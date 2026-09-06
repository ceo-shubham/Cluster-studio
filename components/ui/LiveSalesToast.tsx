"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, X, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const RECENT_ORDERS = [
  { name: "Pooja S.", city: "Pune", product: "Magic Mug (Heat Sensitive)", price: 249, time: "3 mins ago", image: "/showimg/1 (4).jpeg", id: "1-4" },
  { name: "Rahul M.", city: "Mumbai", product: "Custom Couple Mugs (Set of 2)", price: 499, time: "6 mins ago", image: "/showimg/1 (7).jpeg", id: "1-7" },
  { name: "Ankit K.", city: "Delhi", product: "Stainless Steel Sipper Bottle", price: 399, time: "11 mins ago", image: "/showimg/1 (5).jpeg", id: "1-5" },
  { name: "Sneha G.", city: "Bangalore", product: "Custom Photo Satin Cushion", price: 399, time: "14 mins ago", image: "/showimg/1 (1).jpeg", id: "1-10" },
  { name: "Vikram R.", city: "Jaipur", product: "Classic White Sublimation Mug", price: 199, time: "18 mins ago", image: "/showimg/1 (1).jpeg", id: "1-1" },
  { name: "Simran D.", city: "Ahmedabad", product: "360° Rotating Photo Lamp", price: 699, time: "22 mins ago", image: "/showimg/1 (4).jpeg", id: "1-14" },
];

export default function LiveSalesToast() {
  const [visible, setVisible] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    // Initial delay of 4 seconds
    const initialTimeout = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Rotate every 14 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % RECENT_ORDERS.length);
        setVisible(true);
      }, 800);
    }, 14000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  const order = RECENT_ORDERS[currentIdx];

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl border border-[#EFE7DC] p-3 shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
      
      {/* Product Image Thumbnail */}
      <Link href={`/product/${order.id}`} className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EFE7DC] shrink-0 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={order.image} alt={order.product} className="w-full h-full object-contain p-0.5" />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
          <CheckCircle2 size={11} />
          <span>Verified Customer Order</span>
        </div>
        <p className="text-xs font-bold text-[#221518] truncate">
          {order.name} from {order.city}
        </p>
        <p className="text-[11px] text-[#5E1224] font-semibold truncate">
          Purchased {order.product} ({formatPrice(order.price)})
        </p>
        <span className="text-[9px] text-[#8C7A7E]">{order.time}</span>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setVisible(false)}
        className="p-1 text-[#8C7A7E] hover:text-[#221518] transition-colors"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>

    </div>
  );
}
