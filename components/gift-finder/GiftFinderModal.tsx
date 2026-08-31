"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, Sparkles, Gift, ArrowRight, RotateCcw, 
  Heart, Users, Briefcase, Star, Flame, Tag, Crown 
} from "lucide-react";
import { products } from "@/lib/products";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useGiftFinderStore } from "@/store/giftFinderStore";

export default function GiftFinderModal() {
  const { isOpen, closeGiftFinder } = useGiftFinderStore();
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState<string>("");
  const [occasion, setOccasion] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (step === 4) {
      let filtered = [...products];

      if (budget === "under299") {
        filtered = filtered.filter((p) => p.price <= 299);
      } else if (budget === "under499") {
        filtered = filtered.filter((p) => p.price >= 300 && p.price <= 499);
      } else if (budget === "premium" || budget === "under999") {
        filtered = filtered.filter((p) => p.price >= 500);
      }

      if (occasion === "anniversary" || recipient === "partner") {
        filtered.sort((a, b) => (b.giftTags?.includes("couple") ? 1 : 0) - (a.giftTags?.includes("couple") ? 1 : 0));
      } else if (occasion === "birthday") {
        filtered.sort((a, b) => (b.giftTags?.includes("birthday") ? 1 : 0) - (a.giftTags?.includes("birthday") ? 1 : 0));
      } else if (occasion === "corporate" || recipient === "colleague") {
        filtered.sort((a, b) => (b.giftTags?.includes("corporate") ? 1 : 0) - (a.giftTags?.includes("corporate") ? 1 : 0));
      }

      setResults(filtered.slice(0, 4));
    }
  }, [step, recipient, occasion, budget]);

  if (!isOpen) return null;

  const resetFinder = () => {
    setStep(1);
    setRecipient("");
    setOccasion("");
    setBudget("");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div onClick={closeGiftFinder} className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-amber-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#670D1F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Gift size={20} className="text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif">Gift Finder Wizard</h3>
              <p className="text-xs text-rose-200">Find the perfect personalized gift in 3 easy steps</p>
            </div>
          </div>
          <button onClick={closeGiftFinder} className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-rose-100 h-1.5 flex">
          <div
            className="bg-[#670D1F] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <span className="text-xs font-bold text-[#670D1F] uppercase tracking-wider">Step 1 of 3</span>
                <h4 className="text-xl font-bold text-gray-900 mt-1 font-serif">Who are you looking to gift?</h4>
                <p className="text-xs text-gray-500 mt-1">Select recipient to get tailored recommendations</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: "partner", label: "Partner / Spouse", icon: <Heart size={20} className="text-[#670D1F]" /> },
                  { id: "friend", label: "Best Friend", icon: <Users size={20} className="text-[#670D1F]" /> },
                  { id: "parents", label: "Parents / Family", icon: <Sparkles size={20} className="text-[#670D1F]" /> },
                  { id: "colleague", label: "Colleague / Boss", icon: <Briefcase size={20} className="text-[#670D1F]" /> },
                  { id: "kids", label: "Kids / Siblings", icon: <Gift size={20} className="text-[#670D1F]" /> },
                  { id: "myself", label: "For Myself", icon: <Star size={20} className="text-[#670D1F]" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setRecipient(item.id);
                      setStep(2);
                    }}
                    className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2.5 hover:border-[#670D1F] hover:bg-rose-50/50 ${
                      recipient === item.id ? "border-[#670D1F] bg-rose-50" : "border-gray-100 bg-gray-50/50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs border border-gray-100">
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-800">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <span className="text-xs font-bold text-[#670D1F] uppercase tracking-wider">Step 2 of 3</span>
                <h4 className="text-xl font-bold text-gray-900 mt-1 font-serif">What is the special occasion?</h4>
                <p className="text-xs text-gray-500 mt-1">We will curate designs fitting the mood</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: "birthday", label: "Birthday", icon: <Sparkles size={20} className="text-[#670D1F]" /> },
                  { id: "anniversary", label: "Anniversary", icon: <Heart size={20} className="text-[#670D1F]" /> },
                  { id: "valentine", label: "Valentine's Day", icon: <Gift size={20} className="text-[#670D1F]" /> },
                  { id: "corporate", label: "Office Event", icon: <Briefcase size={20} className="text-[#670D1F]" /> },
                  { id: "festival", label: "Festival / Diwali", icon: <Flame size={20} className="text-[#670D1F]" /> },
                  { id: "any", label: "Just Because", icon: <Star size={20} className="text-[#670D1F]" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setOccasion(item.id);
                      setStep(3);
                    }}
                    className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2.5 hover:border-[#670D1F] hover:bg-rose-50/50 ${
                      occasion === item.id ? "border-[#670D1F] bg-rose-50" : "border-gray-100 bg-gray-50/50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs border border-gray-100">
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-800">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <span className="text-xs font-bold text-[#670D1F] uppercase tracking-wider">Step 3 of 3</span>
                <h4 className="text-xl font-bold text-gray-900 mt-1 font-serif">What is your ideal budget?</h4>
                <p className="text-xs text-gray-500 mt-1">High quality personalized gifts at every price point</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "under299", label: "Under ₹299", desc: "Keychains, Mini Mugs & Classic Mugs", icon: <Tag size={20} className="text-[#670D1F]" /> },
                  { id: "under499", label: "₹300 - ₹499", desc: "Magic Mugs, Frames, Cushions & T-Shirts", icon: <Gift size={20} className="text-[#670D1F]" /> },
                  { id: "premium", label: "₹500 & Above", desc: "Premium Hoodies & Sipper Bottles", icon: <Crown size={20} className="text-[#670D1F]" /> },
                  { id: "any", label: "All Price Ranges", desc: "Show everything (₹149 - ₹749)", icon: <Sparkles size={20} className="text-[#670D1F]" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setBudget(item.id);
                      setStep(4);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 hover:border-[#670D1F] hover:bg-rose-50/50 ${
                      budget === item.id ? "border-[#670D1F] bg-rose-50" : "border-gray-100 bg-gray-50/50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs border border-gray-100">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{item.label}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-1.5 bg-rose-100 text-[#670D1F] px-3 py-1 rounded-full text-xs font-bold mb-2">
                  <Sparkles size={14} /> Perfect Matches Found!
                </div>
                <h4 className="text-xl font-bold text-gray-900 font-serif">Curated Just For You</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {results.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#FAF7F2] rounded-2xl p-3 border border-amber-100 flex flex-col justify-between"
                  >
                    <div className="relative w-full h-32 rounded-xl bg-white overflow-hidden mb-2 border border-gray-100">
                      <Image
                        src={product.cardImage || product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#670D1F] uppercase">{product.category}</span>
                      <h5 className="font-bold text-xs text-gray-900 truncate">{product.name}</h5>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-extrabold text-[#670D1F] text-sm">{formatPrice(product.price)}</span>
                        {product.mrp && (
                          <span className="text-[11px] text-gray-400 line-through">{formatPrice(product.mrp)}</span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/product/${product.id}`}
                      onClick={closeGiftFinder}
                      className="mt-3 flex items-center justify-center gap-1 bg-[#670D1F] hover:bg-[#520817] text-white text-xs font-bold py-2 rounded-xl transition-colors shadow-sm text-center"
                    >
                      Personalize Now <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={resetFinder}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#670D1F] hover:underline"
                >
                  <RotateCcw size={13} /> Start Over with different filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step navigation buttons */}
        {step > 1 && step < 4 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between">
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <span className="text-xs text-gray-400">Step {step} of 3</span>
          </div>
        )}
      </div>
    </div>
  );
}
