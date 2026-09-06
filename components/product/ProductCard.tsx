"use client";
import Link from "next/link";
import { Star, Plus, Heart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";

interface ProductCardProps {
  product: Product;
  className?: string;
  onQuickAdd?: (product: Product) => void;
}

export default function ProductCard({
  product,
  className = "",
  onQuickAdd,
}: ProductCardProps) {
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handlePlusClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product);
    } else {
      window.location.href = `/product/${product.id}`;
    }
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group bg-white rounded-2xl border border-[#EFE7DC] shadow-2xs hover:shadow-md hover:border-[#5E1224]/30 transition-all flex flex-col overflow-hidden relative ${className}`}
    >
      {/* ── Image Container ── */}
      <div className="relative aspect-square w-full bg-[#F9F4EE] overflow-hidden flex items-center justify-center p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.cardImage || product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-[#5E1224] flex items-center justify-center transition-transform active:scale-90 shadow-2xs z-10"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            className={wishlisted ? "fill-[#5E1224] text-[#5E1224]" : "text-[#736B6D]"}
          />
        </button>

        {/* Best Seller Tag if active */}
        {product.isBestSeller && (
          <span className="absolute top-2.5 left-2.5 bg-[#5E1224] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs">
            Best Seller
          </span>
        )}
      </div>

      {/* ── Card Content ── */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <h3 className="font-serif font-bold text-sm sm:text-base text-[#221518] line-clamp-1 group-hover:text-[#5E1224] transition-colors">
            {product.name}
          </h3>

          {/* Price & Rating */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-[#221518]">
                {formatPrice(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-[10px] text-[#8C7A7E] line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#736B6D] mt-1">
            <Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
            <span className="font-semibold text-[#221518]">{product.rating.toFixed(1)}</span>
            <span>({product.reviewsCount})</span>
          </div>
        </div>

        {/* Circular Maroon Plus Button (Bottom Right) */}
        <div className="flex items-center justify-end pt-1">
          <button
            onClick={handlePlusClick}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5E1224] hover:bg-[#470A18] text-white flex items-center justify-center transition-transform active:scale-90 shadow-xs cursor-pointer"
            aria-label={`Customize ${product.name}`}
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </Link>
  );
}
