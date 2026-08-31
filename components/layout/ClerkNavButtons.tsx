"use client";
import { User } from "lucide-react";

export default function ClerkNavButtons() {
  return (
    <a
      href="/admin/login"
      className="flex items-center gap-1.5 bg-[#670D1F] hover:bg-[#520817] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
    >
      <User size={14} />
      <span>Login</span>
    </a>
  );
}
