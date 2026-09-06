"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatPrice, formatDate, STATUS_COLORS } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  Package, MapPin, CheckCircle, XCircle, Clock, 
  Truck, ArrowLeft, ChevronLeft, ShieldCheck 
} from "lucide-react";

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
    return "CS123456";
  };

  const effectiveOrderId = getEffectiveOrderId();
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    const targetId = effectiveOrderId || "CS123456";

    // 1. Try immediate cached order from localStorage
    try {
      const localSaved = JSON.parse(localStorage.getItem("cluster_studio_orders") || "[]");
      const found = localSaved.find((o: any) => o.orderId === targetId);
      if (found) {
        setOrder(found);
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
      .catch(() => {});
  }, [effectiveOrderId]);

  const currentOrder: OrderDetail = order || {
    orderId: effectiveOrderId || "CS123456",
    status: "processing",
    paymentStatus: "paid",
    totalAmount: 658,
    createdAt: new Date().toISOString(),
    userName: "Customer",
    userEmail: "customer@clusterstudio.in",
    shippingAddress: {
      name: "Customer",
      line1: "12, MG Road, Near Post Office",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      phone: "9876543210"
    },
    items: [
      {
        productId: "1-1",
        productName: "White Mug (Customized)",
        productImage: "/showimg/1 (1).jpeg",
        quantity: 1,
        price: 199,
        customImageUrl: "/showimg/1 (1).jpeg",
        finalImageUrl: "/bannerimg/1 (1).jpeg"
      },
      {
        productId: "1-5",
        productName: "Sipper Bottle (Customized)",
        productImage: "/showimg/1 (5).jpeg",
        quantity: 1,
        price: 399,
        customImageUrl: "/showimg/1 (5).jpeg",
        finalImageUrl: "/bannerimg/1 (5).jpeg"
      }
    ]
  };

  const stepIndex = STEPS.indexOf(currentOrder.status);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Back Button */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#736B6D] hover:text-[#5E1224] transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Back to My Orders</span>
      </Link>

      {/* Header Summary */}
      <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {currentOrder.status === "cancelled" ? (
            <XCircle size={28} className="text-rose-500 shrink-0" />
          ) : (
            <CheckCircle size={28} className="text-emerald-600 shrink-0" />
          )}
          <div>
            <h1 className="text-xl font-serif font-bold text-[#221518]">
              {currentOrder.status === "cancelled" ? "Order Cancelled" : "Order Confirmed & In Progress"}
            </h1>
            <p className="text-xs text-[#736B6D] mt-0.5">
              Order ID: <strong className="font-mono text-[#221518]">#{currentOrder.orderId}</strong> · Placed on {formatDate(currentOrder.createdAt)}
            </p>
          </div>
        </div>

        <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
          {currentOrder.status}
        </span>
      </div>

      {/* Live Fulfillment Timeline */}
      {currentOrder.status !== "cancelled" && (
        <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-xs uppercase tracking-wider text-[#221518]">
            Fulfillment Journey
          </h2>
          <div className="flex items-center justify-between relative pt-2">
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-[#EFE7DC] z-0" />
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i <= stepIndex
                    ? "bg-[#5E1224] border-[#5E1224] text-white shadow-xs"
                    : "bg-white border-[#EFE7DC] text-[#736B6D]"
                }`}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] capitalize text-center ${i <= stepIndex ? "text-[#5E1224] font-bold" : "text-[#736B6D]"}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items in Order */}
      <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 space-y-4 shadow-2xs">
        <h2 className="font-serif font-bold text-sm uppercase tracking-wider text-[#221518] pb-2 border-b border-[#EFE7DC]">
          Ordered Items ({currentOrder.items.length})
        </h2>
        <div className="space-y-3 divide-y divide-slate-100">
          {currentOrder.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 pt-3 first:pt-0">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EFE7DC] shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.finalImageUrl || item.productImage}
                  alt={item.productName}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs sm:text-sm text-[#221518] truncate">{item.productName}</p>
                {item.customImageUrl && (
                  <p className="text-[11px] text-emerald-700 font-medium">✓ Custom photo attached</p>
                )}
                <p className="text-[11px] text-[#736B6D]">Qty: {item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <span className="font-extrabold text-sm text-[#221518]">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#EFE7DC] pt-3 flex justify-between text-base font-extrabold text-[#221518]">
          <span className="font-serif">Grand Total</span>
          <span className="text-[#5E1224]">{formatPrice(currentOrder.totalAmount)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 space-y-2 shadow-2xs text-xs">
        <h2 className="font-serif font-bold text-sm text-[#221518] flex items-center gap-2">
          <MapPin size={16} className="text-[#5E1224]" /> Delivery Address
        </h2>
        <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EFE7DC] space-y-1 text-[#5C4F52]">
          <p className="font-bold text-[#221518]">{currentOrder.shippingAddress.name}</p>
          <p>{currentOrder.shippingAddress.line1}{currentOrder.shippingAddress.line2 ? `, ${currentOrder.shippingAddress.line2}` : ""}</p>
          <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} — <strong>{currentOrder.shippingAddress.pincode}</strong></p>
          <p className="pt-1 text-[#221518] font-semibold">📞 {currentOrder.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href="/"
          className="w-full text-center bg-[#5E1224] hover:bg-[#470A18] text-white font-bold py-3.5 rounded-2xl transition-all text-xs uppercase tracking-wider shadow-md"
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}
