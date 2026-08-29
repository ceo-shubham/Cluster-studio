"use client";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import ClerkNavButtons from "./ClerkNavButtons";

const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const IS_CLERK_ON =
  CLERK_KEY.startsWith("pk_test_") || CLERK_KEY.startsWith("pk_live_");

export default function NavbarAuthSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-16 h-8" />;

  // Clerk not configured yet — show a plain login button
  // (clicking it prompts user to set up Clerk)
  if (!IS_CLERK_ON) {
    return (
      <a
        href="/checkout"
        className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
      >
        <User size={15} /> Login
      </a>
    );
  }

  // Clerk IS configured — render the component that uses Clerk hooks
  // This is safe because ClerkProvider wraps the whole app when keys exist
  return <ClerkNavButtons />;
}
