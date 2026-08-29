"use client";
import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">

      {/* Fixed height image box — all cards same height, image fits inside without crop */}
      <Link
        href={`/product/${product.id}`}
        className="block relative overflow-hidden bg-gray-50 shrink-0"
        style={{ height: "220px" }}
      >
        <Image
          src={product.cardImage}
          alt={product.name}
          fill
          className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Category badge */}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-amber-700 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shadow-sm">
          {product.category}
        </span>
      </Link>

      {/* Card body */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-1">
            {product.name}
          </h3>
          {product.specs && (
            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{product.specs}</p>
          )}
        </div>

        {/* Price + button */}
        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <span className="text-base font-extrabold text-[#3b1c0c] shrink-0">
            {formatPrice(product.price)}
          </span>
          <Link
            href={`/product/${product.id}`}
            className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors shrink-0 whitespace-nowrap"
          >
            <Pencil size={11} />
            <span className="hidden sm:inline">Customize</span>
            <span className="sm:hidden">Buy</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
