"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, ShieldCheck, Truck, HeartHandshake, ArrowRight, 
  Gift, Star, CheckCircle, Smartphone, LayoutGrid, Eye, Camera, Heart,
  Cake, Users, Briefcase, Flame, Image as ImageIcon, Palette, Tag, BadgePercent, Crown,
  ArrowUpDown, SlidersHorizontal
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { 
  products, 
  circularCategories, 
  sidebarGiftCategories, 
  customerReviews, 
  instagramPosts, 
  getBestSellers, 
  getNewArrivals, 
  filterProductsByGiftTag 
} from "@/lib/products";
import { useGiftFinderStore } from "@/store/giftFinderStore";

const getCategoryIcon = (key: string, active: boolean) => {
  const iconClass = active ? "text-amber-300" : "text-[#670D1F]";
  switch (key) {
    case "sparkles": return <Sparkles size={14} className={iconClass} />;
    case "cake": return <Cake size={14} className={iconClass} />;
    case "heart": return <Heart size={14} className={iconClass} />;
    case "users": return <Users size={14} className={iconClass} />;
    case "briefcase": return <Briefcase size={14} className={iconClass} />;
    case "flame": return <Flame size={14} className={iconClass} />;
    case "image": return <ImageIcon size={14} className={iconClass} />;
    case "palette": return <Palette size={14} className={iconClass} />;
    case "tag": return <Tag size={14} className={iconClass} />;
    case "percent": return <BadgePercent size={14} className={iconClass} />;
    case "crown": return <Crown size={14} className={iconClass} />;
    default: return <Gift size={14} className={iconClass} />;
  }
};

