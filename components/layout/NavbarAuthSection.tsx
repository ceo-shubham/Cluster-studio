"use client";
import { useState, useEffect } from "react";
import ClerkNavButtons from "./ClerkNavButtons";

export default function NavbarAuthSection({ variant = "desktop" }: { variant?: "desktop" | "drawer" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-16 h-8" />;

  return <ClerkNavButtons variant={variant} />;
}
