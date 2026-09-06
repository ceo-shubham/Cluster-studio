"use client";
import Link from "next/link";
import { 
  Phone, MessageCircle, Mail, MapPin, Heart, 
  ShieldCheck, Truck, Sparkles 
} from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-[#5E1224] text-white pt-12 pb-8 border-t border-[#4A0A17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* ── Brand & Tagline ── */}
        <div className="flex flex-col items-center text-center space-y-3">
          <BrandLogo variant="light" size="lg" />
          <p className="text-xs sm:text-sm text-rose-100/90 max-w-md font-medium">
            Personalized gifts and fashion items made with love, just for you.
          </p>

          {/* Social Icons Row */}
          <div className="flex items-center gap-3 pt-2">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="Instagram"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="Facebook"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="WhatsApp"
            >
              <MessageCircle size={15} />
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="YouTube"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── 3 Column Links Grid ── */}
        <div className="grid grid-cols-3 gap-6 sm:gap-10 border-t border-rose-900/40 pt-8 text-center sm:text-left">
          
          {/* Column 1: SHOP */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-300">
              SHOP
            </h3>
            <ul className="space-y-2 text-xs text-rose-100/80">
              <li>
                <Link href="/category/mugs" className="hover:text-white transition-colors">
                  Mugs
                </Link>
              </li>
              <li>
                <Link href="/category/clothing" className="hover:text-white transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/category/bottles" className="hover:text-white transition-colors">
                  Bottles
                </Link>
              </li>
              <li>
                <Link href="/category/keychains" className="hover:text-white transition-colors">
                  Keychains
                </Link>
              </li>
              <li>
                <Link href="/category/combos" className="hover:text-white transition-colors">
                  Combos
                </Link>
              </li>
              <li>
                <Link href="/#products" className="hover:text-white transition-colors">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: HELP */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-300">
              HELP
            </h3>
            <ul className="space-y-2 text-xs text-rose-100/80">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: INFO */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-300">
              INFO
            </h3>
            <ul className="space-y-2 text-xs text-rose-100/80">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-rose-300/60 hover:text-amber-300 transition-colors text-[11px]">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-6 border-t border-rose-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-rose-200/70">
          <p>© {new Date().getFullYear()} Cluster Studio. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-rose-400 fill-rose-400" /> for your loved ones
          </p>
        </div>

      </div>
    </footer>
  );
}
