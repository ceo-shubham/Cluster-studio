"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatPrice, formatDate, STATUS_COLORS } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Package, MapPin, CheckCircle, XCircle } from "lucide-react";

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
}

const STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data.order); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orderId]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
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

  if (loading) return <div className="text-center py-20 text-gray-400">Loading order...</div>;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found.</div>;

  const stepIndex = STEPS.indexOf(order.status);
  const canCancel = ["pending", "confirmed"].includes(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        {order.status === "cancelled" ? (
          <XCircle size={28} className="text-red-500" />
        ) : (
          <CheckCircle size={28} className="text-green-600" />
        )}
        <h1 className="text-2xl font-bold text-[#3b1c0c]">
          {order.status === "cancelled" ? "Order Cancelled" : "Order Confirmed"}
        </h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Order ID: <strong>{order.orderId}</strong> · {formatDate(order.createdAt)}
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
          {order.status}
        </span>
      </p>

      {/* Status Track */}
      {order.status !== "cancelled" && (
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5 mb-5">
          <h2 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Order Status</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 mx-6 z-0" />
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-1 z-10 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i <= stepIndex ? "bg-amber-600 border-amber-600 text-white" : "bg-white border-gray-300 text-gray-400"}`}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className={`text-xs capitalize text-center ${i <= stepIndex ? "text-amber-700 font-semibold" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5 mb-5">
        <h2 className="font-bold text-gray-800 mb-4">Items Ordered</h2>
        <div className="flex flex-col gap-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-amber-100 shrink-0">
                <Image src={item.finalImageUrl || item.productImage} alt={item.productName} fill className="object-contain" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{item.productName}</p>
                {item.customImageUrl && <p className="text-xs text-green-600">✓ Custom design added</p>}
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <span className="font-bold text-[#3b1c0c]">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between text-lg font-bold text-[#3b1c0c]">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5 mb-5">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-amber-600" /> Shipping Address
        </h2>
        <p className="text-sm text-gray-700 font-semibold">{order.shippingAddress.name}</p>
        <p className="text-sm text-gray-600">{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}</p>
        <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
        <p className="text-sm text-gray-600 mt-1">📞 {order.shippingAddress.phone}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link href="/orders" className="flex-1 text-center border border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold py-3 rounded-xl transition-colors text-sm">
          All Orders
        </Link>
        <Link href="/" className="flex-1 text-center bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
          Continue Shopping
        </Link>
      </div>

      {/* Cancel button — only for pending/confirmed */}
      {canCancel && (
        <button
          onClick={() => setShowConfirm(true)}
          className="mt-3 w-full border border-red-300 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Cancel Order
        </button>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Cancel Order?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to cancel order <strong>{order.orderId}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={cancelling}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
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
