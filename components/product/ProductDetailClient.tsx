"use client";
import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, ChevronRight, Star, Heart, ShoppingBag, 
  Upload, Type, Check, Sparkles, ShieldCheck, Truck, 
  RefreshCw, Plus, Minus, Image as ImageIcon, ArrowLeft,
  X, CheckCircle, Info
} from "lucide-react";
import { getProductById, products } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductCard from "@/components/product/ProductCard";
import PincodeEstimator from "./PincodeEstimator";
import toast from "react-hot-toast";

export default function ProductDetailClient() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);
  const router = useRouter();

  const addItemToCart = useCartStore((s) => s.addItem);
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Customizer Mode State (Screen 4 in template)
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizeTab, setCustomizeTab] = useState<"upload" | "text">("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState("#5E1224");
  const [fontSize, setFontSize] = useState(20);
  const [textFontStyle, setTextFontStyle] = useState<"serif" | "sans" | "cursive">("cursive");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#221518]">Product Not Found</h2>
        <p className="text-[#736B6D] text-xs">The product you are looking for does not exist or has been moved.</p>
        <Link
          href="/"
          className="inline-block bg-[#5E1224] text-white text-xs font-bold px-6 py-3 rounded-xl shadow"
        >
          ← Return to Home
        </Link>
      </div>
    );
  }

  const galleryImages = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.image, product.cardImage];

  const wishlisted = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist ❤️");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      toast.success("Image uploaded successfully! Preview updated.");
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItemToCart(product, uploadedImage || undefined, uploadedImage || undefined);
    }
    toast.success(`${product.name} added to cart!`);
    setIsCustomizing(false);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItemToCart(product, uploadedImage || undefined, uploadedImage || undefined);
    }
    router.push("/checkout");
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-8">
      
      {/* ── Top Back Breadcrumb Bar ── */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EFE7DC]/60">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#736B6D] hover:text-[#5E1224] transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to products</span>
        </Link>

        <button
          onClick={handleWishlistToggle}
          className="p-1.5 text-[#5E1224] hover:scale-110 transition-transform active:scale-95"
          aria-label="Wishlist toggle"
        >
          <Heart size={20} className={wishlisted ? "fill-[#5E1224]" : ""} />
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── SCREEN 4: CUSTOMIZE VIEW (When isCustomizing is true) ─────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isCustomizing ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#221518]">
                Customize Your {product.name}
              </h1>
              <p className="text-xs text-[#736B6D] mt-0.5">
                Upload your design or add text to make it yours.
              </p>
            </div>
            <button
              onClick={() => setIsCustomizing(false)}
              className="p-2 rounded-full bg-[#F5ECE1] text-[#221518] hover:bg-[#EFE7DC] text-xs font-bold"
            >
              ✕ Exit
            </button>
          </div>

          {/* Toggle Tabs: [ Upload Design ] | [ Add Text ] */}
          <div className="grid grid-cols-2 gap-2 bg-[#F5ECE1] p-1.5 rounded-2xl">
            <button
              onClick={() => setCustomizeTab("upload")}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                customizeTab === "upload"
                  ? "bg-[#5E1224] text-white shadow-xs"
                  : "text-[#5C4F52] hover:text-[#221518]"
              }`}
            >
              <Upload size={14} />
              <span>Upload Design</span>
            </button>
            <button
              onClick={() => setCustomizeTab("text")}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                customizeTab === "text"
                  ? "bg-[#5E1224] text-white shadow-xs"
                  : "text-[#5C4F52] hover:text-[#221518]"
              }`}
            >
              <Type size={14} />
              <span>Add Text</span>
            </button>
          </div>

          {/* Upload Dropzone Tab */}
          {customizeTab === "upload" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#D4B996] hover:border-[#5E1224] bg-[#FFFDF9] rounded-3xl p-8 text-center space-y-3 cursor-pointer transition-colors shadow-2xs group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-14 h-14 rounded-full bg-[#F9F4EE] border border-[#EFE7DC] group-hover:scale-110 text-[#5E1224] flex items-center justify-center mx-auto transition-transform">
                <Upload size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#221518]">
                  {uploadedImage ? "Change Uploaded Image" : "Click to upload your image"}
                </p>
                <p className="text-[11px] text-[#736B6D] mt-1">
                  PNG, JPG or PDF (Max. 10MB)
                </p>
              </div>
              {uploadedImage && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <Check size={12} /> Image Ready on Mockup
                </span>
              )}
            </div>
          )}

          {/* Add Text Tab */}
          {customizeTab === "text" && (
            <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 space-y-4 shadow-2xs">
              <div>
                <label className="text-xs font-bold text-[#221518] block mb-1.5">
                  Enter Custom Text / Name / Date:
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. Rahul & Sneha ❤️"
                  className="w-full bg-[#FAF7F2] text-sm text-[#221518] rounded-xl px-4 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224]"
                />
              </div>

              {/* Font Style Selection */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTextFontStyle("cursive")}
                  className={`p-2 rounded-xl text-xs border ${
                    textFontStyle === "cursive"
                      ? "border-[#5E1224] bg-rose-50 text-[#5E1224] font-bold"
                      : "border-slate-200"
                  }`}
                  style={{ fontFamily: "cursive" }}
                >
                  Cursive Script
                </button>
                <button
                  type="button"
                  onClick={() => setTextFontStyle("serif")}
                  className={`p-2 rounded-xl text-xs border ${
                    textFontStyle === "serif"
                      ? "border-[#5E1224] bg-rose-50 text-[#5E1224] font-bold"
                      : "border-slate-200 font-serif"
                  }`}
                >
                  Classic Serif
                </button>
                <button
                  type="button"
                  onClick={() => setTextFontStyle("sans")}
                  className={`p-2 rounded-xl text-xs border ${
                    textFontStyle === "sans"
                      ? "border-[#5E1224] bg-rose-50 text-[#5E1224] font-bold"
                      : "border-slate-200 font-sans"
                  }`}
                >
                  Modern Sans
                </button>
              </div>

              {/* Color Palette */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#736B6D]">Text Color:</span>
                {["#5E1224", "#111111", "#D97706", "#2563EB", "#DC2626"].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setTextColor(col)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      textColor === col ? "border-slate-800 scale-110" : "border-white"
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Live Mockup Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#736B6D] block">
              Live Preview
            </span>
            <div className="relative aspect-4/3 sm:aspect-video w-full rounded-3xl bg-[#F9F4EE] border border-[#EFE7DC] flex items-center justify-center p-6 overflow-hidden shadow-xs">
              {/* Base Product Mockup */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.cardImage || product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />

              {/* Live Uploaded Image Overlay on Mockup */}
              {uploadedImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden shadow-md border border-white/60 transform -rotate-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={uploadedImage} alt="User design" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Live Custom Text Overlay on Mockup */}
              {customText && !uploadedImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
                  <div className="text-center transform -rotate-2">
                    <p
                      style={{
                        color: textColor,
                        fontFamily: textFontStyle === "cursive" ? "cursive" : textFontStyle === "serif" ? "Georgia, serif" : "sans-serif",
                        fontSize: `${fontSize}px`,
                      }}
                      className="font-bold drop-shadow-xs leading-tight"
                    >
                      {customText}
                    </p>
                  </div>
                </div>
              )}

              {!uploadedImage && !customText && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="font-serif italic text-base sm:text-xl font-bold text-[#5E1224]/70 transform -rotate-3">
                    Your Design Here ❤️
                  </p>
                </div>
              )}
            </div>
            <p className="text-[11px] text-[#736B6D] italic text-center">
              Note: For best result, use high quality high-resolution images.
            </p>
          </div>

          {/* Sticky Bottom Action Button */}
          <div className="sticky bottom-4 z-20 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#5E1224] hover:bg-[#470A18] text-white font-bold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={16} />
              <span>ADD TO CART – {formatPrice(product.price * quantity)}</span>
            </button>
          </div>

        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════ */
        /* ── SCREEN 3: STANDARD PRODUCT DETAIL VIEW ─────────────────────── */
        /* ══════════════════════════════════════════════════════════════════ */
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Large Image Gallery with Dots ── */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-3xl bg-[#F9F4EE] border border-[#EFE7DC] overflow-hidden flex items-center justify-center p-6 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-300"
                />

                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#221518] flex items-center justify-center shadow-xs transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#221518] flex items-center justify-center shadow-xs transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* Gallery Dots */}
              {galleryImages.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {galleryImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeImageIndex === i ? "bg-[#5E1224] w-5" : "bg-[#D4B996]/60 hover:bg-[#D4B996]"
                      }`}
                      aria-label={`View photo ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Right Column: Info & Action Buttons ── */}
            <div className="md:col-span-6 space-y-5">
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#221518]">
                  {product.name}
                </h1>
                
                {/* Price */}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#221518]">
                    {formatPrice(product.price)}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-sm text-[#8C7A7E] line-through">
                      {formatPrice(product.mrp)}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Rating & In Stock */}
                <div className="flex items-center gap-3 text-xs mt-2 text-[#736B6D]">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="font-bold text-[#221518]">{product.rating.toFixed(1)}</span>
                    <span>({product.reviewsCount} reviews)</span>
                  </div>
                  <span>•</span>
                  <span className="font-bold text-emerald-700">In Stock</span>
                </div>
              </div>

              {/* ── PRODUCT DETAILS (Bulleted Specs List) ── */}
              <div className="pt-3 border-t border-[#EFE7DC] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#221518] block">
                  PRODUCT DETAILS
                </span>
                <p className="text-xs text-[#5C4F52] leading-relaxed">
                  {product.description}
                </p>

                <ul className="space-y-1.5 pt-2 text-xs text-[#4A3B3E]">
                  {product.specificationsList?.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[#5E1224] font-bold">✓</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── CHOOSE QUANTITY ── */}
              <div className="pt-3 border-t border-[#EFE7DC] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#221518] block">
                  CHOOSE QUANTITY
                </span>
                <div className="inline-flex items-center border border-[#EFE7DC] rounded-xl overflow-hidden bg-[#FAF7F2]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 hover:bg-[#EFE7DC] transition-colors text-[#221518]"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-xs font-bold text-[#221518]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 hover:bg-[#EFE7DC] transition-colors text-[#221518]"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* ── PINCODE DELIVERY ESTIMATOR ── */}
              <div className="pt-2">
                <PincodeEstimator />
              </div>

              {/* ── ACTION BUTTONS ── */}
              <div className="pt-2 space-y-2.5">
                {/* 1. CUSTOMIZE NOW (Primary Maroon) */}
                <button
                  onClick={() => setIsCustomizing(true)}
                  className="w-full bg-[#5E1224] hover:bg-[#470A18] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>CUSTOMIZE NOW</span>
                </button>

                {/* 2. ADD TO CART (Outline) */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white hover:bg-[#FAF7F2] border border-[#5E1224] text-[#5E1224] font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-colors active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>ADD TO CART</span>
                </button>

                {/* 3. Buy Now Link */}
                <div className="text-center pt-1">
                  <button
                    onClick={handleBuyNow}
                    className="text-xs font-bold text-[#736B6D] hover:text-[#5E1224] underline transition-colors"
                  >
                    Buy Now without customization
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* ── Related Products ── */}
          {relatedProducts.length > 0 && (
            <div className="pt-8 border-t border-[#EFE7DC] space-y-4">
              <h2 className="font-serif font-bold text-xl text-[#221518]">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
