"use client";
import { categories } from "@/lib/products";

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-start sm:justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap shrink-0 ${
            active === cat
              ? "bg-amber-600 text-white border-amber-600 shadow"
              : "bg-white text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