export default function HomePage() {
  const [activeGiftFilter, setActiveGiftFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePriceFilter, setActivePriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const openGiftFinder = useGiftFinderStore((s) => s.openGiftFinder);

  const bestSellers = getBestSellers();
  const newArrivals = getNewArrivals();

  // 1. Filter by category or gift tag
  let baseProducts = [...products];

  if (activeCategory !== "All") {
    baseProducts = baseProducts.filter((p) => p.category === activeCategory);
  } else if (activeGiftFilter !== "all") {
    baseProducts = filterProductsByGiftTag(activeGiftFilter);
  }

  // 2. Filter by price range (if activeGiftFilter didn't already filter by price)
  const isGiftTagPriceFilter = activeGiftFilter === "under299" || activeGiftFilter === "under499" || activeGiftFilter === "premium";
  if (!isGiftTagPriceFilter && activePriceFilter !== "all") {
    if (activePriceFilter === "under299") {
      baseProducts = baseProducts.filter((p) => p.price <= 299);
    } else if (activePriceFilter === "300to499") {
      baseProducts = baseProducts.filter((p) => p.price >= 300 && p.price <= 499);
    } else if (activePriceFilter === "500plus") {
      baseProducts = baseProducts.filter((p) => p.price >= 500);
    }
  }

  // 3. Apply sorting
  const displayProducts = [...baseProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return 0; // featured / default
  });

  const isCustomFiltered = activeGiftFilter !== "all" || activeCategory !== "All" || activePriceFilter !== "all" || sortBy !== "featured";

  const resetAllFilters = () => {
    setActiveGiftFilter("all");
    setActiveCategory("All");
    setActivePriceFilter("all");
    setSortBy("featured");
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* ── 1. Hero Section ── */}
      <section className="bg-[#FAF7F2] border-b border-amber-100/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-rose-100/80 text-[#670D1F] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-amber-600" />
                India&apos;s Premium Custom Gifting Studio
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1F1517] leading-[1.15] tracking-tight">
                Personalized Gifts <br />
                <span className="text-[#670D1F] italic font-normal">Made with Love</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 font-normal max-w-lg mx-auto lg:mx-0 leading-relaxed">
                For every moment, for every emotion. Custom coffee mugs, heat-reactive magic mugs, sipper bottles, photo frames &amp; t-shirts designed just for you.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#products"
                  className="w-full sm:w-auto bg-[#670D1F] hover:bg-[#520817] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm tracking-wide text-center"
                >
                  SHOP NOW
                </a>
                <button
                  onClick={openGiftFinder}
                  className="w-full sm:w-auto bg-white border-2 border-[#670D1F] text-[#670D1F] hover:bg-rose-50 font-bold px-7 py-3.5 rounded-xl shadow-sm transition-all text-sm tracking-wide flex items-center justify-center gap-2"
                >
                  <Gift size={16} />
                  PERSONALIZE YOUR GIFT
                </button>
              </div>

              {/* Trust Subtext */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-[#670D1F]" /> Free Custom Design Preview
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-[#670D1F]" /> 10,000+ Happy Customers
                </span>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Floating "Special Gift" circular badge */}
                <div className="absolute -bottom-4 -left-4 z-20 bg-[#670D1F] text-white p-3.5 rounded-full shadow-2xl flex flex-col items-center justify-center w-20 h-20 border-2 border-amber-300 animate-bounce duration-1000">
                  <Gift size={20} className="text-amber-300 mb-0.5" />
                  <span className="text-[9px] font-extrabold uppercase tracking-tighter leading-tight text-center">
                    SPECIAL<br />GIFT
                  </span>
                </div>

                {/* Main Hero Showcase Card */}
                <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-2xl border-4 border-white">
                  <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-gradient-to-tr from-[#f6eee5] via-[#faf5ef] to-[#ffffff]">
                    <Image
                      src="/bannerimg/1 (4).jpeg"
                      alt="Personalized Gifts Display"
                      fill
                      priority
                      className="object-contain p-2 hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Mini preview thumbnail card */}
                <div className="absolute -top-3 -right-3 z-20 bg-white/95 backdrop-blur-sm rounded-2xl p-2.5 shadow-xl border border-amber-100 flex items-center gap-2.5 max-w-[200px]">
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-rose-50 shrink-0">
                    <Image src="/showimg/1 (1).jpeg" alt="White Mug" fill className="object-contain p-0.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#670D1F] uppercase">Magic Mug</span>
                    <p className="text-[11px] font-bold text-gray-800 leading-tight">Heat Reactive Color Reveal</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Four Value Propositions Ribbon ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-amber-100/70 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: <Sparkles className="text-[#670D1F]" size={22} />,
              title: "Premium Quality",
              subtitle: "High quality printing",
            },
            {
              icon: <ShieldCheck className="text-[#670D1F]" size={22} />,
              title: "Secure Payment",
              subtitle: "100% safe & secure",
            },
            {
              icon: <Truck className="text-[#670D1F]" size={22} />,
              title: "Fast Delivery",
              subtitle: "On time, every time",
            },
            {
              icon: <HeartHandshake className="text-[#670D1F]" size={22} />,
              title: "Made with Love",
              subtitle: "Designed just for you",
            },
          ].map((feat, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
                {feat.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-tight">{feat.title}</h4>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{feat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Main Catalog Section (Sidebar + Category Bubbles + Product Showcases) ── */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar ("Find the Perfect Gift") */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100/80 sticky top-28">
              
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
                <Gift size={18} className="text-[#670D1F]" />
                <h3 className="font-bold text-sm text-gray-900 font-serif tracking-tight">
                  Find the Perfect Gift
                </h3>
              </div>

              <div className="space-y-1">
                {sidebarGiftCategories.map((item) => {
                  const isActive = activeGiftFilter === item.filterKey;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveGiftFilter(item.filterKey);
                        setActiveCategory("All");
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#670D1F] text-white shadow-sm font-bold"
                          : "text-gray-700 hover:bg-rose-50/70 hover:text-[#670D1F]"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                          isActive ? "bg-white/15" : "bg-rose-50"
                        }`}>
                          {getCategoryIcon(item.iconKey, isActive)}
                        </span>
                        <span>{item.label}</span>
                      </span>
                      {isActive && <span className="text-[10px] text-amber-300 font-bold">●</span>}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Gift Finder Trigger banner */}
              <div className="mt-5 p-3.5 bg-gradient-to-br from-rose-100/60 to-amber-100/60 rounded-xl border border-rose-200/60 text-center">
                <p className="text-[11px] font-bold text-[#670D1F]">Need Personalized Help?</p>
                <p className="text-[10px] text-gray-600 mt-0.5">Let our wizard match the perfect custom design</p>
                <button
                  onClick={openGiftFinder}
                  className="mt-2.5 w-full bg-[#670D1F] hover:bg-[#520817] text-white text-xs font-bold py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  Start Gift Finder
                </button>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="lg:col-span-9 space-y-10">
            
            {/* ── Shop By Category (Circular Avatars) ── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                  Shop By Category
                </h2>
                <button
                  onClick={() => {
                    setActiveGiftFilter("all");
                    setActiveCategory("All");
                  }}
                  className="text-xs font-bold text-[#670D1F] hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 sm:gap-4">
                {circularCategories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveCategory(cat.slug);
                      setActiveGiftFilter("all");
                    }}
                    className="flex flex-col items-center group cursor-pointer focus:outline-none"
                  >
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 transition-all duration-300 overflow-hidden bg-white shadow-sm ${
                      activeCategory === cat.slug
                        ? "border-[#670D1F] ring-2 ring-rose-200 scale-105"
                        : "border-gray-200 group-hover:border-[#670D1F] group-hover:scale-105"
                    }`}>
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-rose-50/40">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    </div>
                    <span className={`text-[11px] sm:text-xs font-bold text-center mt-2 leading-tight transition-colors ${
                      activeCategory === cat.slug ? "text-[#670D1F]" : "text-gray-700 group-hover:text-[#670D1F]"
                    }`}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Filter & Sort Control Toolbar ── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100/80 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#670D1F]" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Filter by Budget:
                  </span>
                </div>
                
                {/* Sort dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <ArrowUpDown size={13} className="text-gray-400" /> Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#FAF7F2] text-xs font-bold text-gray-800 py-1.5 px-3 rounded-xl border border-amber-200 focus:outline-none focus:border-[#670D1F] cursor-pointer"
                  >
                    <option value="featured">Featured / Best Sellers</option>
                    <option value="price-asc">Price: Low to High (₹149 → ₹749)</option>
                    <option value="price-desc">Price: High to Low (₹749 → ₹149)</option>
                    <option value="rating">Top Rated (Highest Stars)</option>
                    <option value="newest">New Arrivals</option>
                  </select>
                </div>
              </div>

              {/* Price Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under299", label: "Under ₹299" },
                    { id: "300to499", label: "₹300 - ₹499" },
                    { id: "500plus", label: "₹500 & Above" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePriceFilter(p.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                        activePriceFilter === p.id
                          ? "bg-[#670D1F] text-white shadow-sm"
                          : "bg-rose-50/60 text-gray-700 hover:bg-rose-100 hover:text-[#670D1F]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-500">
                    Showing <strong className="text-gray-900">{displayProducts.length}</strong> items
                  </span>
                  {isCustomFiltered && (
                    <button
                      onClick={resetAllFilters}
                      className="text-[11px] font-bold text-[#670D1F] hover:underline"
                    >
                      Reset All ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── If a specific filter or sorting is active, show matching results directly ── */}
            {isCustomFiltered ? (
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <div>
                    <span className="text-[11px] font-bold text-[#670D1F] uppercase tracking-wider">
                      Filtered Collection
                    </span>
                    <h3 className="font-serif text-xl font-bold text-gray-900">
                      {activeCategory !== "All"
                        ? activeCategory
                        : activeGiftFilter !== "all"
                        ? sidebarGiftCategories.find((c) => c.filterKey === activeGiftFilter)?.label || "Custom Gifts"
                        : activePriceFilter !== "all"
                        ? activePriceFilter === "under299" ? "Under ₹299" : activePriceFilter === "300to499" ? "₹300 - ₹499" : "₹500 & Above"
                        : "Customized Gifts"}
                    </h3>
                  </div>
                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-bold text-gray-500 hover:text-[#670D1F]"
                  >
                    Reset Filter ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {displayProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {displayProducts.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
                    <p className="text-gray-500 font-semibold">No products found for the selected price and category filters.</p>
                    <button
                      onClick={resetAllFilters}
                      className="mt-3 bg-[#670D1F] text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Show All Products
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* ── Best Sellers Showcase ── */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">Top Rated</span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">Best Sellers</h2>
                    </div>
                    <button
                      onClick={() => setActiveCategory("Mugs")}
                      className="text-xs font-bold text-[#670D1F] hover:underline flex items-center gap-1"
                    >
                      View all <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {bestSellers.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>

                {/* ── New Arrivals Showcase ── */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">Fresh Drops</span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">New Arrivals</h2>
                    </div>
                    <button
                      onClick={() => setActiveCategory("All")}
                      className="text-xs font-bold text-[#670D1F] hover:underline flex items-center gap-1"
                    >
                      View all <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {newArrivals.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>

                {/* ── All Customizable Gifts Grid ── */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Complete Catalog</span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">Explore All Gifts</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>

        </div>
      </section>

      {/* ── 4. What Our Customers Say 🧡 (Customer Testimonials + Product Photo Proof) ── */}
      <section className="bg-gradient-to-b from-[#FAF7F2] to-white py-12 border-y border-amber-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#670D1F] uppercase tracking-wider block">Real Stories</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                What Our Customers Say 🧡
              </h2>
            </div>
            <a
              href="#reviews"
              className="text-xs font-bold text-[#670D1F] hover:underline flex items-center gap-1"
            >
              View all reviews <ArrowRight size={13} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {customerReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-amber-100/70 flex flex-col justify-between"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Reviewer info + product thumbnail */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-10 h-10 rounded-full object-cover border border-amber-200"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{rev.name}</h4>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle size={10} /> Verified Buyer
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail of product received */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-rose-50 shrink-0 border border-gray-200">
                    <Image
                      src={rev.productImage}
                      alt={rev.productName}
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Follow Us On Instagram (@cluster.studio) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Follow Us On Instagram
          </h2>
          <p className="text-xs sm:text-sm text-[#670D1F] font-bold mt-1">@cluster.studio</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 block"
            >
              <Image
                src={post.image}
                alt="Cluster Studio Instagram Post"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#670D1F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                <Camera size={18} />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── 6. "Why This Design Works?" & Features Bar (from mockup) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-amber-200/70">
          
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold text-[#670D1F] uppercase tracking-widest">Built for Delight</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
              Why Personalized Gifting with Cluster Studio?
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            {[
              {
                icon: <LayoutGrid size={22} className="text-[#670D1F]" />,
                title: "Easy Navigation",
                desc: "Find everything in just a few clicks.",
              },
              {
                icon: <Eye size={22} className="text-[#670D1F]" />,
                title: "Better Product View",
                desc: "Multiple photos & videos build more trust.",
              },
              {
                icon: <Camera size={22} className="text-[#670D1F]" />,
                title: "Real Customer Photos",
                desc: "Helps new customers make quick decisions.",
              },
              {
                icon: <Gift size={22} className="text-[#670D1F]" />,
                title: "Gift Finder",
                desc: "Helps customers find the perfect gift easily.",
              },
              {
                icon: <Smartphone size={22} className="text-[#670D1F]" />,
                title: "Mobile Friendly",
                desc: "Smooth experience on every device.",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center p-2">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-2 shadow-sm border border-amber-100">
                  {item.icon}
                </div>
                <h4 className="font-bold text-xs text-gray-900">{item.title}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
