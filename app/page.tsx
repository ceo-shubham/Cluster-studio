"use client";
import { useState } from "react";
import BannerSlider from "@/components/product/BannerSlider";
import ProductCard from "@/components/product/ProductCard";
import CategoryFilter from "@/components/product/CategoryFilter";
import { products, getProductsByCategory } from "@/lib/products";
import { Truck, Shield, Palette, BadgeCheck } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = getProductsByCategory(activeCategory);

  return (
    <div>

      {/* ── Hero Banner ── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-3">
        <BannerSlider />
      </section>

      {/* ── Trust Strip ── */}
      <section className="bg-[#3b1c0c]">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
          {[
            { icon: <Truck size={18} />,      label: "Free Shipping",    sub: "On all orders" },
            { icon: <Palette size={18} />,    label: "Custom Prints",    sub: "Your design" },
            { icon: <Shield size={18} />,     label: "Quality Assured",  sub: "Premium materials" },
            { icon: <BadgeCheck size={18} />, label: "500+ Customers",   sub: "Trusted brand" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="text-amber-400 shrink-0">{f.icon}</div>
              <div>
                <div className="text-white font-semibold text-xs sm:text-sm leading-tight">{f.label}</div>
                <div className="text-amber-300/70 text-[11px]">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products Section ── */}
      <section id="products" className="max-w-7xl mx-auto px-3 sm:px-6 pt-8 pb-4">

        {/* Section heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">
            Our Collection
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3b1c0c]">
            Shop &amp; Customize
          </h2>
          <p className="text-gray-500 text-sm mt-1 max-w-md">
            Pick any product, upload your design, and we&apos;ll print it for you.
          </p>
        </div>

        {/* Category tabs */}
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-16">No products in this category.</p>
        )}
      </section>

      {/* ── How It Works ── */}
      <section className="bg-amber-50 py-8 mt-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Simple Process</span>
          <h2 className="text-2xl font-extrabold text-[#3b1c0c] mt-1 mb-6">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Choose Product",  desc: "Mugs, bottles, tees, hoodies & more" },
              { step: "2", title: "Upload Design",   desc: "Upload your image or artwork" },
              { step: "3", title: "Edit & Preview",  desc: "Resize, move, and confirm your design" },
              { step: "4", title: "Order & Receive", desc: "We print and ship to your door" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2.5">
                <div className="w-11 h-11 rounded-full bg-amber-600 text-white font-extrabold text-lg flex items-center justify-center shadow">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { num: `${products.length}+`, label: "Products" },
            { num: "500+",                label: "Happy Customers" },
            { num: "100%",                label: "Custom Prints" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">{s.num}</span>
              <span className="text-gray-500 text-xs sm:text-sm mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
