"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, ChevronLeft, Star, Heart, Sparkles, ShieldCheck, 
  Truck, ArrowRight, Gift, Award, Lock, Edit3
} from "lucide-react";
import { products, customerReviews, getProductsByCategory } from "@/lib/products";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";

const HERO_SLIDES = [
  {
    tag: "Made for you, loved by all.",
    titlePrefix: "Personalized",
    titleMain: "Gifts that speak your story.",
    subtitle: "Custom mugs, t-shirts, bottles and more – made just for you with high definition printing and premium materials.",
    buttonText: "SHOP NOW",
    buttonLink: "#products",
    image: "/bannerimg/1 (1).jpeg",
    alt: "Personalized White Mug",
  },
  {
    tag: "Heat-Sensitive Magic",
    titlePrefix: "Magic Mugs",
    titleMain: "Watch memories reveal with hot tea or coffee.",
    subtitle: "Pour hot liquid and watch your personalized photo magically appear right before your eyes.",
    buttonText: "CUSTOMIZE MAGIC MUG",
    buttonLink: "/product/1-4",
    image: "/bannerimg/1 (4).jpeg",
    alt: "Personalized Magic Mug",
  },
  {
    tag: "Everyday Hydration",
    titlePrefix: "Custom Bottles",
    titleMain: "Keep hydration stylish, pure and leak-proof.",
    subtitle: "Food-grade stainless steel sipper bottles customized with your name, gym quotes, and photos.",
    buttonText: "EXPLORE BOTTLES",
    buttonLink: "/category/bottles",
    image: "/bannerimg/1 (5).jpeg",
    alt: "Personalized Sipper Bottle",
  },
  {
    tag: "Handcrafted With Love",
    titlePrefix: "Couple & Combos",
    titleMain: "Special gifts for every couple and anniversary.",
    subtitle: "Matching heart-handle couple mugs, custom cushions and keepsake photo frames crafted for you.",
    buttonText: "VIEW COMBOS",
    buttonLink: "/category/combos",
    image: "/bannerimg/1 (7).jpeg",
    alt: "Couple Mugs and Combos",
  },
];

