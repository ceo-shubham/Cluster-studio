"use client";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Clock, MapPin, Heart } from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube, FaPinterestP } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#520817] text-rose-100 border-t border-rose-900/50 mt-16">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-white shadow-md border-2 border-amber-300/80">
                <Image
                  src="/logo.png"
                  alt="Cluster Studio Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
                  CLUSTER <span className="text-amber-300 font-sans text-lg font-light">STUDIO</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-rose-200 font-semibold mt-0.5">
                  Personalized Gifts Made with Love
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed max-w-sm">
              Personalized gifts for every moment, made with love. Premium custom prints on mugs, magic mugs, bottles, t-shirts, hoodies, photo frames & keychains.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E1306C] text-white flex items-center justify-center transition-colors"
              >
                <FaInstagram size={15} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-colors"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="https://wa.me/918380808435"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-colors"
              >
                <FaWhatsapp size={15} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center transition-colors"
              >
                <FaYoutube size={15} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E60023] text-white flex items-center justify-center transition-colors"
              >
                <FaPinterestP size={14} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider font-serif">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-rose-200/80">
              <li><Link href="/#products" className="hover:text-amber-300 transition-colors">All Products</Link></li>
              <li><Link href="/#products" className="hover:text-amber-300 transition-colors">Magic Mugs</Link></li>
              <li><Link href="/#products" className="hover:text-amber-300 transition-colors">Sipper Bottles</Link></li>
              <li><Link href="/#products" className="hover:text-amber-300 transition-colors">Keychains</Link></li>
              <li><Link href="/#products" className="hover:text-amber-300 transition-colors">Photo Frames</Link></li>
              <li><Link href="/#products" className="hover:text-amber-300 transition-colors">Custom Cushions</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider font-serif">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-rose-200/80">
              <li><Link href="/about" className="hover:text-amber-300 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-amber-300 transition-colors">Contact Us</Link></li>
              <li><a href="https://wa.me/918380808435?text=Hi!%20I%20am%20interested%20in%20Bulk%20Corporate%20Orders" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">Bulk Orders</a></li>
              <li><Link href="/orders" className="hover:text-amber-300 transition-colors">Track Order</Link></li>
              <li><Link href="/#faq" className="hover:text-amber-300 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider font-serif">
              Contact
            </h4>
            <div className="flex items-center gap-2 text-xs text-rose-200/90">
              <Phone size={14} className="text-amber-300 shrink-0" />
              <a href="tel:+918380808435" className="hover:text-amber-300 transition-colors font-bold">
                +91 8380808435
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-rose-200/90">
              <Mail size={14} className="text-amber-300 shrink-0" />
              <a href="mailto:hello@clusterstudio.in" className="hover:text-amber-300 transition-colors">
                hello@clusterstudio.in
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-rose-200/70 pt-1">
              <Clock size={14} className="text-amber-300 shrink-0" />
              <span>Mon - Sat: 10AM - 7PM</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-rose-200/70">
              <MapPin size={14} className="text-amber-300 shrink-0" />
              <span>New Delhi, India</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar with payment icons & copyright */}
        <div className="border-t border-rose-900/60 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-300/80">
          <p>© {new Date().getFullYear()} Cluster Studio. All Rights Reserved. Made with ❤️ in India.</p>

          <div className="flex items-center gap-3">
            <span className="bg-white/10 px-2.5 py-1 rounded text-[10px] font-bold text-white tracking-wider border border-white/10">
              VISA
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded text-[10px] font-bold text-amber-300 tracking-wider border border-white/10">
              UPI
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded text-[10px] font-bold text-white tracking-wider border border-white/10">
              RuPay
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded text-[10px] font-bold text-rose-300 tracking-wider border border-white/10">
              Mastercard
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded text-[10px] font-bold text-blue-300 tracking-wider border border-white/10">
              Paytm
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
