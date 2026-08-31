"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WishlistDrawer() {
  const { items, isOpen, closeWishlist, removeItem, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleMoveToCart = (product: any) => {
    addItemToCart(product);
    removeItem(product.id);
    toast.success(`${product.name} moved to cart!`);
  };

  const handleMoveAllToCart = () => {
    items.forEach((item) => addItemToCart(item));
    clearWishlist();
    toast.success("All items moved to cart!");
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeWishlist}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] transition-opacity duration-300"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[100] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#670D1F] text-white">
          <div className="flex items-center gap-2">
            <Heart size={20} className="fill-white text-white" />
            <h2 className="font-bold text-lg">My Wishlist ({items.length})</h2>
          </div>
          <button
            onClick={closeWishlist}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-[#670D1F] mb-3">
                <Heart size={32} />
              </div>
              <p className="font-semibold text-gray-800 text-lg">Your wishlist is empty</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[240px]">
                Explore our personalized mugs, bottles & gifts to save your favorites!
              </p>
              <button
                onClick={closeWishlist}
                className="mt-5 bg-[#670D1F] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow hover:bg-[#520817] transition-colors"
              >
                Browse Gifts
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-2xl border border-amber-100/60 shadow-sm"
              >
                <Link
                  href={`/product/${item.id}`}
                  onClick={closeWishlist}
                  className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-200"
                >
                  <Image
                    src={item.cardImage || item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#670D1F] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <Link
                    href={`/product/${item.id}`}
                    onClick={closeWishlist}
                    className="block font-bold text-gray-900 text-sm truncate hover:text-[#670D1F]"
                  >
                    {item.name}
                  </Link>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-extrabold text-[#670D1F] text-sm">
                      {formatPrice(item.price)}
                    </span>
                    {item.mrp && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(item.mrp)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex items-center gap-1 bg-[#670D1F] hover:bg-[#520817] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                    >
                      <ShoppingBag size={12} /> Move to Cart
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-2">
            <button
              onClick={handleMoveAllToCart}
              className="w-full flex items-center justify-center gap-2 bg-[#670D1F] hover:bg-[#520817] text-white font-bold py-3 rounded-xl transition-colors shadow"
            >
              <ShoppingBag size={16} /> Move All to Cart
            </button>
            <button
              onClick={clearWishlist}
              className="w-full text-xs text-gray-500 hover:text-red-600 py-1.5 transition-colors text-center"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>
    </>
  );
}
