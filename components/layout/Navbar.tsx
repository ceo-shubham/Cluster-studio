"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import NavbarAuthSection from "./NavbarAuthSection";

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <nav className="sticky top-0 z-50 bg-[#3b1c0c] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center overflow-hidden border-2 border-amber-400">
            <Image
              src="/logo.png"
              alt="Cluster Studio"
              width={40}
              height={40}
              className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Cluster<span className="text-amber-400"> Studio</span>
          </span>
        </Link>

        {/* Desktop Nav Links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-amber-100 hover:text-amber-400 font-medium transition-colors">
            Home
          </Link>
          <Link href="/#products" className="text-amber-100 hover:text-amber-400 font-medium transition-colors">
            Products
          </Link>
        </div>

        {/* Right side: Cart + Auth — always visible, compact on mobile */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative text-white hover:text-amber-400 transition-colors p-1">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          <NavbarAuthSection />
        </div>
      </div>
    </nav>
  );
}
