"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatDate } from "@/lib/utils";
import { 
  Package, LogOut, RefreshCw, TrendingUp, ShoppingBag, 
  Clock, CheckCheck, Search, ExternalLink, Copy, Check, 
  Truck, XCircle, AlertCircle, Sparkles
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
  items: { productName: string; quantity: number; productImage?: string }[];
  shippingAddress?: { phone?: string; city?: string; state?: string };
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
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      const ords: AdminOrder[] = data.orders || [];
      setOrders(ords);

      // Exclude cancelled orders from real Revenue calculation
      const nonCancelledOrders = ords.filter((o) => o.status !== "cancelled");
      const activeRev = nonCancelledOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        total: ords.length,
        pending: ords.filter((o) => o.status === "pending").length,
        processing: ords.filter((o) => ["confirmed", "processing"].includes(o.status)).length,
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

  // Filter & search orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // 1. Status Filter
      if (filter !== "all" && o.status !== filter) {
        return false;
      }
      // 2. Search Query
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
  }, [orders, filter, searchQuery]);

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

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
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
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              Orders Dashboard
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage custom print orders, review artwork uploads, and track fulfillment status.
            </p>
          </div>
        </div>

        {/* ── KPI Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Total Orders */}
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

          {/* Pending */}
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

          {/* Processing */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">Processing / Print</span>
              <span className="text-2xl font-extrabold text-purple-900 mt-1 block">{stats.processing}</span>
              <span className="text-[10px] text-purple-600">In manufacturing</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
          </div>

          {/* Delivered */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Delivered</span>
              <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">{stats.delivered}</span>
              <span className="text-[10px] text-emerald-600">Successfully shipped</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCheck size={20} />
            </div>
          </div>

          {/* Net Revenue (Excludes Cancelled Orders) */}
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
                Excludes {stats.cancelled} cancelled {stats.cancelled === 1 ? "order" : "orders"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 text-amber-300 flex items-center justify-center shrink-0">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        {/* ── Orders Management Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          
          {/* Controls Bar: Search & Status Filters */}
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, customer, email, phone..."
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

              {/* Quick Summary Counter */}
              <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
                Showing <strong className="text-slate-900">{filteredOrders.length}</strong> of {orders.length} orders
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { id: "all", label: "All Orders", count: orders.length },
                { id: "pending", label: "Pending", count: stats.pending },
                { id: "confirmed", label: "Confirmed", count: orders.filter((o) => o.status === "confirmed").length },
                { id: "processing", label: "Processing", count: orders.filter((o) => o.status === "processing").length },
                { id: "shipped", label: "Shipped", count: orders.filter((o) => o.status === "shipped").length },
                { id: "delivered", label: "Delivered", count: stats.delivered },
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

          {/* ── Table Container ── */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw size={24} className="animate-spin text-[#670D1F] mx-auto" />
              <p className="text-xs font-semibold text-slate-500">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center space-y-3 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <h3 className="font-bold text-sm text-slate-800">No Orders Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? `No orders matching "${searchQuery}" in ${filter === "all" ? "any status" : filter}.`
                  : `There are currently no orders in "${filter}" status.`}
              </p>
              {(searchQuery || filter !== "all") && (
                <button
                  onClick={() => {
                    setFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-2 text-xs font-bold text-[#670D1F] hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">Purchased Items</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Order Date</th>
                    <th className="py-3.5 px-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredOrders.map((order) => {
                    const isCancelled = order.status === "cancelled";
                    return (
                      <tr
                        key={order.orderId}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isCancelled ? "bg-slate-50/40" : ""
                        }`}
                      >
                        {/* Order ID */}
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
                              {copiedId === order.orderId ? (
                                <Check size={13} className="text-emerald-600" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900">{order.userName || "Customer"}</div>
                          <div className="text-[11px] text-slate-500">{order.userEmail}</div>
                          {order.shippingAddress?.phone && (
                            <div className="text-[11px] text-slate-400 mt-0.5">📞 {order.shippingAddress.phone}</div>
                          )}
                        </td>

                        {/* Items */}
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

                        {/* Amount */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className={`font-extrabold ${isCancelled ? "text-slate-400 line-through" : "text-[#670D1F] text-sm"}`}>
                            {formatPrice(order.totalAmount)}
                          </div>
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                            {order.paymentStatus || "COD"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status === "delivered" && <CheckCheck size={12} />}
                            {order.status === "shipped" && <Truck size={12} />}
                            {order.status === "cancelled" && <XCircle size={12} />}
                            {order.status === "pending" && <Clock size={12} />}
                            <span>{order.status}</span>
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                          {formatDate(order.createdAt)}
                        </td>

                        {/* Action */}
                        <td className="py-4 px-4 text-right pr-6 whitespace-nowrap">
                          <Link
                            href={`/admin/orders/${order.orderId}`}
                            onClick={() => {
                              try {
                                sessionStorage.setItem(`currentAdminOrder_${order.orderId}`, JSON.stringify(order));
                                sessionStorage.setItem("currentAdminOrder", JSON.stringify(order));
                              } catch (e) {}
                            }}
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

      </main>
    </div>
  );
}

