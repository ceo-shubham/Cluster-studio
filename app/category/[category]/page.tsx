import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { products, getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return [
    { category: "mugs" },
    { category: "clothing" },
    { category: "bottles" },
    { category: "keychains" },
    { category: "combos" },
  ];
}

function getCategoryDisplayName(cat: string) {
  const norm = cat.toLowerCase();
  if (norm === "clothing" || norm === "t-shirts" || norm === "tshirt") return "T-Shirts";
  if (norm === "mugs") return "Mugs";
  if (norm === "bottles") return "Bottles";
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const title = getCategoryDisplayName(category);
  return {
    title: `${title} — Cluster Studio Personalized Gifts`,
    description: `Shop premium personalized ${title} customized with your photos, names, and quotes.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryItems = getProductsByCategory(category);
  const categoryTitle = getCategoryDisplayName(category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* ── Breadcrumb Navigation ── */}
      <nav className="flex items-center gap-1.5 text-xs text-[#736B6D]">
        <Link href="/" className="hover:text-[#5E1224] transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-[#221518]">
          {categoryTitle}
        </span>
      </nav>

      {/* ── Category Header & Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE7DC]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#221518]">
            {categoryTitle}
          </h1>
          <p className="text-xs text-[#736B6D] mt-0.5">
            Showing {categoryItems.length} of {products.length} products
          </p>
        </div>

        {/* Filter & Sort Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-white border border-[#EFE7DC] text-[#221518] px-3.5 py-2 rounded-xl text-xs font-semibold hover:border-[#5E1224] transition-colors shadow-2xs">
            <SlidersHorizontal size={13} className="text-[#5E1224]" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-1.5 bg-white border border-[#EFE7DC] text-[#221518] px-3.5 py-2 rounded-xl text-xs font-semibold hover:border-[#5E1224] transition-colors shadow-2xs">
            <ArrowUpDown size={13} className="text-[#5E1224]" />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* ── Products 2-Column Grid (Mobile) / 4-Column (Desktop) ── */}
      {categoryItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {categoryItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#EFE7DC] p-8 space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#221518]">No products found</h3>
          <p className="text-xs text-[#736B6D]">We are adding more designs to this category soon.</p>
          <Link
            href="/"
            className="inline-block bg-[#5E1224] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow"
          >
            Explore All Gifts
          </Link>
        </div>
      )}

    </div>
  );
}
