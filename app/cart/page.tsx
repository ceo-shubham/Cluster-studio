import CartSummary from "@/components/cart/CartSummary";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="text-[#670D1F]" size={28} />
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">Your Shopping Cart</h1>
      </div>
      <CartSummary />
    </div>
  );
}
