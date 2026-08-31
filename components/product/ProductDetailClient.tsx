"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, ChevronLeft, Star, Heart, ShoppingBag, 
  Sparkles, CheckCircle, ShieldCheck, Truck, RefreshCw, 
  Upload, MessageCircle, ArrowRight 
} from "lucide-react";
import { getProductById, products, reviewPhotos, customerReviews } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import ImageEditor from "@/components/editor/ImageEditor";
import ProductCard from "@/components/product/ProductCard";
import toast from "react-hot-toast";

export default function ProductDetailClient() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);
  const router = useRouter();

  const addItemToCart = useCartStore((s) => s.addItem);
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0] || "#111111");
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "shipping">("desc");
  
  // Customization state
  const [showEditor, setShowEditor] = useState(false);
  const [finalDataUrl, setFinalDataUrl] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Product Not Found</h2>
        <p className="text-gray-500 text-sm mt-2">The product you are looking for does not exist or has been moved.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 bg-[#670D1F] text-white text-xs font-bold px-6 py-3 rounded-xl shadow hover:bg-[#520817] transition-colors"
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

  const handleEditorComplete = (dataUrl: string, url: string) => {
    setFinalDataUrl(dataUrl);
    setUploadedUrl(url);
    setShowEditor(false);
    toast.success("Personalized design saved! Ready to add to cart.");
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItemToCart(product, uploadedUrl || undefined, finalDataUrl || undefined);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItemToCart(product, uploadedUrl || undefined, finalDataUrl || undefined);
    }
    router.push("/checkout");
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Related products
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
      
      {/* ── Breadcrumb Navigation ── */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-[#670D1F] transition-colors">Home</Link>
        <ChevronRight size={13} className="text-gray-400" />
        <Link href="/#products" className="hover:text-[#670D1F] transition-colors">{product.category}</Link>
        <ChevronRight size={13} className="text-gray-400" />
        <span className="text-gray-900 font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* ── Modal Canvas Editor Overlay ── */}
      {showEditor && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
          <div 
            onClick={() => setShowEditor(false)} 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
          />
          
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-rose-100 z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-gray-900">
                  Personalize Your {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Upload your photo/logo and position it directly on the product.
                </p>
              </div>
              <button
                onClick={() => setShowEditor(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm transition-colors"
                aria-label="Close editor"
              >
                ✕
              </button>
            </div>
            
            <ImageEditor 
              product={product} 
              onComplete={handleEditorComplete}
              onCancel={() => setShowEditor(false)}
            />
          </div>
        </div>
      )}

      {/* ── Main Product Display (Gallery + Info) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Gallery Column */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Vertical Thumbnail Strip */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] scrollbar-hide shrink-0">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white shrink-0 border-2 transition-all p-1 ${
                    activeImageIndex === i
                      ? "border-[#670D1F] ring-2 ring-rose-200 shadow-md"
                      : "border-gray-200 hover:border-[#670D1F]/50"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumb ${i}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>

            {/* Main Active Image View with Carousel Controls */}
            <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-white shadow-md border border-amber-100/80 p-4">
              
              {finalDataUrl ? (
                <Image
                  src={finalDataUrl}
                  alt="Custom preview"
                  fill
                  className="object-contain p-4 animate-in fade-in duration-300"
                />
              ) : (
                <Image
                  src={galleryImages[activeImageIndex] || product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}

              {/* Badges on main image */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                {product.isBestSeller && (
                  <span className="bg-amber-400 text-gray-950 text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <Sparkles size={12} /> BEST SELLER
                  </span>
                )}
                {finalDataUrl && (
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <CheckCircle size={12} /> Personalized Design Applied
                  </span>
                )}
              </div>

              {/* Carousel Arrows */}
              {galleryImages.length > 1 && !finalDataUrl && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-white transition-transform hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-white transition-transform hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Right Product Info Column */}
          <div className="lg:col-span-5 space-y-6">
            
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#670D1F] uppercase tracking-wider">
                  {product.category}
                </span>
                <button
                  onClick={handleWishlistToggle}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-rose-600"
                >
                  <Heart size={16} className={wishlisted ? "fill-rose-600 text-rose-600" : ""} />
                  {wishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
                {product.name}
              </h1>

              {/* Star rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-600">
                  ({product.reviewsCount ?? 245} Reviews)
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="space-y-1 bg-[#FAF7F2] p-4 rounded-2xl border border-amber-100/70">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#670D1F]">
                  {formatPrice(product.price)}
                </span>
                {product.mrp && (
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(product.mrp)}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2 py-0.5 rounded-md">
                    {product.discount}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">Inclusive of all taxes • Free Pan-India Delivery</p>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">
                  Color: <span className="font-normal text-gray-600">{selectedColor === "#FFFFFF" ? "White" : selectedColor === "#111111" ? "Black" : "Custom"}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((clr, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(clr)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === clr ? "ring-2 ring-[#670D1F] scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: clr }}
                      aria-label={`Select color ${clr}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-gray-100 text-sm font-bold transition-colors"
                >
                  −
                </button>
                <span className="px-4 text-xs font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 hover:bg-gray-100 text-sm font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* ── Personalize This Product Box ── */}
            <div className="bg-white rounded-2xl p-4 border-2 border-dashed border-[#670D1F]/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#670D1F]" />
                  Personalize This {product.name}
                </h4>
                {finalDataUrl && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    ✓ 2 Print Assets Ready
                  </span>
                )}
              </div>

              {/* Customization Status & Previews */}
              {finalDataUrl ? (
                <div className="bg-rose-50/60 rounded-xl p-3 border border-rose-100 space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Original Photo */}
                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-center space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Your Photo</span>
                      <div className="relative w-full h-20 rounded-md overflow-hidden bg-slate-100">
                        <Image src={uploadedUrl || finalDataUrl} alt="Uploaded" fill className="object-contain" />
                      </div>
                    </div>

                    {/* Final Print Canvas */}
                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-center space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Final Mockup</span>
                      <div className="relative w-full h-20 rounded-md overflow-hidden bg-slate-100">
                        <Image src={finalDataUrl} alt="Final Design" fill className="object-contain" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEditor(true)}
                      className="flex-1 bg-[#670D1F] hover:bg-[#520817] text-white font-bold py-2 rounded-lg transition-colors text-xs text-center"
                    >
                      Reposition / Edit
                    </button>
                    <button
                      onClick={() => {
                        setFinalDataUrl("");
                        setUploadedUrl("");
                        toast.success("Customization reset");
                      }}
                      className="px-3 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold py-2 rounded-lg transition-colors text-xs text-center"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                /* Upload Image Button */
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Upload Image / Photo</span>
                    <span className="text-[10px] text-gray-400">PNG, JPG up to 10MB</span>
                  </div>
                  <button
                    onClick={() => setShowEditor(true)}
                    className="w-full flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-rose-50 border border-amber-200 text-[#670D1F] font-bold py-2.5 rounded-xl transition-colors text-xs shadow-sm"
                  >
                    <Upload size={14} />
                    <span>Upload &amp; Position Design</span>
                  </button>
                </div>
              )}

              {/* Add Custom Text */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Add Custom Text / Name (Optional)</span>
                  <span className="text-[10px] text-gray-400">Name, Date, Quote</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter custom text for engraving/print..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-[#FAF7F2] text-gray-900 text-xs rounded-xl px-3 py-2 outline-none border border-amber-200 focus:border-[#670D1F]"
                />
              </div>

              <p className="text-[10px] text-gray-400 italic text-center">
                Both original photo and final composite canvas are saved with your order.
              </p>
            </div>

            {/* CTA Buttons (Add to Cart + Buy Now) */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-[#670D1F] hover:bg-[#520817] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm uppercase tracking-wide"
              >
                <ShoppingBag size={18} />
                ADD TO CART
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-white hover:bg-rose-50 border-2 border-[#670D1F] text-[#670D1F] font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wide shadow-sm"
              >
                BUY NOW
              </button>
            </div>

          </div>

        </div>

      {/* ── 4 Feature Badges Ribbon ── */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-amber-100/70 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Sparkles size={20} className="text-[#670D1F]" />, title: "Premium Quality", desc: "High quality printing" },
          { icon: <RefreshCw size={20} className="text-[#670D1F]" />, title: "Dishwasher Safe", desc: "Easy to clean" },
          { icon: <ShieldCheck size={20} className="text-[#670D1F]" />, title: "Microwave Safe", desc: "Heat resistant" },
          { icon: <Truck size={20} className="text-[#670D1F]" />, title: "Gift Ready", desc: "Perfectly packed" },
        ].map((badge, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
              {badge.icon}
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900">{badge.title}</h4>
              <p className="text-[11px] text-gray-500">{badge.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Tabs Section (Description, Specification, Shipping) + WhatsApp box ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Tab Content */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100/70">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 border-b border-gray-100 pb-3">
            {[
              { id: "desc", label: "Description" },
              { id: "specs", label: "Specification" },
              { id: "shipping", label: "Shipping & Returns" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-sm font-bold transition-colors relative pb-3 -mb-3 ${
                  activeTab === tab.id
                    ? "text-[#670D1F] border-b-2 border-[#670D1F]"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div className="pt-6 text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
            {activeTab === "desc" && (
              <div className="space-y-3">
                <p>{product.description}</p>
                <ul className="list-disc list-inside space-y-1.5 text-gray-600 pl-2">
                  <li>Heat-sensitive / Premium ceramic finish</li>
                  <li>High quality food-grade non-toxic materials</li>
                  <li>Permanent vivid colors that never fade away</li>
                  <li>Comfortable grip with smooth polished edges</li>
                </ul>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-3">
                {product.specificationsList && product.specificationsList.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-600 pl-2">
                    {product.specificationsList.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{product.specs || "Standard custom print specifications apply."}</p>
                )}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-3 text-gray-600">
                <p><strong>Processing Time:</strong> Custom prints are manufactured and quality tested within 24-48 hours.</p>
                <p><strong>Delivery:</strong> 3-5 business days across all Indian pincodes via express courier.</p>
                <p><strong>Returns:</strong> 100% free replacement if received in damaged or defect condition.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right: WhatsApp Help Card */}
        <div className="lg:col-span-4 bg-emerald-50 rounded-3xl p-6 border border-emerald-200/60 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Live Assistance</span>
            <h4 className="font-serif font-bold text-lg text-emerald-950 mt-0.5">Need Help with Customization?</h4>
            <p className="text-xs text-emerald-800/80 mt-1 leading-relaxed">
              Have specific photo collage requests or corporate bulk requirements? Chat directly with our design artisans on WhatsApp.
            </p>
          </div>

          <a
            href={`https://wa.me/918380808435?text=${encodeURIComponent(`Hi! I need help customizing ${product.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-xl transition-colors shadow-md text-xs"
          >
            <MessageCircle size={16} />
            Chat with us on WhatsApp
          </a>
        </div>

      </div>

      {/* ── Customer Review Photos ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#670D1F] uppercase tracking-wider block">Photo Proofs</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
              Customer Review Photos
            </h3>
          </div>
          <a href="#reviews" className="text-xs font-bold text-[#670D1F] hover:underline">
            View all reviews →
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {reviewPhotos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-2xl p-2.5 shadow-sm border border-amber-100/70 space-y-2">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-rose-50 border border-gray-100">
                <Image
                  src={photo.image}
                  alt={`Review by ${photo.name}`}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <div className="flex text-amber-400">
                  {[...Array(photo.rating)].map((_, i) => (
                    <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-bold text-gray-800 mt-0.5">{photo.name}</p>
                <span className="text-[10px] text-gray-400 truncate block">{photo.productTitle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Customer Reviews List ── */}
      <section id="reviews" className="space-y-4">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
          Customer Reviews
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customerReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100/70 flex gap-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-11 h-11 rounded-full object-cover shrink-0 border border-amber-200"
              />

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900">{rev.name}</h4>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle size={10} /> Verified Buyer
                  </span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed italic pt-1">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-rose-50 shrink-0 border border-gray-100 self-center">
                <Image src={rev.productImage} alt={rev.productName} fill className="object-contain p-0.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── You May Also Like ── */}
      <section className="space-y-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
            You May Also Like
          </h3>
          <Link href="/#products" className="text-xs font-bold text-[#670D1F] hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── Pan India Trust Strip ── */}
      <section className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-serif font-extrabold text-[#670D1F]">10K+</span>
            <span className="text-xs text-gray-500 mt-0.5">Happy Customers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-serif font-extrabold text-[#670D1F]">4.8 ★</span>
            <span className="text-xs text-gray-500 mt-0.5">Average Rating</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-serif font-extrabold text-[#670D1F]">100%</span>
            <span className="text-xs text-gray-500 mt-0.5">Secure Payments</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-serif font-extrabold text-[#670D1F]">Pan India</span>
            <span className="text-xs text-gray-500 mt-0.5">Fast Doorstep Delivery</span>
          </div>
        </div>
      </section>

    </div>
  );
}
