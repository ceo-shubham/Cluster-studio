"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatDate } from "@/lib/utils";
import { 
  Package, LogOut, RefreshCw, TrendingUp, ShoppingBag, 
  Clock, CheckCheck, Search, ExternalLink, Copy, Check, 
  Truck, XCircle, AlertCircle, Sparkles, Eye, Download,
  Archive, ArrowRight, User, Phone, MapPin
} from "lucide-react";
import toast from "react-hot-toast";

interface AdminOrder {
  orderId: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { 
    productName: string; 
    quantity: number; 
    price?: number;
    productImage?: string;
    customImageUrl?: string;
    finalImageUrl?: string;
  }[];
  shippingAddress?: { name?: string; phone?: string; line1?: string; line2?: string; city?: string; state?: string; pincode?: string };
  notes?: string;
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  delivered: number;
  cancelled: number;
  activeRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<Stats>({ 
    total: 0, 
    pending: 0, 
    processing: 0, 
    delivered: 0, 
    cancelled: 0, 
    activeRevenue: 0 
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "delivered">("active");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveredSearch, setDeliveredSearch] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [quickInspectOrder, setQuickInspectOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuth(true);
      loadOrders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-key": sessionStorage.getItem("adminKey") || "" },
      });
      const data = await res.json();
      let ords: AdminOrder[] = data.orders || [];

      // Merge with client localStorage orders so newly placed orders in browser are never lost
      try {
        const localSaved: AdminOrder[] = JSON.parse(localStorage.getItem("cluster_studio_orders") || "[]");
        for (const localOrd of localSaved) {
          if (!ords.some(o => o.orderId === localOrd.orderId)) {
            ords.unshift(localOrd);
          }
        }
      } catch (e) {}

      setOrders(ords);

