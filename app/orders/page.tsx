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
  items: { productName: string; quantity: number; price?: number; productImage?: string; finalImageUrl?: string }[];
  shippingAddress?: { city?: string; state?: string };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    // 1. Read customer orders from local storage
    try {
      const stored = JSON.parse(localStorage.getItem("cluster_studio_orders") || "[]");
      if (Array.isArray(stored) && stored.length > 0) {
        setOrders(stored);
      } else {
        // Sample starter order matching template if first time
        const defaultStarterOrder: OrderSummary = {
          orderId: "CS123456",
          totalAmount: 658,
          status: "processing",
          createdAt: new Date().toISOString(),
          userName: "John Doe",
          items: [
            {
              productName: "White Mug (Customized)",
              quantity: 1,
              price: 199,
              productImage: "/showimg/1 (1).jpeg",
            },
            {
              productName: "Sipper Bottle (Customized)",
              quantity: 1,
              price: 399,
              productImage: "/showimg/1 (5).jpeg",
            },
          ],
        };
        setOrders([defaultStarterOrder]);
      }
    } catch (e) {}

    // 2. Fetch any backend orders
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
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    window.location.href = `/orders/${searchId.trim()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";
      case "processing":
      case "confirmed":
        return "bg-amber-50 text-amber-800 border border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* ── Page Header ── */}
      <div className="pb-3 border-b border-[#EFE7DC]">
        <h1 className="text-2xl font-serif font-bold text-[#221518]">
          My Orders
        </h1>
        <p className="text-xs text-[#736B6D] mt-0.5">
          Track the live production, packing, and courier delivery of your personalized gifts.
        </p>
      </div>

      {/* ── Search Bar ── */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Order ID (e.g. CS123456)..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-[#FAF7F2] text-xs text-[#221518] rounded-xl pl-9 pr-4 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224]"
          />
          <Search size={15} className="text-[#8C7A7E] absolute left-3 top-3.5" />
        </div>
        <button
          type="submit"
          className="bg-[#5E1224] hover:bg-[#470A18] text-white font-bold text-xs uppercase px-4 py-3 rounded-xl transition-colors shadow-2xs"
        >
          Track
        </button>
      </form>

      {/* ── Orders List (Matching Screen 10) ── */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white rounded-3xl border border-[#EFE7DC] p-5 space-y-4 shadow-2xs hover:border-[#5E1224]/40 transition-all"
          >
            {/* Top Order Row: ID + Placed Date + Status */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-mono font-bold text-xs sm:text-sm text-[#221518]">
                  Order ID: #{order.orderId}
                </h3>
                <p className="text-[11px] text-[#736B6D] mt-0.5">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* Items Ordered List */}
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#EFE7DC] shrink-0 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.finalImageUrl || item.productImage || "/showimg/1 (1).jpeg"}
                        alt={item.productName}
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#221518] truncate">{item.productName}</p>
                      <p className="text-[10px] text-[#736B6D]">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  {item.price && (
                    <span className="font-extrabold text-[#221518] shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Row: Total + View Details Link */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#736B6D] block">Total</span>
                <span className="font-serif font-bold text-base text-[#5E1224]">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>

              <Link
                href={`/orders/${order.orderId}`}
                className="text-xs font-bold text-[#5E1224] hover:underline flex items-center gap-1"
              >
                <span>View Details</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
