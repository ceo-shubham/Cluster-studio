"use client";
import { useEffect, useState, useRef } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";

declare global {
  interface Window {
    Clerk?: any;
  }
}

const CLERK_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_Z2xvd2luZy10YWRwb2xlLTc4NzkuY2xlcmsuYWNjb3VudHMuZGV2JA";

interface ClerkNavButtonsProps {
  variant?: "desktop" | "drawer";
}

export default function ClerkNavButtons({ variant = "desktop" }: ClerkNavButtonsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load Clerk JS client for 100% reliable client-side auth
    if (typeof window === "undefined") return;

    const initClerk = async () => {
      try {
        if (!window.Clerk) {
          const script = document.createElement("script");
          script.setAttribute("data-clerk-publishable-key", CLERK_PUBLISHABLE_KEY);
          script.async = true;
          script.src = `https://glowing-tadpole-7879.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js`;
          script.crossOrigin = "anonymous";
          script.onload = async () => {
            if (window.Clerk) {
              await window.Clerk.load();
              setIsLoaded(true);
              if (window.Clerk.user) {
                setUser(window.Clerk.user);
              }
              window.Clerk.addListener((payload: any) => {
                setUser(payload.user || null);
              });
            }
          };
          document.body.appendChild(script);
        } else {
          await window.Clerk.load();
          setIsLoaded(true);
          if (window.Clerk.user) {
            setUser(window.Clerk.user);
          }
          window.Clerk.addListener((payload: any) => {
            setUser(payload.user || null);
          });
        }
      } catch (err) {
        console.error("Clerk init error:", err);
        setIsLoaded(true);
      }
    };

    initClerk();
  }, []);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Clerk && window.Clerk.openSignIn) {
      window.Clerk.openSignIn({
        afterSignInUrl: "/",
        afterSignUpUrl: "/",
      });
    } else {
      window.location.href = `https://glowing-tadpole-7879.clerk.accounts.dev/sign-in?redirect_url=${encodeURIComponent(
        window.location.href
      )}`;
    }
  };

  const handleOpenProfile = () => {
    setMenuOpen(false);
    if (window.Clerk && window.Clerk.openUserProfile) {
      window.Clerk.openUserProfile();
    }
  };

  const handleSignOut = async () => {
    setMenuOpen(false);
    if (window.Clerk && window.Clerk.signOut) {
      await window.Clerk.signOut();
      setUser(null);
    }
  };

  // Signed In User State
  if (user) {
    const displayName =
      user.firstName || user.fullName || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "My Account";
    const avatarUrl = user.imageUrl;

    // DRAWER VARIANT: Direct Integrated Card
    if (variant === "drawer") {
      return (
        <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#EFE7DC] space-y-3 shadow-2xs">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-9 h-9 rounded-full object-cover border-2 border-[#5E1224]" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#5E1224] text-white flex items-center justify-center font-bold text-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#221518] truncate">{displayName}</p>
              <p className="text-[10px] text-[#8C7A7E] truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-[#EFE7DC]">
            <button
              onClick={handleOpenProfile}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#221518] hover:bg-white transition-colors text-left cursor-pointer"
            >
              <User size={13} className="text-[#5E1224]" />
              <span>Manage Profile</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      );
    }

    // DESKTOP VARIANT: Dropdown Header Button
    return (
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 bg-[#FAF7F2] hover:bg-[#F5ECE1] text-[#221518] px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs border border-[#EFE7DC] cursor-pointer"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName} className="w-5 h-5 rounded-full object-cover border border-[#5E1224]" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#5E1224] text-white flex items-center justify-center font-bold text-[10px]">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="max-w-[90px] truncate">{displayName}</span>
          <ChevronDown size={12} className={`transition-transform text-[#8C7A7E] ${menuOpen ? "rotate-180" : ""}`} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#EFE7DC] py-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-[#221518] truncate">{displayName}</p>
              <p className="text-[10px] text-[#8C7A7E] truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>

            <button
              onClick={handleOpenProfile}
              className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <User size={13} className="text-[#5E1224]" />
              <span>Manage Profile</span>
            </button>

            <a
              href="/orders"
              className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] flex items-center gap-2 transition-colors"
            >
              <span className="text-[#5E1224] text-xs">📦</span>
              <span>My Orders</span>
            </a>

            <div className="pt-1 border-t border-slate-100">
              <button
                onClick={handleSignOut}
                className="w-full px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Signed Out / Guest Login Button
  if (variant === "drawer") {
    return (
      <button
        onClick={handleOpenSignIn}
        className="w-full flex items-center justify-center gap-2 bg-[#5E1224] hover:bg-[#470A18] text-white px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
      >
        <User size={15} />
        <span>Login / Sign Up</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleOpenSignIn}
      className="flex items-center gap-1.5 bg-[#5E1224] hover:bg-[#470A18] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
    >
      <User size={14} />
      <span>Login</span>
    </button>
  );
}