      // Exclude cancelled orders from real Revenue calculation
      const nonCancelledOrders = ords.filter((o) => o.status !== "cancelled");
      const activeRev = nonCancelledOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        total: ords.length,
        pending: ords.filter((o) => o.status === "pending").length,
        processing: ords.filter((o) => ["confirmed", "processing", "shipped"].includes(o.status)).length,
        delivered: ords.filter((o) => o.status === "delivered").length,
        cancelled: ords.filter((o) => o.status === "cancelled").length,
        activeRevenue: activeRev,
      });
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminKey");
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success(`Copied Order ID: ${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter Active / Queue Orders
  const activeOrders = useMemo(() => {
    return orders.filter((o) => {
      // If on active tab, exclude delivered unless explicitly filtered
      if (activeTab === "active" && o.status === "delivered") return false;

      // Status filter
      if (filter !== "all" && o.status !== filter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = o.orderId?.toLowerCase().includes(q);
        const matchesName = o.userName?.toLowerCase().includes(q);
        const matchesEmail = o.userEmail?.toLowerCase().includes(q);
        const matchesPhone = o.shippingAddress?.phone?.toLowerCase().includes(q);
        const matchesItem = o.items?.some((i) => i.productName?.toLowerCase().includes(q));
        return matchesId || matchesName || matchesEmail || matchesPhone || matchesItem;
      }
      return true;
    });
  }, [orders, filter, searchQuery, activeTab]);

  // Filter Delivered Orders Archive
  const deliveredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (o.status !== "delivered") return false;

      if (deliveredSearch.trim()) {
        const q = deliveredSearch.toLowerCase();
        const matchesId = o.orderId?.toLowerCase().includes(q);
        const matchesName = o.userName?.toLowerCase().includes(q);
        const matchesEmail = o.userEmail?.toLowerCase().includes(q);
        const matchesPhone = o.shippingAddress?.phone?.toLowerCase().includes(q);
        const matchesItem = o.items?.some((i) => i.productName?.toLowerCase().includes(q));
        return matchesId || matchesName || matchesEmail || matchesPhone || matchesItem;
      }
      return true;
    });
  }, [orders, deliveredSearch]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200 line-through opacity-80";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleManageClick = (order: AdminOrder) => {
    try {
      sessionStorage.setItem(`currentAdminOrder_${order.orderId}`, JSON.stringify(order));
      sessionStorage.setItem("currentAdminOrder", JSON.stringify(order));
    } catch (e) {}
  };

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* ── Quick Inspect Modal for Delivered & Active Orders ── */}
      {quickInspectOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Delivered Order Archive</span>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Order #{quickInspectOrder.orderId}</h3>
              </div>
              <button
                onClick={() => setQuickInspectOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Customer Details</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{quickInspectOrder.userName}</p>
                <p className="text-slate-600">{quickInspectOrder.userEmail}</p>
                {quickInspectOrder.shippingAddress?.phone && (
                  <p className="font-bold text-slate-800 mt-1">📞 {quickInspectOrder.shippingAddress.phone}</p>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Delivery Address</span>
                <p className="font-medium text-slate-800 mt-0.5">{quickInspectOrder.shippingAddress?.line1}</p>
                <p className="text-slate-600">
                  {quickInspectOrder.shippingAddress?.city}, {quickInspectOrder.shippingAddress?.state} - {quickInspectOrder.shippingAddress?.pincode}
                </p>
                <p className="text-emerald-700 font-bold text-[11px] mt-1">✓ Successfully Delivered</p>
              </div>
            </div>

            {/* Product & Artwork Info */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Ordered Products &amp; Mockups</span>
              {quickInspectOrder.items?.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.finalImageUrl || item.productImage || item.customImageUrl} alt={item.productName} className="w-full h-full object-contain p-1" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.productName}</h4>
                      <span className="text-[11px] text-slate-500">Qty: {item.quantity} • Subtotal: {formatPrice((item.price || 0) * item.quantity)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/orders/${quickInspectOrder.orderId}`}
                      onClick={() => handleManageClick(quickInspectOrder)}
                      className="bg-[#670D1F] hover:bg-[#520817] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <span>Full Manage</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer buttons */}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-extrabold text-[#670D1F]">Total: {formatPrice(quickInspectOrder.totalAmount)}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setQuickInspectOrder(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Close
                </button>
                <Link
                  href={`/admin/orders/${quickInspectOrder.orderId}`}
                  onClick={() => handleManageClick(quickInspectOrder)}
                  className="px-4 py-2 rounded-xl bg-[#670D1F] text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-[#520817] transition-colors"
                >
                  <span>Open Full Order Page</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Header ── */}
      <header className="bg-[#670D1F] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white shadow-sm border border-amber-300">
              <Image src="/logo.png" alt="Cluster Studio" fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-white tracking-tight">CLUSTER STUDIO</span>
                <span className="bg-amber-400 text-[#670D1F] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 text-xs font-semibold text-rose-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span>Live Store</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={loadOrders}
              className={`flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-xl transition-all shadow-xs ${
                loading ? "animate-pulse" : ""
              }`}
              title="Refresh Orders"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-100 bg-rose-950/50 hover:bg-rose-900 border border-rose-800/60 px-3 py-1.5 rounded-xl transition-colors shadow-xs"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Title Header & Main Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              Orders Management
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Production queue, live sublimation assets, and completed delivery archive.
            </p>
          </div>

          {/* Section Switcher Tabs */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl gap-1 border border-slate-300/60 shrink-0">
            <button
              onClick={() => { setActiveTab("active"); setFilter("all"); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "active"
                  ? "bg-[#670D1F] text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Package size={14} />
              <span>Active Orders Queue ({orders.filter(o => o.status !== "delivered").length})</span>
            </button>

            <button
              onClick={() => setActiveTab("delivered")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "delivered"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <CheckCheck size={15} />
              <span>Delivered Archive ({stats.delivered})</span>
            </button>
          </div>
        </div>

        {/* ── KPI Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Orders</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{stats.total}</span>
              <span className="text-[10px] text-slate-400">All time received</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <ShoppingBag size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Pending Action</span>
              <span className="text-2xl font-extrabold text-amber-900 mt-1 block">{stats.pending}</span>
              <span className="text-[10px] text-amber-600">Needs confirmation</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">In Production</span>
              <span className="text-2xl font-extrabold text-purple-900 mt-1 block">{stats.processing}</span>
              <span className="text-[10px] text-purple-600">Printing &amp; Shipped</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab("delivered")} 
            className="bg-white hover:bg-emerald-50/50 cursor-pointer transition-colors rounded-2xl p-4 shadow-sm border border-emerald-200/80 flex items-center justify-between group"
          >
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block group-hover:underline">Delivered Archive</span>
              <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">{stats.delivered}</span>
              <span className="text-[10px] text-emerald-600">Click to view archive →</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckCheck size={20} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#670D1F] to-[#450713] text-white rounded-2xl p-4 shadow-md col-span-2 lg:col-span-1 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                <span>Active Revenue</span>
                <Sparkles size={12} />
              </div>
              <span className="text-2xl font-extrabold text-white mt-1 block">
                {formatPrice(stats.activeRevenue)}
              </span>
              <span className="text-[10px] text-rose-200">
                Live fulfilled revenue
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 text-amber-300 flex items-center justify-center shrink-0">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: ACTIVE ORDERS QUEUE                                       */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === "active" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            
            {/* Controls Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search active orders by ID, name, phone, product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl pl-9 pr-8 py-2.5 outline-none border border-slate-200 focus:border-[#670D1F] focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
                  Showing <strong className="text-slate-900">{activeOrders.length}</strong> active orders
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {[
                  { id: "all", label: "All Active", count: orders.filter(o => o.status !== "delivered").length },
                  { id: "pending", label: "Pending", count: stats.pending },
                  { id: "confirmed", label: "Confirmed", count: orders.filter((o) => o.status === "confirmed").length },
                  { id: "processing", label: "Processing", count: orders.filter((o) => o.status === "processing").length },
                  { id: "shipped", label: "Shipped", count: orders.filter((o) => o.status === "shipped").length },
                  { id: "cancelled", label: "Cancelled", count: stats.cancelled },
                ].map((tab) => {
                  const isActive = filter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[#670D1F] text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          isActive ? "bg-white/20 text-white" : "bg-white text-slate-700 shadow-xs"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Table Container */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw size={24} className="animate-spin text-[#670D1F] mx-auto" />
                <p className="text-xs font-semibold text-slate-500">Loading active orders...</p>
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="py-20 text-center space-y-3 px-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <AlertCircle size={24} />
                </div>
                <h3 className="font-bold text-sm text-slate-800">No Active Orders Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `No active orders matching "${searchQuery}".`
                    : `All active orders in "${filter}" status have been processed or moved to Delivered Archive.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4 sm:px-6">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Ordered Products</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {activeOrders.map((order) => {
                      const isCancelled = order.status === "cancelled";
                      return (
                        <tr key={order.orderId} className={`hover:bg-slate-50/80 transition-colors ${isCancelled ? "bg-slate-50/40" : ""}`}>
                          <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                                {order.orderId}
                              </span>
                              <button
                                onClick={(e) => handleCopyId(order.orderId, e)}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                title="Copy Order ID"
                              >
                                {copiedId === order.orderId ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                              </button>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-900">{order.userName || "Customer"}</div>
                            <div className="text-[11px] text-slate-500">{order.userEmail}</div>
                            {order.shippingAddress?.phone && (
                              <div className="text-[11px] text-slate-400 mt-0.5">📞 {order.shippingAddress.phone}</div>
                            )}
                          </td>

                          <td className="py-4 px-4 max-w-xs">
                            <div className="space-y-1">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="text-slate-700 truncate font-medium flex items-center gap-1">
                                  <span className="text-slate-400">•</span>
                                  <span className="truncate">{item.productName}</span>
                                  <span className="text-slate-400 text-[11px]">×{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className={`font-extrabold ${isCancelled ? "text-slate-400 line-through" : "text-[#670D1F] text-sm"}`}>
                              {formatPrice(order.totalAmount)}
                            </div>
                            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                              {order.paymentStatus || "COD"}
                            </span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize ${getStatusBadge(order.status)}`}>
                              {order.status === "shipped" && <Truck size={12} />}
                              {order.status === "cancelled" && <XCircle size={12} />}
                              {order.status === "pending" && <Clock size={12} />}
                              <span>{order.status}</span>
                            </span>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                            {formatDate(order.createdAt)}
                          </td>

                          <td className="py-4 px-4 text-right pr-6 whitespace-nowrap">
                            <Link
                              href={`/admin/orders/${order.orderId}`}
                              onClick={() => handleManageClick(order)}
                              className="inline-flex items-center gap-1 bg-[#670D1F] hover:bg-[#520817] text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs"
                            >
                              <span>Manage</span>
                              <span>→</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: DELIVERED ORDERS ARCHIVE & SEARCH BAR                     */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === "delivered" && (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200/80 overflow-hidden space-y-4">
            
            {/* Dedicated Delivered Search Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white border-b border-emerald-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCheck size={20} className="text-emerald-700" />
                    <h2 className="font-serif font-bold text-slate-900 text-lg sm:text-xl">Delivered Orders Archive</h2>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                      {deliveredOrders.length} Completed
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Enter an Order ID, customer name, or phone number below to instantly pull up product info and customer records.
                  </p>
                </div>

                {/* Delivered Search Input */}
                <div className="relative w-full md:w-80">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <input
                    type="text"
                    placeholder="Enter Order ID (e.g. CS-419820)..."
                    value={deliveredSearch}
                    onChange={(e) => setDeliveredSearch(e.target.value)}
                    autoFocus
                    className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs rounded-xl pl-9 pr-8 py-2.5 outline-none border-2 border-emerald-300 focus:border-emerald-600 shadow-sm transition-all"
                  />
                  {deliveredSearch && (
                    <button
                      onClick={() => setDeliveredSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Delivered Orders Grid / Table */}
            {deliveredOrders.length === 0 ? (
              <div className="py-16 text-center space-y-3 px-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCheck size={24} />
                </div>
                <h3 className="font-bold text-sm text-slate-800">No Delivered Orders Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {deliveredSearch
                    ? `No delivered order matches "${deliveredSearch}".`
                    : "No orders have been marked as delivered yet. As soon as orders are marked Delivered, they will automatically appear here."}
                </p>
              </div>
            ) : (
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliveredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded">
                            {order.orderId}
                          </span>
                          <button
                            onClick={(e) => handleCopyId(order.orderId, e)}
                            className="text-slate-400 hover:text-slate-600"
                            title="Copy ID"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          ✓ DELIVERED
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="pt-2 text-xs space-y-0.5">
                        <div className="font-bold text-slate-900">{order.userName}</div>
                        <div className="text-[11px] text-slate-500">{order.userEmail}</div>
                        {order.shippingAddress?.phone && (
                          <div className="text-[11px] font-semibold text-slate-700">📞 {order.shippingAddress.phone}</div>
                        )}
                      </div>

                      {/* Products Summary */}
                      <div className="pt-2.5 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Products Info</span>
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.finalImageUrl || item.productImage || item.customImageUrl} alt={item.productName} className="w-full h-full object-contain p-0.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-slate-800 truncate">{item.productName}</p>
                              <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#670D1F]">{formatPrice(order.totalAmount)}</span>
                      
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setQuickInspectOrder(order)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Eye size={12} />
                          <span>Quick Info</span>
                        </button>

                        <Link
                          href={`/admin/orders/${order.orderId}`}
                          onClick={() => handleManageClick(order)}
                          className="bg-[#670D1F] hover:bg-[#520817] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <span>Manage</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
