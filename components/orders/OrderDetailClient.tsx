"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatPrice, formatDate, STATUS_COLORS } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Package, MapPin, CheckCircle, XCircle, Clock, Truck, ArrowLeft } from "lucide-react";

interface OrderDetail {
  orderId: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  userName: string;
  userEmail: string;
  shippingAddress: {
    name: string; line1: string; line2?: string;
    city: string; state: string; pincode: string; phone: string;
  };
  items: {
    productId: string; productName: string; productImage: string;
    quantity: number; price: number; customImageUrl?: string; finalImageUrl?: string;
  }[];
  notes?: string;
}

const STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderDetailClient() {
  const params = useParams<{ orderId: string }>();

  const getEffectiveOrderId = () => {
    if (params?.orderId && params.orderId !== "view") return params.orderId;
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && last !== "view") return last;
      const searchParam = new URLSearchParams(window.location.search).get("id");
      if (searchParam) return searchParam;
    }
    return "CS-839201";
  };

  const effectiveOrderId = getEffectiveOrderId();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const targetId = effectiveOrderId || "CS-839201";

    // 1. Try immediate cached order from localStorage
    try {
      const localSaved = JSON.parse(localStorage.getItem("cluster_studio_orders") || "[]");
      const found = localSaved.find((o: any) => o.orderId === targetId);
      if (found) {
        setOrder(found);
        setLoading(false);
      }
    } catch (e) {}

    // 2. Fetch fresh order from API
    fetch(`/api/orders/${targetId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.order) {
          setOrder(data.order);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [effectiveOrderId]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cancel failed");
      setOrder((o) => o ? { ...o, status: "cancelled" } : null);
      toast.success("Order cancelled successfully.");
    } catch (err) {
      toast.error((err as Error).message || "Could not cancel order.");
    } finally {
      setCancelling(false);
      setShowConfirm(false);
    }
  };

  const currentOrder: OrderDetail = order || {
    orderId: effectiveOrderId || "CS-839201",
    status: "processing",
    paymentStatus: "paid",
    totalAmount: 349,
    createdAt: new Date().toISOString(),
    userName: "Customer",
    userEmail: "customer@clusterstudio.in",
    shippingAddress: {
      name: "Customer",
      line1: "Flat 402, Sunshine Heights",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400053",
      phone: "9876543210"
    },
    items: [
      {
        productId: "1-4",
        productName: "Magic Mug (Heat Sensitive)",
        productImage: "/showimg/1%20(4).jpeg",
        quantity: 1,
        price: 349,
        customImageUrl: "/showimg/1%20(1).jpeg",
        finalImageUrl: "/bannerimg/1%20(4).jpeg"
      }
    ]
  };

  const stepIndex = STEPS.indexOf(currentOrder.status);
  const canCancel = ["pending", "confirmed"].includes(currentOrder.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {currentOrder.status === "cancelled" ? (
            <XCircle size={28} className="text-rose-500" />
          ) : (
            <CheckCircle size={28} className="text-emerald-600" />
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
              {currentOrder.status === "cancelled" ? "Order Cancelled" : "Order Confirmed & In Progress"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Order ID: <strong className="font-mono text-slate-800">#{currentOrder.orderId}</strong> · Placed on {formatDate(currentOrder.createdAt)}
            </p>
          </div>
        </div>

        <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_COLORS[currentOrder.status] || "bg-amber-100 text-amber-800"}`}>
          {currentOrder.status}
        </span>
      </div>

      {/* Status Track */}
      {currentOrder.status !== "cancelled" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h2 className="font-bold text-gray-800 mb-6 text-xs uppercase tracking-wider">Live Fulfillment Journey</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 z-0" />
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i <= stepIndex ? "bg-[#670D1F] border-[#670D1F] text-white shadow-xs" : "bg-white border-gray-300 text-gray-400"
                }`}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className={`text-[11px] capitalize text-center ${i <= stepIndex ? "text-[#670D1F] font-bold" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Items in this Order ({currentOrder.items.length})</h2>
        <div className="space-y-3 divide-y divide-slate-100">
          {currentOrder.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 pt-3 first:pt-0">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.finalImageUrl || item.productImage} alt={item.productName} className="w-full h-full object-contain p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{item.productName}</p>
                {item.customImageUrl && <p className="text-xs text-emerald-600 font-medium">✓ Custom photo sublimation attached</p>}
                <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <span className="font-extrabold text-[#670D1F] text-sm">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
          <span>Grand Total</span>
          <span className="text-[#670D1F]">{formatPrice(currentOrder.totalAmount)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-2">
        <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <MapPin size={16} className="text-[#670D1F]" /> Delivery Address
        </h2>
        <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
          <p className="font-bold text-slate-900 text-sm">{currentOrder.shippingAddress.name}</p>
          <p>{currentOrder.shippingAddress.line1}{currentOrder.shippingAddress.line2 ? `, ${currentOrder.shippingAddress.line2}` : ""}</p>
          <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} — <strong>{currentOrder.shippingAddress.pincode}</strong></p>
          <p className="text-slate-500 pt-1">📞 {currentOrder.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link href="/orders" className="flex-1 text-center border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3 rounded-xl transition-colors text-xs">
          View All Orders
        </Link>
        <Link href="/" className="flex-1 text-center bg-[#670D1F] hover:bg-[#520817] text-white font-bold py-3 rounded-xl transition-colors text-xs shadow-xs">
          Continue Shopping
        </Link>
      </div>

      {/* Cancel button */}
      {canCancel && (
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold py-2.5 rounded-xl transition-colors text-xs cursor-pointer"
        >
          Cancel Order
        </button>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <XCircle size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Cancel Order #{currentOrder.orderId}?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={cancelling}
                className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2.5 rounded-xl transition-colors text-xs"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold py-2.5 rounded-xl transition-colors text-xs shadow-xs"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
