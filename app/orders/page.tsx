"use client";
import { useEffect, useState } from "react";
import { IS_CLERK_CONFIGURED, noAuthState, type SafeAuthState } from "@/lib/useClerkAuth";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { formatPrice, formatDate, STATUS_COLORS } from "@/lib/utils";
import { Package, ChevronRight, Lock, User } from "lucide-react";

interface OrderSummary {
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { productName: string; quantity: number }[];
}

function OrdersWithClerk() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  // Pass auth directly — don't re-wrap into OrdersInner state
  const auth: SafeAuthState = {
    isLoaded: !!isLoaded,
    isSignedIn: !!isSignedIn,
    userId: userId ?? null,
    userEmail: user?.emailAddresses?.[0]?.emailAddress ?? null,
    userName: user?.fullName ?? null,
    openSignIn: () => openSignIn({ fallbackRedirectUrl: window.location.href }),
    signOut: () => {},
  };

  return <OrdersInner auth={auth} />;
}

function OrdersInner({ auth }: { auth: SafeAuthState }) {
  const { isLoaded, isSignedIn, userId, openSignIn } = auth;
  const [orders, setOrders] = useState<OrderSummary[] | null>(null); // null = not fetched yet

  useEffect(() => {
    // Start fetch as soon as userId is available — don't wait for a separate loading state
    if (!isLoaded || !isSignedIn || !userId) return;

    fetch(`/api/orders?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));
  }, [isLoaded, isSignedIn, userId]);

  // Not signed in (and Clerk is done loading)
  if (isLoaded && !isSignedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-[#3b1c0c] mb-2">Sign in to view Orders</h2>
          <p className="text-gray-500 text-sm mb-6">Track your orders and view order history.</p>
          <button
            onClick={openSignIn}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            <User size={18} /> Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  // Skeleton loader while orders are being fetched
  if (orders === null) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Package className="text-amber-600" size={26} />
          <h1 className="text-2xl font-bold text-[#3b1c0c]">My Orders</h1>
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-amber-100 p-5 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-100 rounded w-48" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
                <div className="h-5 bg-gray-200 rounded w-16 ml-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="text-amber-600" size={26} />
        <h1 className="text-2xl font-bold text-[#3b1c0c]">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={56} className="text-amber-200 mx-auto mb-4" />
          <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
          <Link href="/#products"
            className="mt-4 inline-block bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link key={order.orderId} href={`/orders/${order.orderId}`}
              className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5 flex items-center justify-between hover:border-amber-300 hover:shadow-md transition-all">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-gray-800 text-sm">{order.orderId}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}
                </p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="font-bold text-[#3b1c0c]">{formatPrice(order.totalAmount)}</span>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  if (IS_CLERK_CONFIGURED) return <OrdersWithClerk />;
  return <OrdersInner auth={noAuthState} />;
}
