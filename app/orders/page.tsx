"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate, STATUS_COLORS } from "@/lib/utils";
import { Package, ChevronRight, Search, Clock, CheckCircle, ArrowRight, Truck } from "lucide-react";

interface OrderSummary {
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  userName?: string;
  items: { productName: string; quantity: number; productImage?: string; finalImageUrl?: string }[];
  shippingAddress?: { city?: string; state?: string };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    // 1. Read customer orders from local storage
    try {
      const stored = JSON.parse(localStorage.getItem("cluster_studio_orders") || "[]");
      if (Array.isArray(stored) && stored.length > 0) {
        setOrders(stored);
      }
    } catch (e) {}

    // 2. Fetch recent orders
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.orders)) {
          setOrders((prev) => {
            const merged = [...prev];
            for (const o of data.orders) {
              if (!merged.some((m) => m.orderId === o.orderId)) {
                merged.push(o);
              }
            }
            return merged;
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
          Review your recent purchases or enter your Order ID to check live fulfillment status.
        </p>
      </div>

      {/* Order Lookup Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-3xl p-6 shadow-sm border border-amber-100/70 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. CS-123456)..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-[#FAF7F2] text-gray-900 text-sm rounded-xl pl-10 pr-4 py-3 outline-none border border-amber-200 focus:border-[#670D1F]"
          />
          <Search size={18} className="text-gray-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          className="bg-[#670D1F] hover:bg-[#520817] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          Track Order
        </button>
      </form>

      {/* Recent Customer Orders List */}
      {orders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-gray-900">Your Recent Orders ({orders.length})</h2>
          </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-[#670D1F] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-900 px-2 py-0.5 rounded">
                      #{order.orderId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[order.status] || "bg-amber-100 text-amber-800"}`}>
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Placed on <strong>{formatDate(order.createdAt)}</strong>
                  </p>

                  <div className="pt-1">
                    {order.items?.map((item, idx) => (
                      <p key={idx} className="text-xs font-semibold text-gray-800 truncate">
                        • {item.productName} × {item.quantity}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <span className="text-base font-extrabold text-[#670D1F]">
                    {formatPrice(order.totalAmount)}
                  </span>

                  <Link
                    href={`/orders/${order.orderId}`}
                    className="inline-flex items-center gap-1 bg-[#670D1F] hover:bg-[#520817] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    <span>View Order</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-rose-50/60 rounded-3xl p-6 border border-rose-100 text-center space-y-3">
        <h3 className="font-serif font-bold text-base text-gray-900">Personalized Custom Gifting</h3>
        <p className="text-xs text-gray-600 max-w-md mx-auto">
          Need a new custom magic mug, photo cushion, or stainless steel bottle?
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
