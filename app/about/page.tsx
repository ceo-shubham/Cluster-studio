"use client";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, Heart, ShieldCheck, Truck, Palette, 
  Award, Users, ArrowRight, CheckCircle2, MessageCircle 
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-14 py-8 pb-20">
      
      {/* ── 1. Header Banner ── */}
      <section className="bg-[#FAF7F2] border-b border-amber-100/70 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-rose-100/80 text-[#670D1F] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-600" /> Our Story &amp; Craft
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Personalized Gifts <br />
            <span className="text-[#670D1F] italic font-normal">Crafted with Love &amp; Precision</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            At Cluster Studio, we believe every special moment deserves more than just an off-the-shelf gift. We turn your precious photos, names, and memories into daily keepsakes that warm the heart.
          </p>
        </div>
      </section>

      {/* ── 2. Brand Story Showcase ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 relative aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-rose-50">
            <Image
              src="/bannerimg/1 (4).jpeg"
              alt="Cluster Studio Craftsmanship"
              fill
              className="object-contain p-4"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-[#670D1F] uppercase tracking-widest block">
              Behind Cluster Studio
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Where Your Imagination Meets Artisan Sublimation
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Founded with the vision to make custom gifting accessible, effortless, and premium across India, Cluster Studio specializes in high-definition thermal printing on ceramic magic mugs, stainless steel sipper bottles, plush t-shirts, handcrafted photo frames, and accessories.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Whether it&apos;s a birthday surprise for your best friend, a wedding anniversary keepsake for your partner, or bulk corporate branding for your team, every single piece is inspected by hand before leaving our studio.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#670D1F] shrink-0" />
                <span className="text-xs font-bold text-gray-800">Fade-Proof Color Lock</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#670D1F] shrink-0" />
                <span className="text-xs font-bold text-gray-800">Food-Grade Ceramics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#670D1F] shrink-0" />
                <span className="text-xs font-bold text-gray-800">Safe Bubble Packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#670D1F] shrink-0" />
                <span className="text-xs font-bold text-gray-800">Pan-India Express Courier</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. Four Core Pillars ── */}
      <section className="bg-[#FAF7F2] py-14 border-y border-amber-100/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-[#670D1F] uppercase tracking-wider">Our Standards</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">Why India Trusts Cluster Studio</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Palette size={24} className="text-[#670D1F]" />,
                title: "Precision Printing",
                desc: "300+ DPI sublimation technology ensuring vibrant colors that withstand hundreds of washes."
              },
              {
                icon: <Award size={24} className="text-[#670D1F]" />,
                title: "Premium Grade Build",
                desc: "High density ceramic glazes, rust-free stainless steel, and 100% bio-washed cotton fabrics."
              },
              {
                icon: <Truck size={24} className="text-[#670D1F]" />,
                title: "Express Pan-India",
                desc: "Speedy delivery across all Indian pincodes with live SMS and tracking updates."
              },
              {
                icon: <ShieldCheck size={24} className="text-[#670D1F]" />,
                title: "Zero Damage Promise",
                desc: "Multi-layer protective bubble packaging. Free instant replacement in case of transit damage."
              },
            ].map((pillar, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100/70 flex flex-col items-start space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100">
                  {pillar.icon}
                </div>
                <h4 className="font-bold text-sm text-gray-900">{pillar.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Process Workflow ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold text-[#670D1F] uppercase tracking-wider">Simple &amp; Seamless</span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">How We Bring Your Gift to Life</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Pick Product", desc: "Select from magic mugs, sippers, photo frames & tees." },
            { step: "02", title: "Upload & Preview", desc: "Attach your photo or personalized text in our live editor." },
            { step: "03", title: "Artisan Crafting", desc: "We calibrate print color balance & heat transfer with care." },
            { step: "04", title: "Doorstep Delivery", desc: "Packed safely in gift box & delivered right to your door." },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-amber-100/80 shadow-sm relative text-center flex flex-col items-center">
              <span className="font-serif text-3xl font-extrabold text-[#670D1F]/20 mb-1">{s.step}</span>
              <h4 className="font-bold text-sm text-gray-900">{s.title}</h4>
              <p className="text-xs text-gray-500 mt-1 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. WhatsApp & Gifting CTA ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#670D1F] to-[#520817] text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">Have a Custom Project in Mind?</h3>
            <p className="text-xs sm:text-sm text-rose-200 max-w-md">
              Chat directly with our design artisans on WhatsApp (+91 8380808435) for customized collages, wedding favors &amp; corporate bulk inquiries.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://wa.me/918380808435?text=Hi!%20I%20have%20a%20custom%20order%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md text-xs uppercase tracking-wide"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
            <Link
              href="/#products"
              className="flex items-center gap-1.5 bg-white text-[#670D1F] hover:bg-rose-50 font-bold px-6 py-3 rounded-xl transition-all shadow-md text-xs uppercase tracking-wide"
            >
              Explore Gifts <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
