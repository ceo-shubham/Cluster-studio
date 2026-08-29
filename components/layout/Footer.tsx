import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#2a1208] text-amber-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-3">Cluster Studio</h3>
            <p className="text-sm text-amber-200 leading-relaxed">
              Premium custom prints on mugs, bottles, t-shirts, hoodies & more. 
              Your imagination, our craft.
            </p>
          </div>

          {/* Quick Links + Contact Us — side by side on mobile too */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-amber-400 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
                <li><Link href="/#products" className="hover:text-amber-400 transition-colors">Products</Link></li>
                <li><Link href="/orders" className="hover:text-amber-400 transition-colors">My Orders</Link></li>
                <li><Link href="/cart" className="hover:text-amber-400 transition-colors">Cart</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-amber-400 mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-amber-400 shrink-0" />
                  <a href="mailto:admin@clusterstudio.in" className="hover:text-amber-400 transition-colors text-xs">
                    admin@clusterstudio.in
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-amber-400 shrink-0" />
                  <span className="text-xs">+91 XXXXX XXXXX</span>
                </li>
              </ul>
              <div className="flex items-center gap-3 mt-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-80 p-2 rounded-full transition-opacity text-white">
                  <FaInstagram size={16} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                  className="bg-[#1877F2] hover:opacity-80 p-2 rounded-full transition-opacity text-white">
                  <FaFacebookF size={16} />
                </a>
                <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer"
                  className="bg-[#25D366] hover:opacity-80 p-2 rounded-full transition-opacity text-white">
                  <FaWhatsapp size={16} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                  className="bg-[#FF0000] hover:opacity-80 p-2 rounded-full transition-opacity text-white">
                  <FaYoutube size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-900 mt-10 pt-6 text-center text-xs text-amber-500">
          © {new Date().getFullYear()} Cluster Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
