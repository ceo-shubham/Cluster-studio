"use client";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "light" | "dark";
  showSubtitle?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandLogo({
  variant = "dark",
  showSubtitle = true,
  className = "",
  size = "md",
}: BrandLogoProps) {
  const isDark = variant === "dark";
  
  return (
    <Link href="/" className={`inline-flex flex-col items-center group transition-transform active:scale-95 ${className}`}>
      {/* Stylized Minimalist Cup & Flame Outline Icon */}
      <div className="flex items-center justify-center mb-0.5">
        <svg
          width={size === "lg" ? "36" : size === "sm" ? "24" : "28"}
          height={size === "lg" ? "30" : size === "sm" ? "20" : "24"}
          viewBox="0 0 40 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${isDark ? "text-[#5E1224]" : "text-white"} transition-colors`}
        >
          {/* Flame / Sparkle top */}
          <path
            d="M20 3C19 6 17 8 20 11C23 8 21 6 20 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={isDark ? "rgba(94,18,36,0.15)" : "rgba(255,255,255,0.2)"}
          />
          {/* Cup Bowl */}
          <path
            d="M8 12C8 12 9 24 20 24C31 24 32 12 32 12H8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Cup Base */}
          <path
            d="M14 28H26"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 24V28"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Cup Handle Left & Right Accent */}
          <path
            d="M8 15C5.5 15 4 17 4 19C4 21 5.5 22.5 8 22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M32 15C34.5 15 36 17 36 19C36 21 34.5 22.5 32 22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Name */}
      <div className="flex flex-col items-center text-center">
        <span
          className={`font-serif tracking-[0.12em] uppercase font-bold leading-none ${
            size === "lg"
              ? "text-xl sm:text-2xl"
              : size === "sm"
              ? "text-xs"
              : "text-base sm:text-lg"
          } ${isDark ? "text-[#5E1224]" : "text-white"}`}
        >
          CLUSTER STUDIO
        </span>

        {/* Subtitle */}
        {showSubtitle && (
          <span
            className={`tracking-[0.24em] uppercase font-semibold text-[8px] sm:text-[9px] mt-0.5 ${
              isDark ? "text-[#8C7A7E]" : "text-rose-200/90"
            }`}
          >
            GIFTS &amp; FASHION
          </span>
        )}
      </div>
    </Link>
  );
}