const CATEGORY_PILLS = [
  { name: "Mugs", slug: "mugs", iconSvg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  )},
  { name: "Clothing", slug: "clothing", iconSvg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  )},
  { name: "Bottles", slug: "bottles", iconSvg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2h8v4H8z" />
      <path d="M9 6v3L6 11v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V11l-3-2V6" />
      <path d="M10 14h4" />
    </svg>
  )},
  { name: "Keychains", slug: "keychains", iconSvg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M12 11v11" />
      <path d="M12 17h3" />
      <path d="M12 20h2" />
    </svg>
  )},
  { name: "Combos", slug: "combos", iconSvg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13" />
      <path d="M19 12H5" />
      <path d="M12 8C12 8 8 3 5 5C2 7 8 8 12 8Z" />
      <path d="M12 8C12 8 16 3 19 5C22 7 16 8 12 8Z" />
    </svg>
  )},
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [heroSlide, setHeroSlide] = useState(0);

  // Auto-advance hero carousel every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setHeroSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const currentSlide = HERO_SLIDES[heroSlide];

  // Best sellers items
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  // Filtered catalog
  const catalogProducts =
    activeCategory === "all"
      ? products
      : getProductsByCategory(activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-14">
      
      {/* ── 1. HERO CAROUSEL SECTION ── */}
      <section className="relative rounded-3xl bg-[#F9F4EE] border border-[#EFE7DC] overflow-hidden p-6 sm:p-12 shadow-xs group">
        
        {/* Left / Right Carousel Nav Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-[#5E1224] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-[#5E1224] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[320px]">
          
          {/* Left Hero Content */}
          <div className="md:col-span-6 space-y-4 sm:space-y-5 text-left z-10 animate-in fade-in duration-300 key={heroSlide}">
            <span className="text-xs sm:text-sm font-medium text-[#736B6D] tracking-wide block">
              {currentSlide.tag}
            </span>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#221518] leading-[1.15]">
                <span className="text-[#5E1224] block">{currentSlide.titlePrefix}</span>
                {currentSlide.titleMain}
              </h1>
              <div className="w-16 h-0.5 bg-[#5E1224] rounded-full" />
            </div>

            <p className="text-xs sm:text-sm text-[#5C4F52] leading-relaxed max-w-md">
              {currentSlide.subtitle}
            </p>

            <div className="pt-2">
              <Link
                href={currentSlide.buttonLink}
                className="inline-flex items-center gap-2 bg-[#5E1224] hover:bg-[#470A18] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full shadow-md transition-transform active:scale-95"
              >
                <span>{currentSlide.buttonText}</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Image (Clean Banner Mockup) */}
          <div className="md:col-span-6 flex justify-center items-center relative">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-4/3 sm:aspect-square flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-300 key={heroSlide}">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentSlide.image}
                  alt={currentSlide.alt}
                  className="w-full h-full object-contain drop-shadow-xl rounded-2xl"
                  priority="true"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Hero Carousel Dots Indicator */}
        <div className="flex items-center justify-center gap-2 pt-4 sm:pt-6 relative z-10">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                heroSlide === idx
                  ? "bg-[#5E1224] w-7 shadow-xs"
                  : "bg-[#D4B996]/50 hover:bg-[#D4B996] w-2.5"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── 2. CATEGORY CIRCLE ICONS BAR ── */}
      <section className="space-y-4">
        <div className="grid grid-cols-5 gap-2 sm:gap-6 text-center">
          {CATEGORY_PILLS.map((cat) => {
            const isSelected = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(isSelected ? "all" : cat.slug)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-14 h-14 sm:w-18 sm:h-18 rounded-full border flex items-center justify-center transition-all duration-200 shadow-2xs group-hover:scale-105 active:scale-95 ${
                    isSelected
                      ? "bg-[#5E1224] text-white border-[#5E1224] shadow-md"
                      : "bg-[#FBF8F4] text-[#5E1224] border-[#EFE7DC] group-hover:border-[#5E1224]/40"
                  }`}
                >
                  <div className="transform group-hover:scale-110 transition-transform">
                    {cat.iconSvg}
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold mt-2 transition-colors ${
                    isSelected ? "text-[#5E1224] font-bold" : "text-[#221518] group-hover:text-[#5E1224]"
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. BEST SELLERS SECTION (2x2 Grid on Mobile) ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#221518]">
            Best Sellers
          </h2>
          <a
            href="#products"
            className="text-xs sm:text-sm font-semibold text-[#5E1224] hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ChevronRight size={14} />
          </a>
        </div>

        {/* 2x2 Grid on Mobile / 4 Cols on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 4. TRUST BADGES STRIP ── */}
      <section className="bg-white rounded-2xl border border-[#EFE7DC] p-4 sm:p-6 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-center shrink-0 text-[#5E1224]">
              <Edit3 size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#221518]">Personalized</h4>
              <p className="text-[10px] text-[#736B6D]">Just for you</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-center shrink-0 text-[#5E1224]">
              <Award size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#221518]">Premium Quality</h4>
              <p className="text-[10px] text-[#736B6D]">Grade-A Materials</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-center shrink-0 text-[#5E1224]">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#221518]">Secure Payments</h4>
              <p className="text-[10px] text-[#736B6D]">100% Protected</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EFE7DC] flex items-center justify-center shrink-0 text-[#5E1224]">
              <Truck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#221518]">Fast Delivery</h4>
              <p className="text-[10px] text-[#736B6D]">All Over India</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. ALL PRODUCTS CATALOG ── */}
      <section id="products" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#221518]">
              {activeCategory === "all"
                ? "Explore All Personalized Gifts"
                : `${activeCategory.toUpperCase()} Collection`}
            </h2>
            <p className="text-xs text-[#736B6D] mt-0.5">
              Showing {catalogProducts.length} personalized gifts
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#5E1224] text-white shadow-xs"
                  : "bg-white text-[#221518] border border-[#EFE7DC] hover:border-[#5E1224]/30"
              }`}
            >
              All Items
            </button>
            {CATEGORY_PILLS.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat.slug
                    ? "bg-[#5E1224] text-white font-bold shadow-xs"
                    : "bg-white text-[#221518] border border-[#EFE7DC] hover:border-[#5E1224]/30"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {catalogProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 6. REAL CUSTOMER REVIEWS ── */}
      <section className="space-y-4 pt-4">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E1224]">
            Testimonials
          </span>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#221518]">
            Loved by 10,000+ Happy Customers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {customerReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-[#EFE7DC] p-5 shadow-2xs space-y-3"
            >
              <div className="flex items-center gap-1 text-[#F59E0B]">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#F59E0B]" />
                ))}
              </div>

              <p className="text-xs text-[#4A3B3E] italic leading-relaxed">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#221518]">{rev.name}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
