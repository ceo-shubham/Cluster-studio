"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, ChevronRight, Star, Heart, ShoppingBag, 
  Upload, Type, Check, Sparkles, ShieldCheck, Truck, 
  RefreshCw, Plus, Minus, Image as ImageIcon, ArrowLeft,
  X, CheckCircle, Info, Trash2, ZoomIn, ZoomOut, RotateCw,
  Move, Sliders, Layers, MousePointer, Maximize2
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
  
  // ── Customizer Mode State ──
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizeTab, setCustomizeTab] = useState<"upload" | "text">("upload");
  const [selectedElement, setSelectedElement] = useState<"image" | "text" | null>(null);

  // Photo State (Normalized -0.5 to +0.5 relative to preview center)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imgX, setImgX] = useState<number>(0);
  const [imgY, setImgY] = useState<number>(0);
  const [imageScale, setImageScale] = useState<number>(1);
  const [imageRotation, setImageRotation] = useState<number>(0);

  // Text State (Normalized -0.5 to +0.5 relative to preview center)
  const [customText, setCustomText] = useState("");
  const [textX, setTextX] = useState<number>(0);
  const [textY, setTextY] = useState<number>(0.2);
  const [textColor, setTextColor] = useState("#5E1224");
  const [fontSize, setFontSize] = useState(20);
  const [textFontStyle, setTextFontStyle] = useState<"cursive" | "serif" | "sans" | "bold">("cursive");
  const [textRotation, setTextRotation] = useState<number>(0);

  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    target: "image" | "text";
    startX: number;
    startY: number;
    initialElemX: number;
    initialElemY: number;
  } | null>(null);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompositing, setIsCompositing] = useState(false);

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
      setImgX(0);
      setImgY(0);
      setImageScale(1);
      setImageRotation(0);
      setSelectedElement("image");
      toast.success("Photo added! Drag anywhere on the product.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUploadedImage(null);
    setSelectedElement(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Uploaded photo removed");
  };

  const handleResetDesign = () => {
    setUploadedImage(null);
    setImgX(0);
    setImgY(0);
    setImageScale(1);
    setImageRotation(0);
    setCustomText("");
    setTextX(0);
    setTextY(0.2);
    setTextRotation(0);
    setSelectedElement(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Design reset");
  };

  /* ── Direct Freeform Dragging Handlers ── */
  const startDrag = (target: "image" | "text", clientX: number, clientY: number) => {
    setSelectedElement(target);
    setIsDragging(true);
    dragRef.current = {
      target,
      startX: clientX,
      startY: clientY,
      initialElemX: target === "image" ? imgX : textX,
      initialElemY: target === "image" ? imgY : textY,
    };
  };

  const onPointerDownImage = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startDrag("image", clientX, clientY);
  };

  const onPointerDownText = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startDrag("text", clientX, clientY);
  };

  const onPointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragRef.current || !previewContainerRef.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const rect = previewContainerRef.current.getBoundingClientRect();
    const deltaNormX = (clientX - dragRef.current.startX) / rect.width;
    const deltaNormY = (clientY - dragRef.current.startY) / rect.height;

    if (dragRef.current.target === "image") {
      const newX = Math.max(-0.48, Math.min(0.48, dragRef.current.initialElemX + deltaNormX));
      const newY = Math.max(-0.48, Math.min(0.48, dragRef.current.initialElemY + deltaNormY));
      setImgX(newX);
      setImgY(newY);
    } else if (dragRef.current.target === "text") {
      const newX = Math.max(-0.48, Math.min(0.48, dragRef.current.initialElemX + deltaNormX));
      const newY = Math.max(-0.48, Math.min(0.48, dragRef.current.initialElemY + deltaNormY));
      setTextX(newX);
      setTextY(newY);
    }
  }, []);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    dragRef.current = null;
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onPointerMove);
      window.addEventListener("mouseup", onPointerUp);
      window.addEventListener("touchmove", onPointerMove, { passive: false });
      window.addEventListener("touchend", onPointerUp);
      return () => {
        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);
        window.removeEventListener("touchmove", onPointerMove);
        window.removeEventListener("touchend", onPointerUp);
      };
    }
  }, [isDragging, onPointerMove, onPointerUp]);

  /* ── Canvas High-Res Composite Generator ── */
  const generateCompositeImage = async (): Promise<string> => {
    if (!uploadedImage && !customText.trim()) {
      return product.image;
    }

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(uploadedImage || product.image);
        return;
      }

      const baseImg = new window.Image();
      baseImg.crossOrigin = "anonymous";
      baseImg.src = product.image;

      baseImg.onload = () => {
        // 1. Draw base product mockup (clean 800x800)
        ctx.drawImage(baseImg, 0, 0, 800, 800);

        // 2. Draw user uploaded photo borderless with exact natural aspect ratio
        if (uploadedImage) {
          const userImg = new window.Image();
          userImg.crossOrigin = "anonymous";
          userImg.src = uploadedImage;

          userImg.onload = () => {
            ctx.save();
            const cx = (0.5 + imgX) * 800;
            const cy = (0.5 + imgY) * 800;
            ctx.translate(cx, cy);
            ctx.rotate((imageRotation * Math.PI) / 180);

            // Natural aspect ratio sizing
            const baseDim = 280 * imageScale;
            const iw = userImg.naturalWidth || 200;
            const ih = userImg.naturalHeight || 200;
            const aspect = iw / ih;
            let dw = baseDim;
            let dh = baseDim;
            if (aspect > 1) {
              dh = baseDim / aspect;
            } else {
              dw = baseDim * aspect;
            }

            ctx.drawImage(userImg, -dw / 2, -dh / 2, dw, dh);
            ctx.restore();

            // 3. Draw text after image
            if (customText.trim()) {
              drawTextOnCanvas(ctx);
            }

            resolve(canvas.toDataURL("image/png"));
          };

          userImg.onerror = () => {
            if (customText.trim()) {
              drawTextOnCanvas(ctx);
            }
            resolve(canvas.toDataURL("image/png"));
          };
        } else if (customText.trim()) {
          drawTextOnCanvas(ctx);
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

  const drawTextOnCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    const cx = (0.5 + textX) * 800;
    const cy = (0.5 + textY) * 800;
    ctx.translate(cx, cy);
    ctx.rotate((textRotation * Math.PI) / 180);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColor;
    
    let fontFam = "sans-serif";
    if (textFontStyle === "cursive") fontFam = "cursive, 'Brush Script MT', italic";
    else if (textFontStyle === "serif") fontFam = "Georgia, serif";
    else if (textFontStyle === "bold") fontFam = "Impact, sans-serif";

    ctx.font = `bold ${Math.round(fontSize * 1.6)}px ${fontFam}`;
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 4;
    ctx.fillText(customText, 0, 0);
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
        imgX,
        imgY,
        imageRotation,
        textX,
        textY,
        textRotation,
      });

      for (let i = 0; i < quantity; i++) {
        addItemToCart(
          product, 
          uploadedImage || (customText ? `text:${customText}` : undefined), 
          finalCompositeUrl,
          canvasState
        );
      }
      toast.success(`${product.name} with custom print added to cart!`);
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
        imgX,
        imgY,
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
      {/* ── SCREEN 4: FREEFORM LIVE CUSTOMIZER STUDIO ─────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isCustomizing ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5E1224] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles size={12} /> Freeform Studio
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#221518]">
                Customize Your {product.name}
              </h1>
              <p className="text-xs text-[#736B6D] mt-0.5">
                Drag and position photo and text freely anywhere on the product. No frames or restrictions.
              </p>
            </div>
            <button
              onClick={() => setIsCustomizing(false)}
              className="px-3.5 py-2 rounded-xl bg-[#F5ECE1] text-[#221518] hover:bg-[#EFE7DC] text-xs font-bold transition-colors cursor-pointer"
            >
              ✕ Exit
            </button>
          </div>

          {/* ── FREE-ROAM INTERACTIVE MOCKUP STAGE ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#736B6D] flex items-center gap-1.5">
                <MousePointer size={14} className="text-[#5E1224]" />
                <span>Live Freeform Preview</span>
              </span>

              {(uploadedImage || customText) && (
                <button
                  onClick={handleResetDesign}
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} /> Reset
                </button>
              )}
            </div>

            {/* STAGE CONTAINER: Click anywhere outside to deselect */}
            <div 
              ref={previewContainerRef}
              onClick={() => setSelectedElement(null)}
              className="relative aspect-square sm:aspect-4/3 w-full rounded-3xl bg-[#F9F4EE] border border-[#EFE7DC] flex items-center justify-center overflow-hidden shadow-inner select-none cursor-default"
              style={{ touchAction: "none" }}
            >
              
              {/* 1. Base Clean Product Mockup from /showimg/ */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain pointer-events-none select-none z-0"
              />

              {/* 2. FREEFORM BORDERLESS USER PHOTO (NO BOX / NO FRAME) */}
              {uploadedImage && (
                <div
                  onMouseDown={onPointerDownImage}
                  onTouchStart={onPointerDownImage}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement("image");
                    setCustomizeTab("upload");
                  }}
                  style={{
                    position: "absolute",
                    left: `${(0.5 + imgX) * 100}%`,
                    top: `${(0.5 + imgY) * 100}%`,
                    transform: `translate(-50%, -50%) scale(${imageScale}) rotate(${imageRotation}deg)`,
                    zIndex: selectedElement === "image" ? 30 : 20,
                    cursor: isDragging && dragRef.current?.target === "image" ? "grabbing" : "grab",
                  }}
                  className="select-none inline-flex items-center justify-center relative p-1"
                >
                  {/* Pure Frameless Image with natural proportions */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploadedImage}
                    alt="User design"
                    className="max-w-[140px] sm:max-w-[200px] max-h-[140px] sm:max-h-[200px] w-auto h-auto object-contain pointer-events-none select-none drop-shadow-xs block"
                  />

                  {/* Subtle Selection Indicator with Mini Floating Controls */}
                  {selectedElement === "image" && (
                    <>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#221518]/90 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg pointer-events-auto whitespace-nowrap z-40">
                        <span className="text-amber-300">Photo</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageScale((s) => Math.min(3.0, Number((s + 0.15).toFixed(2))));
                          }}
                          className="px-1 hover:text-amber-300 font-mono"
                          title="Zoom in"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageScale((s) => Math.max(0.2, Number((s - 0.15).toFixed(2))));
                          }}
                          className="px-1 hover:text-amber-300 font-mono"
                          title="Zoom out"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageRotation((r) => (r + 45) % 360);
                          }}
                          className="px-1 hover:text-amber-300"
                          title="Rotate"
                        >
                          <RotateCw size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-1 hover:text-rose-400 text-rose-300"
                          title="Delete"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 3. FREEFORM BORDERLESS CUSTOM TEXT */}
              {customText && (
                <div
                  onMouseDown={onPointerDownText}
                  onTouchStart={onPointerDownText}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement("text");
                    setCustomizeTab("text");
                  }}
                  style={{
                    position: "absolute",
                    left: `${(0.5 + textX) * 100}%`,
                    top: `${(0.5 + textY) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${textRotation}deg)`,
                    zIndex: selectedElement === "text" ? 35 : 25,
                    cursor: isDragging && dragRef.current?.target === "text" ? "grabbing" : "grab",
                  }}
                  className="select-none relative px-2 py-1"
                >
                  <p
                    style={{
                      color: textColor,
                      fontFamily: getFontFamilyCss(),
                      fontSize: `${fontSize}px`,
                    }}
                    className="font-bold drop-shadow-xs leading-tight text-center whitespace-nowrap select-none pointer-events-none"
                  >
                    {customText}
                  </p>

                  {/* Active Selection Floating Controls for Text */}
                  {selectedElement === "text" && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#221518]/90 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg pointer-events-auto whitespace-nowrap z-40">
                      <span className="text-amber-300">Text</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFontSize((s) => Math.min(48, s + 2));
                        }}
                        className="px-1 hover:text-amber-300"
                        title="Bigger text"
                      >
                        A+
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFontSize((s) => Math.max(12, s - 2));
                        }}
                        className="px-1 hover:text-amber-300"
                        title="Smaller text"
                      >
                        A-
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomText("");
                          setSelectedElement(null);
                        }}
                        className="px-1 hover:text-rose-400 text-rose-300"
                        title="Delete"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Empty State Placeholder when nothing is added */}
              {!uploadedImage && !customText && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center z-10 cursor-pointer p-6 group"
                >
                  <div className="bg-white/85 backdrop-blur-md border border-[#EFE7DC] group-hover:border-[#5E1224] rounded-2xl p-4 sm:p-5 text-center shadow-lg transition-transform group-hover:scale-105 max-w-xs space-y-2">
                    <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-[#5E1224] flex items-center justify-center mx-auto">
                      <Upload size={20} />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-sm text-[#221518]">
                        Click to Upload Photo or Add Text
                      </p>
                      <p className="text-[11px] text-[#736B6D] mt-0.5">
                        Free placement anywhere on the product
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            <p className="text-[11px] text-[#736B6D] italic text-center">
              🖐️ Drag photo or text anywhere on the product mockup freely!
            </p>
          </div>

          {/* Toggle Tabs: [ 📷 Photo Tools ] | [ ✍️ Text Tools ] */}
          <div className="grid grid-cols-2 gap-2 bg-[#F5ECE1] p-1.5 rounded-2xl">
            <button
              onClick={() => {
                setCustomizeTab("upload");
                if (uploadedImage) setSelectedElement("image");
              }}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                customizeTab === "upload"
                  ? "bg-[#5E1224] text-white shadow-xs"
                  : "text-[#5C4F52] hover:text-[#221518]"
              }`}
            >
              <Upload size={14} />
              <span>Photo Tools</span>
            </button>
            <button
              onClick={() => {
                setCustomizeTab("text");
                if (customText) setSelectedElement("text");
              }}
              className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                customizeTab === "text"
                  ? "bg-[#5E1224] text-white shadow-xs"
                  : "text-[#5C4F52] hover:text-[#221518]"
              }`}
            >
              <Type size={14} />
              <span>Custom Text Tools</span>
            </button>
          </div>

          {/* ── TAB 1: UPLOAD & PHOTO POSITIONING CONTROLS ── */}
          {customizeTab === "upload" && (
            <div className="space-y-4">
              
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D4B996] hover:border-[#5E1224] bg-[#FFFDF9] rounded-3xl p-5 text-center space-y-2 cursor-pointer transition-colors shadow-2xs group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="w-10 h-10 rounded-full bg-[#F9F4EE] border border-[#EFE7DC] group-hover:scale-110 text-[#5E1224] flex items-center justify-center mx-auto transition-transform">
                  <Upload size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#221518]">
                    {uploadedImage ? "Click to Replace Photo" : "Upload Your Photo / Logo / Artwork"}
                  </p>
                  <p className="text-[11px] text-[#736B6D] mt-0.5">
                    JPG, PNG, WEBP (Max. 15MB) • Frameless Free Placement
                  </p>
                </div>
                {uploadedImage && (
                  <div className="pt-1 flex items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      <Check size={12} /> Photo Added to Mockup
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

              {/* Photo Sliders & Preset Placement */}
              {uploadedImage && (
                <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 space-y-4 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#221518] flex items-center gap-1.5 pb-2 border-b border-[#EFE7DC]">
                    <Sliders size={14} className="text-[#5E1224]" />
                    <span>Photo Adjustments</span>
                  </h4>

                  {/* 1. Size / Zoom Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#5C4F52]">Photo Size / Scale:</span>
                      <span className="font-mono font-bold text-[#221518]">{Math.round(imageScale * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImageScale((s) => Math.max(0.2, Number((s - 0.1).toFixed(2))))}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#EFE7DC] hover:bg-[#EFE7DC] text-[#221518]"
                        title="Zoom out"
                      >
                        <ZoomOut size={14} />
                      </button>
                      <input
                        type="range"
                        min="0.2"
                        max="3.0"
                        step="0.05"
                        value={imageScale}
                        onChange={(e) => setImageScale(parseFloat(e.target.value))}
                        className="flex-1 accent-[#5E1224] h-2 bg-[#FAF7F2] rounded-lg cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setImageScale((s) => Math.min(3.0, Number((s + 0.1).toFixed(2))))}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#EFE7DC] hover:bg-[#EFE7DC] text-[#221518]"
                        title="Zoom in"
                      >
                        <ZoomIn size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 2. Position X & Y Sliders */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[#5C4F52]">Horizontal (X):</span>
                        <span className="font-mono text-[11px] text-[#736B6D]">{Math.round(imgX * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="-0.48"
                        max="0.48"
                        step="0.01"
                        value={imgX}
                        onChange={(e) => setImgX(parseFloat(e.target.value))}
                        className="w-full accent-[#5E1224] h-2 bg-[#FAF7F2] rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[#5C4F52]">Vertical (Y):</span>
                        <span className="font-mono text-[11px] text-[#736B6D]">{Math.round(imgY * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="-0.48"
                        max="0.48"
                        step="0.01"
                        value={imgY}
                        onChange={(e) => setImgY(parseFloat(e.target.value))}
                        className="w-full accent-[#5E1224] h-2 bg-[#FAF7F2] rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* 3. Quick Placement Buttons */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-[#736B6D] block">Quick Alignment:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => { setImgX(0); setImgY(0); }}
                        className="text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE7DC] border border-[#EFE7DC] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Center
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImgX(-0.22); setImgY(0); }}
                        className="text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE7DC] border border-[#EFE7DC] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Left Face
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImgX(0.22); setImgY(0); }}
                        className="text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE7DC] border border-[#EFE7DC] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Right Face
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImgX(0); setImgY(-0.25); }}
                        className="text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE7DC] border border-[#EFE7DC] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Top
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImgX(0); setImgY(0.25); }}
                        className="text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE7DC] border border-[#EFE7DC] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Bottom
                      </button>
                    </div>
                  </div>

                  {/* 4. Rotation Slider */}
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
                          setImgX(0);
                          setImgY(0);
                          setImageScale(1);
                          setImageRotation(0);
                        }}
                        className="text-xs font-semibold text-[#736B6D] hover:text-[#5E1224] bg-[#FAF7F2] border border-[#EFE7DC] px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Reset
                      </button>
                    </div>

                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      ✓ Direct Print Ready
                    </span>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ── TAB 2: ADD & POSITION CUSTOM TEXT ── */}
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
                    onChange={(e) => {
                      setCustomText(e.target.value);
                      setSelectedElement("text");
                    }}
                    placeholder="e.g. Rahul & Sneha ❤️"
                    className="w-full bg-[#FAF7F2] text-sm font-semibold text-[#221518] rounded-xl px-4 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224] pr-8"
                  />
                  {customText && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomText("");
                        setSelectedElement(null);
                      }}
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
                      onClick={() => {
                        setCustomText(sug);
                        setSelectedElement("text");
                      }}
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

              {/* Font Size & Position Sliders */}
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#5C4F52]">Font Size:</span>
                    <span className="font-mono text-[11px] text-[#736B6D]">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-[#5E1224] h-2 bg-[#FAF7F2] rounded-lg cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#5C4F52]">Horizontal (X):</span>
                      <span className="font-mono text-[11px] text-[#736B6D]">{Math.round(textX * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="-0.48"
                      max="0.48"
                      step="0.01"
                      value={textX}
                      onChange={(e) => setTextX(parseFloat(e.target.value))}
                      className="w-full accent-[#5E1224] h-2 bg-[#FAF7F2] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#5C4F52]">Vertical (Y):</span>
                      <span className="font-mono text-[11px] text-[#736B6D]">{Math.round(textY * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="-0.48"
                      max="0.48"
                      step="0.01"
                      value={textY}
                      onChange={(e) => setTextY(parseFloat(e.target.value))}
                      className="w-full accent-[#5E1224] h-2 bg-[#FAF7F2] rounded-lg cursor-pointer"
                    />
                  </div>
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
                {uploadedImage || customText ? "✨ Exact print placement will be saved in order" : "No customization added yet"}
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
