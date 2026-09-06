"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatPrice, formatDate, STATUS_COLORS } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  Package, MapPin, CheckCircle, XCircle, Clock, 
  Truck, ArrowLeft, ChevronLeft, ShieldCheck,
  Eye, Download, ZoomIn, ZoomOut, RotateCcw, Sparkles, Image as ImageIcon
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
    if (typeof window !== "undefined") {
      const searchParam = new URLSearchParams(window.location.search).get("id");
      if (searchParam) return searchParam;
      const parts = window.location.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && last !== "view") return last;
    }
    if (params?.orderId && params.orderId !== "view") return params.orderId;
    return "CS123456";
  };

  const effectiveOrderId = getEffectiveOrderId();
  const [order, setOrder] = useState<OrderDetail | null>(null);

  // Lightbox Modal for Customer Artwork Inspection
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    title: string;
    productName: string;
    productId?: string;
    customUrl?: string;
    finalUrl?: string;
    activeTab: "final" | "custom";
  } | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      toast.loading("Preparing download...", { id: "dl-user" });

      if (imageUrl && imageUrl.startsWith("data:")) {
        const matches = imageUrl.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const contentType = matches[1];
          const byteCharacters = atob(matches[2]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: contentType });
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          toast.success("Downloaded successfully!", { id: "dl-user" });
          return;
        }
      }

      try {
        const res = await fetch(imageUrl);
        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          toast.success("Downloaded successfully!", { id: "dl-user" });
          return;
        }
      } catch (e) {}

      window.open(imageUrl, "_blank");
      toast.success("Opened image in new tab!", { id: "dl-user" });
    } catch (err) {
      console.error("Download failed:", err);
      window.open(imageUrl, "_blank");
      toast.success("Opened image in new tab!", { id: "dl-user" });
    }
  };

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
  const isOnlineInProgress = currentOrder.paymentStatus === "in_progress";
  const isPaid = currentOrder.paymentStatus === "paid";
  const adminWhatsAppNumber = "918380808435";

  const whatsAppMessage = `Hi Admin, regarding my Cluster Studio Order #${currentOrder.orderId} (Total: ${formatPrice(currentOrder.totalAmount)}). Please share the UPI QR code or verify my payment!`;
  const adminWhatsAppUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* ── Interactive Customer Artwork Lightbox Modal ── */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5E1224] block flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>Personalized Design Viewer</span>
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{previewImage.productName}</h3>
                {previewImage.productId && (
                  <span className="font-mono text-[11px] text-slate-500">Product ID: {previewImage.productId}</span>
                )}
              </div>
              <button
                onClick={() => { setPreviewImage(null); setZoomScale(1); }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Design Tabs (If custom uploaded photo exists) */}
            {previewImage.customUrl && previewImage.finalUrl && (
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setPreviewImage(p => p ? { ...p, activeTab: "final", url: p.finalUrl! } : null)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    previewImage.activeTab === "final"
                      ? "bg-white text-[#5E1224] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Sparkles size={13} />
                  <span>Final Customized Product</span>
                </button>
                <button
                  onClick={() => setPreviewImage(p => p ? { ...p, activeTab: "custom", url: p.customUrl! } : null)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    previewImage.activeTab === "custom"
                      ? "bg-white text-[#5E1224] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ImageIcon size={13} />
                  <span>Your Uploaded Photo</span>
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomScale(s => Math.min(s + 0.25, 3))}
                  className="bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <ZoomIn size={14} /> Zoom In
                </button>
                <button
                  onClick={() => setZoomScale(s => Math.max(s - 0.25, 0.5))}
                  className="bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <ZoomOut size={14} /> Zoom Out
                </button>
                <button
                  onClick={() => setZoomScale(1)}
                  className="bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <RotateCcw size={13} /> Reset ({Math.round(zoomScale * 100)}%)
                </button>
              </div>

              <span className="text-slate-500 font-medium text-[11px] hidden sm:inline">
                {previewImage.activeTab === "final" ? "Composite Mockup" : "High-Res Upload"}
              </span>
            </div>

            {/* Zoomable Image Container */}
            <div className="relative flex-1 min-h-[320px] max-h-[50vh] bg-slate-900/90 rounded-2xl overflow-auto border border-slate-800 flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage.url}
                alt={previewImage.title}
                style={{ transform: `scale(${zoomScale})`, transition: "transform 0.15s ease-out" }}
                className="max-h-[45vh] max-w-full object-contain rounded-lg shadow-xl"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">Pinch or zoom to inspect printing details.</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setPreviewImage(null); setZoomScale(1); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    downloadImage(
                      previewImage.url,
                      `${currentOrder.orderId}-${previewImage.activeTab === "final" ? "final-design" : "uploaded-photo"}.png`
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-[#5E1224] text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-[#470A18] transition-colors cursor-pointer"
                >
                  <Download size={14} /> Download Design
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
              {currentOrder.status === "cancelled" ? "Order Cancelled" : "Order Confirmed"}
            </h1>
            <p className="text-xs text-[#736B6D] mt-0.5">
              Order ID: <strong className="font-mono text-[#221518]">#{currentOrder.orderId}</strong> · Placed on {formatDate(currentOrder.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Payment Status Badge */}
          {isOnlineInProgress && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
              Payment: In Progress ⏳
            </span>
          )}
          {isPaid && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
              Payment: Paid ✓
            </span>
          )}
          {!isOnlineInProgress && !isPaid && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
              Payment: COD
            </span>
          )}

          {/* Fulfillment Status Badge */}
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-[#5E1224] border border-rose-200">
            {currentOrder.status}
          </span>
        </div>
      </div>

      {/* ── Payment In Progress Notice & WhatsApp Action ── */}
      {isOnlineInProgress && (
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <span>⏳</span>
            <span>Online Payment Verification In Progress</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Your order has been recorded. If you haven&apos;t completed the UPI payment yet, please contact our Admin on WhatsApp to get the <strong>UPI QR code</strong> or share your payment screenshot. Admin will verify and mark your payment as <strong>Paid ✓</strong>.
          </p>
          <a
            href={adminWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-transform active:scale-98"
          >
            <span>📲</span>
            <span>WhatsApp Admin (+91 8380808435)</span>
          </a>
        </div>
      )}

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

      {/* Items in Order with Final Customized Image View */}
      <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#EFE7DC]">
          <h2 className="font-serif font-bold text-sm uppercase tracking-wider text-[#221518]">
            Ordered Items ({currentOrder.items.length})
          </h2>
          <span className="text-[11px] text-[#736B6D]">Click on any item to view customized artwork</span>
        </div>

        <div className="space-y-4 divide-y divide-slate-100">
          {currentOrder.items.map((item, i) => {
            const displayImg = item.finalImageUrl || item.productImage;
            return (
              <div key={i} className="pt-4 first:pt-0 space-y-3">
                <div className="flex items-start gap-3">
                  {/* Thumbnail with Click to View Overlay */}
                  <button
                    onClick={() =>
                      setPreviewImage({
                        url: displayImg,
                        title: `${item.productName} - Customized Mockup`,
                        productName: item.productName,
                        productId: item.productId,
                        customUrl: item.customImageUrl,
                        finalUrl: item.finalImageUrl,
                        activeTab: "final",
                      })
                    }
                    className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EFE7DC] shrink-0 flex items-center justify-center group hover:border-[#5E1224] transition-colors cursor-pointer shadow-xs"
                    title="Click to view customized design"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayImg}
                      alt={item.productName}
                      className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">
                      <Eye size={16} />
                    </span>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs sm:text-sm text-[#221518] truncate">{item.productName}</p>
                      {item.productId && (
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold shrink-0">
                          ID: {item.productId}
                        </span>
                      )}
                    </div>

                    {item.customImageUrl && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                        <span>✨</span>
                        <span>Personalized with your custom photo</span>
                      </p>
                    )}
                    <p className="text-[11px] text-[#736B6D] mt-0.5">
                      Qty: <strong>{item.quantity}</strong> × {formatPrice(item.price)}
                    </p>
                    <span className="font-extrabold text-sm text-[#5E1224] mt-1 block">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>

                {/* Interactive Action Bar: View Final Design & View Uploaded Photo */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pl-1">
                  <button
                    onClick={() =>
                      setPreviewImage({
                        url: displayImg,
                        title: `${item.productName} - Customized Mockup`,
                        productName: item.productName,
                        productId: item.productId,
                        customUrl: item.customImageUrl,
                        finalUrl: item.finalImageUrl,
                        activeTab: "final",
                      })
                    }
                    className="inline-flex items-center gap-1.5 bg-[#5E1224]/10 hover:bg-[#5E1224]/20 text-[#5E1224] border border-[#5E1224]/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <Eye size={13} />
                    <span>View Final Customized Design</span>
                  </button>

                  {item.customImageUrl && (
                    <button
                      onClick={() =>
                        setPreviewImage({
                          url: item.customImageUrl!,
                          title: `${item.productName} - Your Uploaded Photo`,
                          productName: item.productName,
                          productId: item.productId,
                          customUrl: item.customImageUrl,
                          finalUrl: item.finalImageUrl,
                          activeTab: "custom",
                        })
                      }
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      <ImageIcon size={13} />
                      <span>View Your Uploaded Photo</span>
                    </button>
                  )}

                  <button
                    onClick={() =>
                      downloadImage(
                        item.finalImageUrl || displayImg,
                        `${currentOrder.orderId}-item${i + 1}-final-design.png`
                      )
                    }
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Download design image"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
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
