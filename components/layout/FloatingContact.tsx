"use client";
import { usePathname } from "next/navigation";
import { FaWhatsapp, FaPhone } from "react-icons/fa";

const PHONE = "918380808435";
const WHATSAPP_MSG = "Hi! I'm interested in a custom personalized order from Cluster Studio.";

export default function FloatingContact() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3">
      <a
        href={`https://wa.me/${PHONE}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] shadow-xl flex items-center justify-center transition-transform hover:scale-110 border border-white/20"
      >
        <FaWhatsapp size={24} className="text-white" />
      </a>

      <a
        href={`tel:+${PHONE}`}
        aria-label="Call us"
        className="w-12 h-12 rounded-full bg-[#670D1F] hover:bg-[#520817] shadow-xl flex items-center justify-center transition-transform hover:scale-110 border border-white/20"
      >
        <FaPhone size={18} className="text-white" />
      </a>
    </div>
  );
}
