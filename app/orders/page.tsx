"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate, STATUS_COLORS } from "@/lib/utils";
import { Package, ChevronRight, Search } from "lucide-react";

interface OrderSummary {
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { productName: string; quantity: number }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    window.location.href = `/orders/${searchId.trim()}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
          Track Your Orders
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Enter your Order ID (e.g. CS-123456) to check the live fulfillment and delivery status.
        </p>
      </div>

      {/* Order Lookup Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-3xl p-6 shadow-sm border border-amber-100/70 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter your Order ID (e.g. CS-91823)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-[#FAF7F2] text-gray-900 text-sm rounded-xl pl-10 pr-4 py-3 outline-none border border-amber-200 focus:border-[#670D1F]"
          />
          <Search size={18} className="text-gray-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          className="bg-[#670D1F] hover:bg-[#520817] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-colors shadow-sm"
        >
          Track Order
        </button>
      </form>

      {/* Quick Links */}
      <div className="bg-rose-50/60 rounded-3xl p-6 border border-rose-100 text-center space-y-3">
        <h3 className="font-serif font-bold text-base text-gray-900">Need Help Finding Your Order?</h3>
        <p className="text-xs text-gray-600 max-w-md mx-auto">
          Your order ID was shown on the confirmation screen and sent to your email/phone during checkout.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-[#670D1F] border border-rose-200 hover:bg-rose-50 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-2xs"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
