"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { useCartStore } from "@/store/cartStore";
import { User, Package, LogOut } from "lucide-react";

export default function ClerkNavButtons() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { openSignIn, signOut } = useClerk();
  const { clearCart, saveCartForUser, loadCartForUser } = useCartStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Track login/logout transitions for cart restore
  const prevSignedIn = useRef<boolean | null>(null);
  useEffect(() => {
    if (!isLoaded) return;
    const wasSignedIn = prevSignedIn.current;
    const nowSignedIn = !!isSignedIn;
    if (wasSignedIn === false && nowSignedIn && userId) loadCartForUser(userId);
    if (wasSignedIn === true && !nowSignedIn) clearCart();
    if (wasSignedIn === null && nowSignedIn && userId) loadCartForUser(userId);
    prevSignedIn.current = nowSignedIn;
  }, [isLoaded, isSignedIn, userId, loadCartForUser, clearCart]);

  const handleSignOut = () => {
    setDropdownOpen(false);
    if (userId) saveCartForUser(userId);
    clearCart();
    signOut({ redirectUrl: "/" });
  };

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-amber-800 animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Avatar button — click to toggle on all devices */}
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 rounded-full pl-1 pr-3 py-1 transition-colors overflow-hidden"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden bg-amber-600 flex items-center justify-center shrink-0">
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <User size={14} className="text-white" />
            )}
          </div>
          <span className="text-white text-xs font-medium hidden sm:block max-w-[80px] truncate">
            {user?.firstName || "Account"}
          </span>
        </button>

        {/* Dropdown — click-based, works on mobile too */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-800 truncate">{user?.fullName || "User"}</p>
              <p className="text-xs text-gray-400 truncate">
                {user?.emailAddresses?.[0]?.emailAddress}
              </p>
            </div>
            <a
              href="/orders"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
            >
              <Package size={15} /> My Orders
            </a>
            <button
              onClick={handleSignOut}
              className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => openSignIn({ fallbackRedirectUrl: "/" })}
      className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
    >
      <User size={15} /> Login
    </button>
  );
}
