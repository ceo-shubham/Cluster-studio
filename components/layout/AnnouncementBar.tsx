"use client";
import { useState, useEffect } from "react";
import { Sparkles, Truck, Tag, ShieldCheck } from "lucide-react";

const ANNOUNCEMENTS = [
  { text: "🎁 Flat 10% OFF on all Personalized Gifts! Use Code: LOVE10", icon: <Tag size={12} className="text-amber-300" /> },
  { text: "🚚 FREE Express Delivery Across India on Orders Above ₹399", icon: <Truck size={12} className="text-amber-300" /> },
  { text: "⚡ 24-Hour Custom Sublimation Printing & Fast Dispatch", icon: <Sparkles size={12} className="text-amber-300" /> },
  { text: "⭐ 10,000+ Happy Customers • 100% Satisfaction Guarantee", icon: <ShieldCheck size={12} className="text-amber-300" /> },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const current = ANNOUNCEMENTS[index];

  return (
    <div className="bg-[#470A18] text-white text-[11px] font-semibold py-2 px-4 border-b border-rose-950 flex items-center justify-center overflow-hidden">
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300 key={index}">
        {current.icon}
        <span className="tracking-wide text-rose-100/95">{current.text}</span>
      </div>
    </div>
  );
}
