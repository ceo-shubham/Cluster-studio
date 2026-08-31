"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Search, Heart, ShoppingCart, Menu, X, ChevronDown, 
  Sparkles, Gift, Phone, ShieldCheck, Truck, ArrowRight 
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useGiftFinderStore } from "@/store/giftFinderStore";
import { products } from "@/lib/products";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import NavbarAuthSection from "./NavbarAuthSection";

export default function Navbar() {
  const router = useRouter();
  const totalCartItems = useCartStore((s) => s.totalItems());
  const wishlistItems = useWishlistStore((s) => s.items);
  const openWishlist = useWishlistStore((s) => s.openWishlist);
  const openGiftFinder = useGiftFinderStore((s) => s.openGiftFinder);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-50 shadow-md">
      {/* ── Top Main Maroon Bar ── */}
      <div className="bg-[#670D1F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 bg-white shadow-md border-2 border-amber-300/80 group-hover:border-amber-300 group-hover:scale-105 transition-all">
              <Image
                src="/logo.png"
                alt="Cluster Studio Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-white leading-none">
                CLUSTER <span className="text-amber-300 font-sans text-base sm:text-lg font-light">STUDIO</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-rose-200 font-semibold mt-0.5">
                Personalized Gifts
              </span>
            </div>
          </Link>

          {/* Central Search Bar (Desktop) */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search for mugs, bottles, gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setIsSearchOpen(true)}
                className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm rounded-full pl-5 pr-11 py-2.5 outline-none border border-transparent focus:border-amber-400 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#670D1F] text-amber-300 flex items-center justify-center hover:bg-[#520817] transition-colors"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </form>

            {/* Instant Search Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-gray-800">
                <div className="p-2 space-y-1">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-rose-50/70 transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                        <Image
                          src={product.cardImage || product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                        <p className="text-[11px] text-[#670D1F] font-semibold">{product.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-[#670D1F]">{formatPrice(product.price)}</span>
                        {product.mrp && (
                          <span className="block text-[10px] text-gray-400 line-through">
                            {formatPrice(product.mrp)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="bg-gray-50 px-4 py-2 text-center border-t border-gray-100">
                  <Link
                    href="/#products"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-xs font-bold text-[#670D1F] hover:underline"
                  >
                    View all matching products →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Utility Icons (Wishlist, Account, Cart) */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* Wishlist Button */}
            <button
              onClick={openWishlist}
              className="flex items-center gap-1.5 text-white/90 hover:text-amber-300 transition-colors group p-1 relative"
              aria-label="Wishlist"
            >
              <div className="relative">
                <Heart size={22} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-[#670D1F] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow">
                  {wishlistItems.length}
                </span>
              </div>
              <span className="hidden lg:inline text-xs font-medium text-white/90 group-hover:text-amber-300">
                Wishlist
              </span>
            </button>

            {/* Account / Login */}
            <div className="hidden sm:block">
              <NavbarAuthSection />
            </div>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-white/90 hover:text-amber-300 transition-colors group p-1"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-[#670D1F] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow">
                  {totalCartItems > 9 ? "9+" : totalCartItems}
                </span>
              </div>
              <span className="hidden lg:inline text-xs font-medium text-white/90 group-hover:text-amber-300">
                Cart
              </span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (under logo on small screens) */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search gifts, mugs, bottles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-900 placeholder:text-gray-400 text-xs rounded-full pl-4 pr-10 py-2 outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#670D1F] text-amber-300 flex items-center justify-center"
            >
              <Search size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Sub-Nav Bar (Desktop Secondary Menu) ── */}
      <nav className="hidden md:block bg-[#520817] text-white/95 border-t border-rose-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-11 text-xs font-medium">
          
          <div className="flex items-center gap-7">
            <Link href="/" className="hover:text-amber-300 transition-colors">
              Home
            </Link>

            {/* Shop Dropdown */}
            <div
              className="relative group py-2.5"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-amber-300 transition-colors">
                Shop <ChevronDown size={13} className={`transition-transform duration-200 ${shopDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {shopDropdownOpen && (
                <div className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 text-gray-800 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Categories
                  </div>
                  {[
                    { name: "All Products", href: "/#products" },
                    { name: "Magic Mugs", href: "/#products" },
                    { name: "Mugs", href: "/#products" },
                    { name: "Sipper Bottles", href: "/#products" },
                    { name: "Keychains", href: "/#products" },
                    { name: "Photo Frames", href: "/#products" },
                    { name: "Custom Cushions", href: "/#products" },
                    { name: "T-Shirts & Hoodies", href: "/#products" },
                  ].map((cat, i) => (
                    <Link
                      key={i}
                      href={cat.href}
                      onClick={() => setShopDropdownOpen(false)}
                      className="block px-4 py-1.5 text-xs text-gray-700 hover:bg-rose-50 hover:text-[#670D1F] font-medium transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Gift Finder with New badge */}
            <button
              onClick={openGiftFinder}
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors font-semibold text-amber-200"
            >
              <Gift size={13} className="text-amber-300" />
              Gift Finder
              <span className="bg-rose-500 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full tracking-wide">
                New
              </span>
            </button>

            <Link href="/#products" className="hover:text-amber-300 transition-colors">
              Custom Orders
            </Link>

            <a
              href="https://wa.me/918380808435?text=Hi!%20I%20am%20interested%20in%20Bulk%20Corporate%20Orders"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
            >
              Bulk Orders
            </a>

            <Link href="/about" className="hover:text-amber-300 transition-colors">
              About Us
            </Link>

            <Link href="/contact" className="hover:text-amber-300 transition-colors">
              Contact Us
            </Link>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-rose-200">
            <span className="flex items-center gap-1">
              <Truck size={13} className="text-amber-300" /> Pan-India Fast Delivery
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-amber-300" /> 100% Satisfaction Guarantee
            </span>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[115px] bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white text-gray-900 w-4/5 max-w-sm h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-serif font-bold text-base text-[#670D1F]">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Mobile Auth button */}
              <div className="pb-2">
                <NavbarAuthSection />
              </div>

              {/* Gift Finder CTA button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openGiftFinder();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#670D1F] text-white py-2.5 rounded-xl font-bold text-xs shadow-md"
              >
                <Gift size={15} className="text-amber-300" />
                Try Gift Finder Wizard
                <span className="bg-amber-400 text-[#670D1F] text-[9px] px-1.5 py-0.5 rounded-full uppercase">
                  New
                </span>
              </button>

              <div className="space-y-2 text-sm font-semibold text-gray-700 pt-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#670D1F]"
                >
                  Home
                </Link>
                <Link
                  href="/#products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#670D1F]"
                >
                  Shop All Products
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#670D1F]"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#670D1F]"
                >
                  Contact Us
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#670D1F]"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openWishlist();
                  }}
                  className="block w-full text-left py-2 hover:text-[#670D1F]"
                >
                  My Wishlist ({wishlistItems.length})
                </button>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#670D1F]"
                >
                  Cart ({totalCartItems})
                </Link>
                <a
                  href="https://wa.me/918380808435?text=Hi!%20I%20am%20interested%20in%20Bulk%20Corporate%20Orders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 hover:text-[#670D1F]"
                >
                  Bulk Orders
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 text-xs text-gray-500">
              <p className="font-semibold text-gray-800">Cluster Studio Helpdesk</p>
              <p className="mt-1">Mon - Sat: 10AM - 7PM</p>
              <a href="tel:+918380808435" className="mt-0.5 text-[#670D1F] font-bold block hover:underline">
                +91 8380808435
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
