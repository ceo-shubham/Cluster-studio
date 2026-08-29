"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatPrice, formatDate, STATUS_COLORS } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Download, User, MapPin, Package } from "lucide-react";

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

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notes, setNotes] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth !== "true") { router.push("/admin/login"); return; }
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
    } catch { console.error("Failed"); }
    finally { setLoading(false); }
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
      toast.success("Order status updated");
      setOrder((o) => o ? { ...o, status: newStatus, notes } : null);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const res = await fetch(
        `/api/admin/download?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`,
        { headers: { "x-admin-key": sessionStorage.getItem("adminKey") || "" } }
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  if (!isAuth || loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-gray-800 text-xl">Order {order.orderId}</h1>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold capitalize ${STATUS_COLORS[order.status] || ""}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package size={16} className="text-amber-600" /> Order Items
              </h2>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-amber-100 shrink-0">
                    <Image src={item.finalImageUrl || item.productImage} alt={item.productName} fill className="object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} · {formatPrice(item.price)} each</p>
                    <p className="text-sm font-bold text-[#3b1c0c] mt-0.5">Total: {formatPrice(item.price * item.quantity)}</p>

                    {/* Download buttons */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {/* Original uploaded image — B2 URL */}
                      {item.customImageUrl && item.customImageUrl.startsWith("http") ? (
                        <button
                          onClick={() => downloadImage(item.customImageUrl!, `${order.orderId}-original-upload.jpg`)}
                          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border border-blue-200"
                        >
                          <Download size={12} /> Original Upload
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No original image</span>
                      )}

                      {/* Final composite design — B2 URL or base64 */}
                      {item.finalImageUrl && item.finalImageUrl.length > 0 ? (
                        <button
                          onClick={() => downloadImage(item.finalImageUrl!, `${order.orderId}-final-design.png`)}
                          className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border border-green-200"
                        >
                          <Download size={12} /> Final Design
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No final design</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4 flex justify-between text-base font-bold text-[#3b1c0c]">
                <span>Order Total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 mb-4">Update Order Status</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={updatingStatus || order.status === s}
                    onClick={() => updateStatus(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${order.status === s ? "bg-amber-600 text-white border-amber-600" : "bg-white border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-700 disabled:opacity-50"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 resize-none"
                  placeholder="Add notes about this order (tracking, issues, etc.)"
                />
                <button
                  onClick={() => updateStatus(order.status)}
                  disabled={updatingStatus}
                  className="mt-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Customer */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <User size={16} className="text-amber-600" /> Customer
              </h2>
              <p className="font-semibold text-gray-800">{order.userName}</p>
              <p className="text-sm text-gray-500">{order.userEmail}</p>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-amber-600" /> Shipping Address
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>PIN: {order.shippingAddress.pincode}</p>
                <p className="mt-2 font-medium">📞 {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 mb-3">Payment</h2>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">COD</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold capitalize ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2 font-bold">
                <span>Amount</span>
                <span className="text-[#3b1c0c]">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
