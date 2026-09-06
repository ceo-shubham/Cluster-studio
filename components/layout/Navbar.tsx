"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, ShoppingBag, Menu, X, Heart, 
  ChevronRight, Phone, Sparkles, Truck, Package, ShieldCheck
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { products } from "@/lib/products";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import BrandLogo from "./BrandLogo";
import NavbarAuthSection from "./NavbarAuthSection";

const CATEGORIES = [
  { name: "Mugs", slug: "mugs", icon: "☕" },
  { name: "Bottles", slug: "bottles", icon: "🍼" },
  { name: "T-Shirts", slug: "clothing", icon: "👕" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const totalCartItems = useCartStore((s) => s.totalItems());
  const wishlistItems = useWishlistStore((s) => s.items);
  const openWishlist = useWishlistStore((s) => s.openWishlist);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Search filter
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matched = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.giftTags?.some((t) => t.toLowerCase().includes(q))
      );
      setSearchResults(matched.slice(0, 5));
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/#products`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EFE7DC] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* ── Left Side: Hamburger (Mobile) / Nav Links (Desktop) ── */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 text-[#221518] hover:text-[#5E1224] transition-colors rounded-xl focus:outline-hidden"
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} strokeWidth={2} />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#4A3B3E]">
              <Link
                href="/"
                className={`transition-colors hover:text-[#5E1224] ${
                  pathname === "/" ? "text-[#5E1224] font-bold" : ""
                }`}
              >
                Home
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="transition-colors hover:text-[#5E1224]"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/orders"
                className="transition-colors hover:text-[#5E1224]"
              >
                Track Order
              </Link>
            </nav>
          </div>

          {/* ── Center: Brand Logo ── */}
          <div className="flex-1 flex justify-center lg:flex-initial">
            <BrandLogo variant="dark" size="md" />
          </div>

          {/* ── Right Side: Search, Wishlist, User & Cart ── */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Trigger Button */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-[#221518] hover:text-[#5E1224] transition-colors rounded-xl"
                aria-label="Search products"
              >
                <Search size={22} strokeWidth={2} />
              </button>

              {/* Search Dropdown / Popup */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#EFE7DC] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      placeholder="Search mugs, bottles, t-shirts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-[#FAF7F2] text-xs text-[#221518] rounded-xl pl-9 pr-8 py-2.5 outline-none border border-[#EFE7DC] focus:border-[#5E1224]"
                    />
                    <Search size={16} className="text-[#8C7A7E] absolute left-3 top-3" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-[#8C7A7E] hover:text-[#221518] absolute right-3 top-3 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </form>

                  {searchResults.length > 0 && (
                    <div className="mt-3 divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {searchResults.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 py-2 hover:bg-[#FAF7F2] px-2 rounded-lg transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain p-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                            <p className="text-[10px] text-[#5E1224] font-semibold">{p.category}</p>
                          </div>
                          <span className="text-xs font-extrabold text-[#5E1224]">{formatPrice(p.price)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Button (Desktop) */}
            <button
              onClick={openWishlist}
              className="hidden sm:flex items-center p-2 text-[#221518] hover:text-[#5E1224] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={22} strokeWidth={2} />
              {wishlistItems.length > 0 && (
                <span className="absolute 1 top-1 right-1 bg-[#5E1224] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Account / Login */}
            <div className="hidden sm:block">
              <NavbarAuthSection />
            </div>

            {/* Cart Button with Maroon Count Badge */}
            <Link
              href="/cart"
              className="p-2 text-[#221518] hover:text-[#5E1224] transition-colors relative flex items-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag size={22} strokeWidth={2} />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#5E1224] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartItems > 9 ? "9+" : totalCartItems}
                </span>
              )}
            </Link>
          </div>

        </div>
      </header>

      {/* ── Mobile Slide-Over Drawer Navigation ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FFFDF9] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#EFE7DC] flex items-center justify-between">
              <BrandLogo variant="dark" size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-[#F5ECE1] text-[#221518] hover:bg-[#EFE7DC]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Categories */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A7E] mb-3">
                  Shop By Category
                </p>
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#221518] hover:bg-[#F5ECE1] transition-colors"
                  >
                    <span>🏠 All Products &amp; Best Sellers</span>
                    <ChevronRight size={14} className="text-[#8C7A7E]" />
                  </Link>

                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#221518] hover:bg-[#F5ECE1] transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-sm">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                      <ChevronRight size={14} className="text-[#8C7A7E]" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Services */}
              <div className="pt-2 border-t border-[#EFE7DC]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A7E] mb-3">
                  Customer Assistance
                </p>
                <div className="space-y-1">
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#221518] hover:bg-[#F5ECE1] transition-colors"
                  >
                    <Package size={15} className="text-[#5E1224]" />
                    <span>Track Your Orders</span>
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); openWishlist(); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#221518] hover:bg-[#F5ECE1] transition-colors text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <Heart size={15} className="text-[#5E1224]" />
                      <span>My Wishlist</span>
                    </span>
                    <span className="text-[10px] bg-[#5E1224] text-white px-2 py-0.5 rounded-full font-bold">
                      {wishlistItems.length}
                    </span>
                  </button>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#221518] hover:bg-[#F5ECE1] transition-colors"
                  >
                    <Phone size={15} className="text-[#5E1224]" />
                    <span>Contact Support</span>
                  </Link>
                </div>
              </div>

              {/* Mobile Auth Button */}
              <div className="pt-2 border-t border-[#EFE7DC]">
                <NavbarAuthSection />
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#FBF8F4] border-t border-[#EFE7DC] text-center">
              <p className="text-[10px] text-[#8C7A7E] font-medium">
                Made for you, loved by all. ❤️
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
