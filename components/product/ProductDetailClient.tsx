"use client";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, ChevronRight, Star, Heart, ShoppingBag, 
  Upload, Type, Check, Sparkles, ShieldCheck, Truck, 
  RefreshCw, Plus, Minus, Image as ImageIcon, ArrowLeft,
  X, CheckCircle, Info, Trash2, ZoomIn, ZoomOut, RotateCw,
  Move, Sliders, Layers
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
  
  // Customizer Mode State
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizeTab, setCustomizeTab] = useState<"upload" | "text">("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState<number>(1);
  const [imagePosX, setImagePosX] = useState<number>(0);
  const [imagePosY, setImagePosY] = useState<number>(0);
  const [imageRotation, setImageRotation] = useState<number>(0);

  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState("#5E1224");
  const [fontSize, setFontSize] = useState(20);
  const [textFontStyle, setTextFontStyle] = useState<"cursive" | "serif" | "sans" | "bold" | "handwriting">("cursive");
  const [textPosY, setTextPosY] = useState<number>(0);

  const [isCompositing, setIsCompositing] = useState(false);
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

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size must be less than 15MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setImageScale(1);
      setImagePosX(0);
      setImagePosY(0);
      setImageRotation(0);
      toast.success("Image added to mockup!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Uploaded image removed");
  };

  const handleResetDesign = () => {
    setUploadedImage(null);
    setImageScale(1);
    setImagePosX(0);
    setImagePosY(0);
    setImageRotation(0);
    setCustomText("");
    setTextPosY(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Design reset");
  };

  // Generate composite mockup canvas
  const generateCompositeImage = async (): Promise<string> => {
    if (!uploadedImage && !customText.trim()) {
      return product.image;
    }

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(uploadedImage || product.image);
        return;
      }

      const baseImg = new window.Image();
      baseImg.crossOrigin = "anonymous";
      baseImg.src = product.image;

      baseImg.onload = () => {
        // 1. Draw base product
        ctx.drawImage(baseImg, 0, 0, 600, 600);

        // 2. Draw user uploaded photo if present
        if (uploadedImage) {
          const userImg = new window.Image();
          userImg.crossOrigin = "anonymous";
          userImg.src = uploadedImage;

          userImg.onload = () => {
            ctx.save();
            const cx = 300 + imagePosX * 1.5;
            const cy = 300 + imagePosY * 1.5;
            ctx.translate(cx, cy);
            ctx.rotate((imageRotation * Math.PI) / 180);
            ctx.scale(imageScale, imageScale);

            // Size proportionally
            const targetDim = 220;
            const iw = userImg.naturalWidth || 200;
            const ih = userImg.naturalHeight || 200;
            const base = Math.min(targetDim / iw, targetDim / ih);
            const dw = iw * base;
            const dh = ih * base;

            ctx.drawImage(userImg, -dw / 2, -dh / 2, dw, dh);
            ctx.restore();

            // 3. Draw text after image
            if (customText.trim()) {
              drawCustomTextOnCanvas(ctx);
            }

            resolve(canvas.toDataURL("image/png"));
          };

          userImg.onerror = () => {
            if (customText.trim()) {
              drawCustomTextOnCanvas(ctx);
            }
            resolve(canvas.toDataURL("image/png"));
          };
        } else if (customText.trim()) {
          drawCustomTextOnCanvas(ctx);
          resolve(canvas.toDataURL("image/png"));
        } else {
          resolve(canvas.toDataURL("image/png"));
        }
      };

      baseImg.onerror = () => {
        resolve(uploadedImage || product.image);
      };
    });
  };

  const drawCustomTextOnCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    const ty = (uploadedImage ? 430 : 300) + textPosY * 1.5;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColor;
    
    let fontFam = "sans-serif";
    if (textFontStyle === "cursive") fontFam = "cursive, 'Brush Script MT', italic";
    else if (textFontStyle === "serif") fontFam = "Georgia, serif";
    else if (textFontStyle === "bold") fontFam = "Impact, sans-serif";
    else if (textFontStyle === "handwriting") fontFam = "cursive, 'Comic Sans MS'";

    ctx.font = `bold ${Math.round(fontSize * 1.4)}px ${fontFam}`;
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 4;
    ctx.fillText(customText, 300, ty);
    ctx.restore();
  };

  const handleAddToCart = async () => {
    setIsCompositing(true);
    try {
      const finalCompositeUrl = await generateCompositeImage();
      const canvasState = JSON.stringify({
        hasCustomImage: !!uploadedImage,
        hasCustomText: !!customText.trim(),
        customText,
        textColor,
        imageScale,
        imagePosX,
        imagePosY,
        imageRotation,
      });

      for (let i = 0; i < quantity; i++) {
        addItemToCart(
          product, 
          uploadedImage || (customText ? `text:${customText}` : undefined), 
          finalCompositeUrl,
          canvasState
        );
      }
      toast.success(`${product.name} with custom design added to cart!`);
      setIsCustomizing(false);
    } catch {
      for (let i = 0; i < quantity; i++) {
        addItemToCart(product, uploadedImage || undefined, uploadedImage || undefined);
      }
      toast.success(`${product.name} added to cart!`);
      setIsCustomizing(false);
    } finally {
      setIsCompositing(false);
    }
  };

  const handleBuyNow = async () => {
    setIsCompositing(true);
    try {
      const finalCompositeUrl = await generateCompositeImage();
      const canvasState = JSON.stringify({
        hasCustomImage: !!uploadedImage,
        hasCustomText: !!customText.trim(),
        customText,
        textColor,
        imageScale,
      });

      for (let i = 0; i < quantity; i++) {
        addItemToCart(
          product, 
          uploadedImage || (customText ? `text:${customText}` : undefined), 
          finalCompositeUrl,
          canvasState
        );
      }
      router.push("/checkout");
    } catch {
      for (let i = 0; i < quantity; i++) {
        addItemToCart(product, uploadedImage || undefined, uploadedImage || undefined);
      }
      router.push("/checkout");
    } finally {
      setIsCompositing(false);
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const getFontFamilyCss = () => {
    if (textFontStyle === "cursive") return "cursive, 'Brush Script MT', sans-serif";
    if (textFontStyle === "serif") return "Georgia, serif";
    if (textFontStyle === "bold") return "Impact, sans-serif";
    if (textFontStyle === "handwriting") return "'Caveat', cursive, 'Comic Sans MS'";
    return "ui-sans-serif, system-ui, sans-serif";
  };

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
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5E1224] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles size={12} /> Live 3D Customizer Studio
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#221518]">
                Customize Your {product.name}
              </h1>
              <p className="text-xs text-[#736B6D] mt-0.5">
                Preview your photo and personalized message in real-time on clean product mockup.
              </p>
            </div>
            <button
              onClick={() => setIsCustomizing(false)}
              className="px-3.5 py-2 rounded-xl bg-[#F5ECE1] text-[#221518] hover:bg-[#EFE7DC] text-xs font-bold transition-colors cursor-pointer"
            >
              ✕ Exit
            </button>
          </div>

          {/* ── LIVE INTERACTIVE MOCKUP PREVIEW (Clean Showimg Mockup) ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#736B6D] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#5E1224]" />
                <span>Live Interactive Mockup</span>
              </span>

              {(uploadedImage || customText) && (
                <button
                  onClick={handleResetDesign}
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} /> Reset All
                </button>
              )}
            </div>

            <div className="relative aspect-square sm:aspect-4/3 w-full rounded-3xl bg-[#F9F4EE] border border-[#EFE7DC] flex items-center justify-center p-4 sm:p-8 overflow-hidden shadow-inner select-none">
              
              {/* 1. Base Clean Product Mockup from /showimg/ */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain pointer-events-none select-none z-0"
              />

              {/* 2. Print Zone Guide Area */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-10 sm:p-14 z-10">
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 border-2 border-dashed border-[#5E1224]/30 rounded-2xl flex items-center justify-center">
                  
                  {/* Uploaded User Photo with Scale, Position & Rotation */}
                  {uploadedImage && (
                    <div
                      style={{
                        transform: `translate(${imagePosX}px, ${imagePosY}px) scale(${imageScale}) rotate(${imageRotation}deg)`,
                        transition: "transform 0.05s ease-out",
                      }}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden shadow-lg border border-white/80 shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={uploadedImage}
                        alt="User design"
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                  )}

                  {/* Custom Text with chosen font, size, color and vertical position */}
                  {customText && (
                    <div
                      style={{
                        transform: `translateY(${uploadedImage ? 50 + textPosY : textPosY}px)`,
                        transition: "transform 0.05s ease-out",
                      }}
                      className="absolute inset-x-0 text-center pointer-events-none px-2"
                    >
                      <p
                        style={{
                          color: textColor,
                          fontFamily: getFontFamilyCss(),
                          fontSize: `${fontSize}px`,
                        }}
                        className="font-bold drop-shadow-md leading-tight break-words select-none"
                      >
                        {customText}
                      </p>
                    </div>
                  )}

                  {/* Guide Placeholder when nothing is added yet */}
                  {!uploadedImage && !customText && (
                    <div className="text-center p-3 space-y-1">
                      <p className="font-serif italic text-sm sm:text-base font-bold text-[#5E1224]/70">
                        ✨ Your Design Here ✨
                      </p>
                      <p className="text-[10px] text-[#736B6D]">
                        Upload photo or type message below
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* Print Zone Badge */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#5E1224] px-2.5 py-1 rounded-full border border-[#EFE7DC] shadow-xs pointer-events-none">
                3D Live Mockup • Clean View
              </div>
            </div>

            <p className="text-[11px] text-[#736B6D] italic text-center">
              💡 Tip: Use sliders below to adjust photo size, position, and customize font color.
            </p>
          </div>

          {/* Toggle Tabs: [ 📷 Upload Design ] | [ ✍️ Add Text ] */}
          <div className="grid grid-cols-2 gap-2 bg-[#F5ECE1] p-1.5 rounded-2xl">
            <button
              onClick={() => setCustomizeTab("upload")}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                customizeTab === "upload"
                  ? "bg-[#5E1224] text-white shadow-xs"
                  : "text-[#5C4F52] hover:text-[#221518]"
              }`}
            >
              <Upload size={14} />
              <span>Upload Photo</span>
            </button>
            <button
              onClick={() => setCustomizeTab("text")}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                customizeTab === "text"
                  ? "bg-[#5E1224] text-white shadow-xs"
                  : "text-[#5C4F52] hover:text-[#221518]"
              }`}
            >
              <Type size={14} />
              <span>Add Custom Text</span>
            </button>
          </div>

          {/* ── TAB 1: UPLOAD PHOTO CONTROLS ── */}
          {customizeTab === "upload" && (
            <div className="space-y-4">
              
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D4B996] hover:border-[#5E1224] bg-[#FFFDF9] rounded-3xl p-6 text-center space-y-2 cursor-pointer transition-colors shadow-2xs group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="w-12 h-12 rounded-full bg-[#F9F4EE] border border-[#EFE7DC] group-hover:scale-110 text-[#5E1224] flex items-center justify-center mx-auto transition-transform">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#221518]">
                    {uploadedImage ? "Click to Replace Photo" : "Upload Your Photo / Logo / Artwork"}
                  </p>
                  <p className="text-[11px] text-[#736B6D] mt-0.5">
                    JPG, PNG, WEBP (Max. 15MB) • High Resolution Recommended
                  </p>
                </div>
                {uploadedImage && (
                  <div className="pt-1 flex items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      <Check size={12} /> Photo Loaded on Mockup
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Photo Controls (Scale, Position, Rotation) */}
              {uploadedImage && (
                <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 space-y-4 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#221518] flex items-center gap-1.5 pb-2 border-b border-[#EFE7DC]">
                    <Sliders size={14} className="text-[#5E1224]" />
                    <span>Photo Adjustments</span>
                  </h4>

                  {/* 1. Size / Zoom Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#5C4F52]">Photo Size / Zoom:</span>
                      <span className="font-mono font-bold text-[#221518]">{Math.round(imageScale * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImageScale((s) => Math.max(0.4, Number((s - 0.1).toFixed(2))))}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#EFE7DC] hover:bg-[#EFE7DC] text-[#221518]"
                        title="Zoom out"
                      >
                        <ZoomOut size={14} />
                      </button>
                      <input
                        type="range"
                        min="0.4"
                        max="2.0"
                        step="0.05"
                        value={imageScale}
                        onChange={(e) => setImageScale(parseFloat(e.target.value))}
                        className="flex-1 accent-[#5E1224] h-2 bg-[#FAF7F2] rounded-lg cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setImageScale((s) => Math.min(2.0, Number((s + 0.1).toFixed(2))))}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#EFE7DC] hover:bg-[#EFE7DC] text-[#221518]"
                        title="Zoom in"
                      >
                        <ZoomIn size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 2. Position Controls */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[#5C4F52]">Horizontal (X):</span>
                        <span className="font-mono text-[11px] text-[#736B6D]">{imagePosX}px</span>
                      </div>
                      <input
                        type="range"
                        min="-80"
                        max="80"
                        value={imagePosX}
                        onChange={(e) => setImagePosX(parseInt(e.target.value))}
                        className="w-full accent-[#5E1224] h-2 bg-[#FAF7F2] rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[#5C4F52]">Vertical (Y):</span>
                        <span className="font-mono text-[11px] text-[#736B6D]">{imagePosY}px</span>
                      </div>
                      <input
                        type="range"
                        min="-80"
                        max="80"
                        value={imagePosY}
                        onChange={(e) => setImagePosY(parseInt(e.target.value))}
                        className="w-full accent-[#5E1224] h-2 bg-[#FAF7F2] rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* 3. Rotation Slider & Quick Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#EFE7DC]/60 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImageRotation((r) => (r + 90) % 360)}
                        className="inline-flex items-center gap-1 text-xs font-bold bg-[#FAF7F2] hover:bg-[#EFE7DC] border border-[#EFE7DC] px-3 py-1.5 rounded-xl text-[#221518] transition-colors"
                      >
                        <RotateCw size={13} className="text-[#5E1224]" /> Rotate 90°
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePosX(0);
                          setImagePosY(0);
                          setImageScale(1);
                          setImageRotation(0);
                        }}
                        className="text-xs font-semibold text-[#736B6D] hover:text-[#5E1224] bg-[#FAF7F2] border border-[#EFE7DC] px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Center Reset
                      </button>
                    </div>

                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      ✓ Ready for Print
                    </span>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ── TAB 2: ADD TEXT CONTROLS ── */}
          {customizeTab === "text" && (
            <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 space-y-4 shadow-2xs">
              
              {/* Text Input */}
              <div>
                <label className="text-xs font-bold text-[#221518] block mb-1.5">
                  Enter Custom Name / Date / Quote:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="e.g. Rahul & Sneha ❤️"
                    className="w-full bg-[#FAF7F2] text-sm font-semibold text-[#221518] rounded-xl px-4 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224] pr-8"
                  />
                  {customText && (
                    <button
                      type="button"
                      onClick={() => setCustomText("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Text Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#736B6D] block">Quick Inspiration:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Rahul ❤️ Sneha", "Happy Birthday 🎉", "Super Dad 👑", "Best Mom Ever ❤️", "Forever Together ✨"].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setCustomText(sug)}
                      className="text-[11px] font-semibold bg-[#FAF7F2] hover:bg-rose-50 hover:text-[#5E1224] border border-[#EFE7DC] hover:border-rose-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Style Selection */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-[#221518] block">Typography Font Style:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setTextFontStyle("cursive")}
                    className={`p-2 rounded-xl text-xs border text-center transition-all cursor-pointer ${
                      textFontStyle === "cursive"
                        ? "border-[#5E1224] bg-rose-50 text-[#5E1224] font-bold shadow-2xs"
                        : "border-[#EFE7DC] bg-[#FAF7F2] text-[#5C4F52]"
                    }`}
                    style={{ fontFamily: "cursive" }}
                  >
                    Cursive Script
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextFontStyle("serif")}
                    className={`p-2 rounded-xl text-xs border text-center transition-all cursor-pointer ${
                      textFontStyle === "serif"
                        ? "border-[#5E1224] bg-rose-50 text-[#5E1224] font-bold shadow-2xs"
                        : "border-[#EFE7DC] bg-[#FAF7F2] text-[#5C4F52] font-serif"
                    }`}
                  >
                    Classic Serif
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextFontStyle("sans")}
                    className={`p-2 rounded-xl text-xs border text-center transition-all cursor-pointer ${
                      textFontStyle === "sans"
                        ? "border-[#5E1224] bg-rose-50 text-[#5E1224] font-bold shadow-2xs"
                        : "border-[#EFE7DC] bg-[#FAF7F2] text-[#5C4F52] font-sans"
                    }`}
                  >
                    Modern Sans
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextFontStyle("bold")}
                    className={`p-2 rounded-xl text-xs border text-center transition-all cursor-pointer ${
                      textFontStyle === "bold"
                        ? "border-[#5E1224] bg-rose-50 text-[#5E1224] font-bold shadow-2xs"
                        : "border-[#EFE7DC] bg-[#FAF7F2] text-[#5C4F52]"
                    }`}
                  >
                    Bold Impact
                  </button>
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#221518]">Text Color:</span>
                  <span className="font-mono text-[11px] text-[#736B6D]">{textColor}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: "Maroon", val: "#5E1224" },
                    { label: "Black", val: "#111111" },
                    { label: "Gold", val: "#D97706" },
                    { label: "Blue", val: "#2563EB" },
                    { label: "Crimson", val: "#DC2626" },
                    { label: "White", val: "#FFFFFF" },
                    { label: "Emerald", val: "#059669" },
                    { label: "Purple", val: "#7C3AED" },
                  ].map((col) => (
                    <button
                      key={col.val}
                      type="button"
                      title={col.label}
                      onClick={() => setTextColor(col.val)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        textColor === col.val ? "border-slate-900 scale-115 shadow-sm" : "border-slate-200"
                      }`}
                      style={{ backgroundColor: col.val }}
                    />
                  ))}
                </div>
              </div>

              {/* Font Size & Vertical Position Sliders */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#5C4F52]">Font Size:</span>
                    <span className="font-mono text-[11px] text-[#736B6D]">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="36"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-[#5E1224] h-2 bg-[#FAF7F2] rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#5C4F52]">Text Position (Y):</span>
                    <span className="font-mono text-[11px] text-[#736B6D]">{textPosY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={textPosY}
                    onChange={(e) => setTextPosY(parseInt(e.target.value))}
                    className="w-full accent-[#5E1224] h-2 bg-[#FAF7F2] rounded-lg cursor-pointer"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Sticky Bottom Action Buttons */}
          <div className="sticky bottom-4 z-20 pt-2 space-y-2 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-[#EFE7DC] shadow-lg">
            <button
              onClick={handleAddToCart}
              disabled={isCompositing}
              className="w-full bg-[#5E1224] hover:bg-[#470A18] disabled:opacity-75 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={16} />
              <span>
                {isCompositing ? "Saving Custom Mockup..." : `ADD CUSTOMIZED TO CART – ${formatPrice(product.price * quantity)}`}
              </span>
            </button>

            <div className="flex items-center justify-between px-2 text-xs">
              <span className="text-[#736B6D]">
                {uploadedImage || customText ? "✨ Custom mockup will be preserved in cart" : "No customization added yet"}
              </span>
              <button
                onClick={handleBuyNow}
                disabled={isCompositing}
                className="font-bold text-[#5E1224] hover:underline"
              >
                Direct Buy Now →
              </button>
            </div>
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#221518] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#221518] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
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
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
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
                    <span className="font-bold text-[#221518]">{product.rating ? product.rating.toFixed(1) : "4.8"}</span>
                    <span>({product.reviewsCount || 120} reviews)</span>
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
                    className="p-2.5 hover:bg-[#EFE7DC] transition-colors text-[#221518] cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-xs font-bold text-[#221518]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 hover:bg-[#EFE7DC] transition-colors text-[#221518] cursor-pointer"
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
                    className="text-xs font-bold text-[#736B6D] hover:text-[#5E1224] underline transition-colors cursor-pointer"
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
