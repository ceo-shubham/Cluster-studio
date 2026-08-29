"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatDate, STATUS_COLORS } from "@/lib/utils";
import { Package, LogOut, RefreshCw, TrendingUp, ShoppingBag, Clock, CheckCheck } from "lucide-react";

interface AdminOrder {
  orderId: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { productName: string; quantity: number }[];
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  delivered: number;
  revenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, processing: 0, delivered: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isAuth, setIsAuth] = useState(false);

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
      setOrders(data.orders || []);
      // Calculate stats
      const ords: AdminOrder[] = data.orders || [];
      setStats({
        total: ords.length,
        pending: ords.filter((o) => o.status === "pending").length,
        processing: ords.filter((o) => ["confirmed", "processing"].includes(o.status)).length,
        delivered: ords.filter((o) => o.status === "delivered").length,
        revenue: ords.reduce((s, o) => s + o.totalAmount, 0),
      });
    } catch {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminKey");
    router.push("/admin/login");
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <div className="bg-[#1a0a03] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center">
            <Package size={16} />
          </div>
          <div>
            <span className="font-bold text-amber-400">Cluster Studio</span>
            <span className="text-gray-400 text-sm ml-2">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={loadOrders} className="flex items-center gap-1 text-gray-300 hover:text-white text-sm transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition-colors">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { label: "Total Orders", value: stats.total, icon: <ShoppingBag size={16} />, color: "bg-blue-50 text-blue-600" },
            { label: "Pending", value: stats.pending, icon: <Clock size={16} />, color: "bg-yellow-50 text-yellow-600" },
            { label: "Processing", value: stats.processing, icon: <Package size={16} />, color: "bg-purple-50 text-purple-600" },
            { label: "Revenue", value: formatPrice(stats.revenue), icon: <TrendingUp size={16} />, color: "bg-green-50 text-green-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                {s.icon}
              </div>
              <div className="text-lg font-bold text-gray-800">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <CheckCheck size={18} className="text-amber-600" /> All Orders
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${filter === s ? "bg-amber-600 text-white border-amber-600" : "bg-white text-gray-600 border-gray-200 hover:border-amber-400"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Order ID</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Customer</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Items</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Amount</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Date</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.orderId} className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-gray-700">{order.orderId}</td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-800">{order.userName}</div>
                        <div className="text-xs text-gray-500">{order.userEmail}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 max-w-xs">
                        <span className="line-clamp-2 text-xs">
                          {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-[#3b1c0c]">{formatPrice(order.totalAmount)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/orders/${order.orderId}`}
                          className="text-amber-600 hover:text-amber-800 font-medium text-xs hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
