"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  ArrowLeft, Download, User, MapPin, Package, 
  Phone, MessageSquare, Copy, Check, Clock, Truck, 
  CheckCheck, XCircle, FileText, ExternalLink
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
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  items: {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    customImageUrl?: string;
    finalImageUrl?: string;
  }[];
  notes?: string;
}

const STATUSES = [
  { id: "pending", label: "Pending", color: "bg-amber-500 hover:bg-amber-600" },
  { id: "confirmed", label: "Confirmed", color: "bg-blue-600 hover:bg-blue-700" },
  { id: "processing", label: "Processing (Printing)", color: "bg-purple-600 hover:bg-purple-700" },
  { id: "shipped", label: "Shipped", color: "bg-indigo-600 hover:bg-indigo-700" },
  { id: "delivered", label: "Delivered", color: "bg-emerald-600 hover:bg-emerald-700" },
  { id: "cancelled", label: "Cancelled", color: "bg-rose-600 hover:bg-rose-700" },
];

export default function AdminOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notes, setNotes] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth !== "true") {
      router.push("/admin/login");
      return;
    }
    setIsAuth(true);
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        headers: { "x-admin-key": sessionStorage.getItem("adminKey") || "" },
      });
      const data = await res.json();
      setOrder(data.order);
      setNotes(data.order?.notes || "");
    } catch {
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": sessionStorage.getItem("adminKey") || "",
        },
        body: JSON.stringify({ status: newStatus, notes }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success(`Order status updated to ${newStatus.toUpperCase()}`);
      setOrder((o) => (o ? { ...o, status: newStatus, notes } : null));
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  const downloadImage = async (imageUrl: string, filename: string, itemIdx = 0, type = "original") => {
    try {
      toast.loading("Preparing download...", { id: "dl" });
      const adminKey = sessionStorage.getItem("adminKey") || "";
      
      // Try downloading via URL first, or via orderId fallback
      let endpoint = `/api/admin/download?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;
      if (!imageUrl || imageUrl.length < 5) {
        endpoint = `/api/admin/download?orderId=${order?.orderId}&itemIndex=${itemIdx}&type=${type}&filename=${encodeURIComponent(filename)}`;
      }

      const res = await fetch(endpoint, {
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Download complete!", { id: "dl" });
    } catch {
      toast.error("Download failed — check server logs", { id: "dl" });
    }
  };

  const downloadAllAssets = async (item: OrderDetail["items"][0], idx: number) => {
    if (item.customImageUrl) {
      await downloadImage(item.customImageUrl, `${order?.orderId}-item${idx + 1}-customer-photo.jpg`, idx, "original");
    }
    if (item.finalImageUrl) {
      setTimeout(() => {
        downloadImage(item.finalImageUrl!, `${order?.orderId}-item${idx + 1}-print-design.png`, idx, "final");
      }, 500);
    }
  };

  const copyShippingAddress = () => {
    if (!order?.shippingAddress) return;
    const addr = `${order.shippingAddress.name}\n${order.shippingAddress.line1}${
      order.shippingAddress.line2 ? "\n" + order.shippingAddress.line2 : ""
    }\n${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}\nPhone: ${
      order.shippingAddress.phone
    }`;
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    toast.success("Address copied to clipboard!");
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "confirmed":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "processing":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "shipped":
        return "bg-indigo-100 text-indigo-900 border-indigo-300";
      case "delivered":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "cancelled":
        return "bg-rose-100 text-rose-900 border-rose-300 line-through opacity-80";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (!isAuth || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center py-20">
        <Package size={32} className="text-[#670D1F] animate-bounce" />
        <p className="text-xs font-semibold text-slate-500 mt-2">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800 font-serif">Order Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This order does not exist or has been deleted.</p>
        <Link
          href="/admin"
          className="mt-4 inline-flex items-center gap-1.5 bg-[#670D1F] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
        >
          <ArrowLeft size={14} /> Return to Orders Dashboard
        </Link>
      </div>
    );
  }

  const cleanPhone = order.shippingAddress?.phone?.replace(/\D/g, "") || "";
  const isCancelled = order.status === "cancelled";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* ── Image Lightbox Modal ── */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-sm">{previewImage.title}</h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>
            <div className="relative flex-1 min-h-[350px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
              <Image src={previewImage.url} alt={previewImage.title} fill className="object-contain p-2" />
            </div>
            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => downloadImage(previewImage.url, `${order.orderId}-preview.png`)}
                className="px-4 py-2 rounded-xl bg-[#670D1F] text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Download size={14} /> Download Full Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Header ── */}
      <header className="bg-[#670D1F] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-bold text-rose-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors"
            >
              <ArrowLeft size={14} />
              <span>All Orders</span>
            </Link>
            <span className="text-rose-300/40">|</span>
            <span className="font-mono text-xs font-bold text-amber-300">
              Order #{order.orderId}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border shadow-xs ${getStatusBadge(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </header>

      {/* ── Content Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Order Header Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                Order #{order.orderId}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Placed on: <strong>{formatDate(order.createdAt)}</strong></span>
              <span>•</span>
              <span className="capitalize font-semibold text-slate-700">Payment: {order.paymentStatus || "COD"}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Total Amount</span>
            <span className={`text-2xl font-extrabold ${isCancelled ? "text-slate-400 line-through" : "text-[#670D1F]"}`}>
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left 8 Cols: Items & Artwork Files & Workflow */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Purchased Items with Artwork Previews */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Package size={18} className="text-[#670D1F]" />
                  Ordered Items &amp; Production Assets ({order.items.length})
                </h2>
              </div>

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-4"
                  >
                    {/* Item row */}
                    <div className="flex items-start gap-4">
                      <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-xs">
                        <Image
                          src={item.finalImageUrl || item.productImage}
                          alt={item.productName}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                            {item.productName}
                          </h3>
                          {(item.customImageUrl || item.finalImageUrl) && (
                            <button
                              onClick={() => downloadAllAssets(item, idx)}
                              className="text-[11px] font-bold text-[#670D1F] hover:underline flex items-center gap-1 shrink-0"
                            >
                              <Download size={12} /> Download Both Assets
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span>Unit Price: <strong>{formatPrice(item.price)}</strong></span>
                          <span>•</span>
                          <span>Quantity: <strong>{item.quantity}</strong></span>
                        </div>
                        <p className="text-sm font-extrabold text-[#670D1F] mt-1.5">
                          Subtotal: {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Custom Design Assets / Downloads Strip */}
                    <div className="pt-3 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* Asset 1: Original User Upload Photo */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {item.customImageUrl ? (
                            <button
                              onClick={() =>
                                setPreviewImage({
                                  url: item.customImageUrl!,
                                  title: `${order.orderId} - Customer Original Photo`,
                                })
                              }
                              className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 hover:opacity-80 transition-opacity"
                              title="Click to zoom preview"
                            >
                              <Image src={item.customImageUrl} alt="Upload thumb" fill className="object-cover" />
                            </button>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                              <FileText size={16} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Customer Photo</span>
                            <span className="text-xs font-semibold text-slate-800 truncate block">
                              {item.customImageUrl ? "Original High-Res" : "Standard Product"}
                            </span>
                          </div>
                        </div>

                        {item.customImageUrl && (
                          <button
                            onClick={() =>
                              downloadImage(
                                item.customImageUrl!,
                                `${order.orderId}-item${idx + 1}-customer-photo.jpg`,
                                idx,
                                "original"
                              )
                            }
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 shrink-0 border border-blue-200"
                          >
                            <Download size={13} />
                            <span>Download</span>
                          </button>
                        )}
                      </div>

                      {/* Asset 2: Final Composite Sublimation Design */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {item.finalImageUrl ? (
                            <button
                              onClick={() =>
                                setPreviewImage({
                                  url: item.finalImageUrl!,
                                  title: `${order.orderId} - Final Sublimation Print Canvas`,
                                })
                              }
                              className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 hover:opacity-80 transition-opacity"
                              title="Click to zoom preview"
                            >
                              <Image src={item.finalImageUrl} alt="Final thumb" fill className="object-cover" />
                            </button>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                              <FileText size={16} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Print Canvas</span>
                            <span className="text-xs font-semibold text-slate-800 truncate block">
                              {item.finalImageUrl ? "Sublimation Mockup" : "Standard Print"}
                            </span>
                          </div>
                        </div>

                        {item.finalImageUrl && (
                          <button
                            onClick={() =>
                              downloadImage(
                                item.finalImageUrl!,
                                `${order.orderId}-item${idx + 1}-final-print-design.png`,
                                idx,
                                "final"
                              )
                            }
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 shrink-0 border border-emerald-200"
                          >
                            <Download size={13} />
                            <span>Download</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Order Workflow & Status Selector */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-4">
              <div>
                <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <CheckCheck size={18} className="text-[#670D1F]" />
                  Update Order Fulfillment Status
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click a status button to immediately update order state and notify fulfillment team.
                </p>
              </div>

              {/* Status Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {STATUSES.map((st) => {
                  const isCurrent = order.status === st.id;
                  return (
                    <button
                      key={st.id}
                      disabled={updatingStatus || isCurrent}
                      onClick={() => updateStatus(st.id)}
                      className={`p-3 rounded-xl text-xs font-bold text-center border-2 transition-all flex items-center justify-center gap-2 ${
                        isCurrent
                          ? "bg-[#670D1F] border-[#670D1F] text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-[#670D1F] hover:bg-rose-50"
                      } disabled:opacity-60`}
                    >
                      {st.id === "delivered" && <CheckCheck size={14} />}
                      {st.id === "shipped" && <Truck size={14} />}
                      {st.id === "cancelled" && <XCircle size={14} />}
                      {st.id === "pending" && <Clock size={14} />}
                      <span>{st.label}</span>
                      {isCurrent && <span className="text-amber-300 text-[10px]">● Active</span>}
                    </button>
                  );
                })}
              </div>

              {/* Internal Notes */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Fulfillment & Courier Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl p-3 outline-none border border-slate-200 focus:border-[#670D1F] focus:bg-white transition-all resize-none"
                  placeholder="Add tracking number (e.g. Bluedart: #123456), special printing instructions, or customer requests..."
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => updateStatus(order.status)}
                    disabled={updatingStatus}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    {updatingStatus ? "Saving Notes..." : "Save Notes"}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right 4 Cols: Customer, Shipping & Payment */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Customer Details & Quick Contact */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-4">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
                <User size={16} className="text-[#670D1F]" />
                Customer Contact
              </h2>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Name</span>
                  <p className="font-bold text-sm text-slate-900">{order.userName || "Customer"}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Email Address</span>
                  <p className="text-xs text-slate-700 font-medium break-all">{order.userEmail}</p>
                </div>

                {order.shippingAddress?.phone && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</span>
                    <p className="text-xs font-bold text-slate-900">{order.shippingAddress.phone}</p>
                  </div>
                )}
              </div>

              {/* Quick WhatsApp & Call CTA */}
              {cleanPhone && (
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <a
                    href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                      `Hi ${order.userName}! Regarding your Cluster Studio Order #${order.orderId}...`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs"
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp Customer</span>
                  </a>

                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 rounded-xl transition-colors"
                  >
                    <Phone size={13} />
                    <span>Call Customer</span>
                  </a>
                </div>
              )}
            </div>

            {/* Shipping / Delivery Address */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <MapPin size={16} className="text-[#670D1F]" />
                  Shipping Address
                </h2>
                <button
                  onClick={copyShippingAddress}
                  className="text-xs font-bold text-[#670D1F] hover:underline flex items-center gap-1"
                >
                  {copiedAddress ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedAddress ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="text-xs text-slate-700 space-y-1 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} - <strong>{order.shippingAddress.pincode}</strong>
                </p>
                <p className="pt-1 text-slate-500 font-semibold">📞 {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-3">
              <h2 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
                Payment Breakdown
              </h2>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Payment Method</span>
                  <span className="font-bold text-slate-900 uppercase">Cash on Delivery (COD)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payment Status</span>
                  <span
                    className={`font-extrabold uppercase text-[11px] ${
                      order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {order.paymentStatus || "Pending (COD)"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-emerald-600">FREE Pan-India</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Grand Total</span>
                  <span className={isCancelled ? "text-slate-400 line-through" : "text-[#670D1F]"}>
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

