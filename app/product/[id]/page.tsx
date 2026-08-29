"use client";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import ImageEditor from "@/components/editor/ImageEditor";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ShoppingCart, ChevronLeft, Star } from "lucide-react";
import Link from "next/link";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [showEditor, setShowEditor] = useState(false);
  const [finalDataUrl, setFinalDataUrl] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Product not found.</p>
        <Link href="/" className="text-amber-600 mt-4 inline-block hover:underline">← Back to home</Link>
      </div>
    );
  }

  const handleEditorComplete = (dataUrl: string, url: string) => {
    setFinalDataUrl(dataUrl);
    setUploadedUrl(url);
    setShowEditor(false);
    toast.success("Design saved! Add to cart when ready.");
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, uploadedUrl || undefined, finalDataUrl || undefined);
    }
    toast.success(`${product.name} added to cart!`);
    router.push("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 text-sm font-medium mb-6">
        <ChevronLeft size={16} /> Back to Products
      </Link>

      {/* ── Editor mode: full-width centered ── */}
      {showEditor ? (
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-4 shadow-md border border-amber-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Customize Your Design</h3>
            <button
              onClick={() => setShowEditor(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
          <ImageEditor product={product} onComplete={handleEditorComplete} />
        </div>
      ) : (
        /* ── Normal mode: 2-column layout ── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Product image */}
          <div className="flex flex-col gap-4">
            <div
              className="relative rounded-2xl overflow-hidden bg-white shadow-md border border-amber-100"
              style={{ aspectRatio: "1/1" }}
            >
              {finalDataUrl ? (
                <Image src={finalDataUrl} alt="Your design preview" fill className="object-contain" />
              ) : (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
              {finalDataUrl && (
                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  ✓ Custom Design
                </div>
              )}
            </div>

            <button
              onClick={() => setShowEditor(true)}
              className="w-full bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-800 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {finalDataUrl ? "Edit Your Design" : "Upload & Customize Image"}
            </button>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-full">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-[#3b1c0c] mt-2">{product.name}</h1>
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} fill="#f59e0b" className="text-amber-400" />
                ))}
                <span className="text-xs text-gray-500 ml-1">(4.8 · 120 reviews)</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-[#3b1c0c]">{formatPrice(product.price)}</div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
              {product.specs && (
                <div className="mt-3 pt-3 border-t border-amber-100">
                  <p className="text-xs text-amber-700 font-semibold mb-1">SPECIFICATIONS</p>
                  <p className="text-sm text-gray-600">{product.specs}</p>
                </div>
              )}
            </div>

            {!finalDataUrl && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
                <strong>How to order:</strong> Click &quot;Upload &amp; Customize Image&quot; to add your design, then add to cart.
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 font-bold"
                >−</button>
                <span className="px-4 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 font-bold"
                >+</button>
              </div>
              <span className="text-sm text-gray-500">= {formatPrice(product.price * quantity)}</span>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl transition-colors text-base shadow-md"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
              {["✓ Free Shipping", "✓ Premium Quality", "✓ Custom Design", "✓ Secure Checkout"].map((t, i) => (
                <span key={i} className="flex items-center gap-1">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
