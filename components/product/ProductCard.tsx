"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Sparkles, Pencil } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";
import toast from "react-hot-toast";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      addItem(product);
      toast.success("Added to wishlist ❤️");
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100/70 flex flex-col relative">
      
      {/* Top badges (Best seller / New) */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.isBestSeller && (
          <span className="bg-amber-400 text-gray-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-sm tracking-wide flex items-center gap-1">
            <Sparkles size={10} /> BEST SELLER
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-[#670D1F] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-sm tracking-wide">
            NEW
          </span>
        )}
      </div>

      {/* Wishlist Heart Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-400 hover:text-rose-600 transition-colors group-hover:scale-105"
        aria-label="Wishlist"
      >
        <Heart
          size={16}
          className={`transition-colors ${
            wishlisted ? "fill-rose-600 text-rose-600" : "hover:text-rose-600"
          }`}
        />
      </button>

      {/* Image container */}
      <Link
        href={`/product/${product.id}`}
        className="block relative overflow-hidden bg-gradient-to-b from-[#FDFBF9] to-[#F7F2EC] shrink-0 aspect-square"
      >
        <Image
          src={product.cardImage || product.image}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      {/* Card Content */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1 justify-between">
        <div>
          {/* Category */}
          <span className="text-[10px] font-bold text-[#670D1F]/80 uppercase tracking-wider block">
            {product.category}
          </span>

          {/* Title */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1 hover:text-[#670D1F] transition-colors mt-0.5">
              {product.name}
            </h3>
          </Link>

          {/* Star rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-medium ml-0.5">
              ({product.reviewsCount ?? 0})
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-[#670D1F]">
                {formatPrice(product.price)}
              </span>
              {product.mrp && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>
            {product.discount && (
              <span className="text-[10px] font-bold text-emerald-600">
                {product.discount}
              </span>
            )}
          </div>

          <Link
            href={`/product/${product.id}`}
            className="flex items-center gap-1 bg-[#670D1F] hover:bg-[#520817] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-sm shrink-0 hover:shadow-md"
          >
            <Pencil size={11} />
            <span>Customize</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
