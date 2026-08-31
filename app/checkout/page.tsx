"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { Lock, MapPin, User, CheckCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh",
  "Ladakh","Jammu and Kashmir","Puducherry",
];

interface ShippingForm {
  name: string; phone: string; email: string; line1: string;
  line2: string; city: string; state: string; pincode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    name: "", phone: "", email: "", line1: "",
    line2: "", city: "", state: "", pincode: "",
  });

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm mt-2">Add your customized gifts to the cart before checking out.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 bg-[#670D1F] text-white text-xs font-bold px-6 py-3 rounded-xl shadow hover:bg-[#520817] transition-colors"
        >
          <ArrowLeft size={14} /> Continue Shopping
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest",
          userEmail: form.email || "guest@clusterstudio.in",
          userName: form.name,
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            productImage: i.product.image,
            quantity: i.quantity,
            price: i.product.price,
            customImageUrl: i.customImageUrl || "",
            finalImageUrl: i.finalImageUrl || "",
          })),
          totalAmount: totalPrice(),
          shippingAddress: { ...form },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      // Save order in localStorage so it's instantly visible in Admin Dashboard
      try {
        const orderPayload = {
          orderId: data.orderId,
          userName: form.name,
          userEmail: form.email,
          totalAmount: totalPrice(),
          status: "pending",
          paymentStatus: "paid",
          createdAt: new Date().toISOString(),
          shippingAddress: { ...form },
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            productImage: i.product.image,
            quantity: i.quantity,
            price: i.product.price,
            customImageUrl: i.customImageUrl || "",
            finalImageUrl: i.finalImageUrl || "",
          }))
        };
        const stored = JSON.parse(localStorage.getItem("cluster_studio_orders") || "[]");
        stored.unshift(orderPayload);
        localStorage.setItem("cluster_studio_orders", JSON.stringify(stored));
        sessionStorage.setItem(`currentAdminOrder_${data.orderId}`, JSON.stringify(orderPayload));
      } catch (e) {}

      clearCart();
      toast.success("🎉 Order placed successfully!");
      window.location.href = `/orders/${data.orderId}`;
    } catch (err) {
      toast.error((err as Error).message || "Could not place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cart" className="text-gray-500 hover:text-[#670D1F] flex items-center gap-1 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-8">
        Secure Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Shipping Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100/70">
          <h2 className="font-serif font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-[#670D1F]" />
            Delivery Address
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#FAF7F2] text-gray-900 text-xs rounded-xl p-3 outline-none border border-amber-200 focus:border-[#670D1F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Phone Number (10 Digits) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full bg-[#FAF7F2] text-gray-900 text-xs rounded-xl p-3 outline-none border border-amber-200 focus:border-[#670D1F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address (For Order Tracking)
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                className="w-full bg-[#FAF7F2] text-gray-900 text-xs rounded-xl p-3 outline-none border border-amber-200 focus:border-[#670D1F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                House / Flat / Street Address *
              </label>
              <input
                type="text"
                name="line1"
                required
                value={form.line1}
                onChange={handleChange}
                placeholder="House No., Building Name, Street"
                className="w-full bg-[#FAF7F2] text-gray-900 text-xs rounded-xl p-3 outline-none border border-amber-200 focus:border-[#670D1F]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className="w-full bg-[#FAF7F2] text-gray-900 text-xs rounded-xl p-3 outline-none border border-amber-200 focus:border-[#670D1F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  className="w-full bg-[#FAF7F2] text-gray-900 text-xs rounded-xl p-3 outline-none border border-amber-200 focus:border-[#670D1F]"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  State *
                </label>
                <select
                  name="state"
                  required
                  value={form.state}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F2] text-gray-900 text-xs rounded-xl p-3 outline-none border border-amber-200 focus:border-[#670D1F]"
                >
                  <option value="">Select State</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#670D1F] hover:bg-[#520817] text-white font-bold py-4 rounded-xl shadow-lg transition-all text-sm uppercase tracking-wide disabled:opacity-60 mt-4"
            >
              {loading ? "Placing Order..." : `Place Order • ${formatPrice(totalPrice())}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-amber-100/70 space-y-4">
          <h2 className="font-serif font-bold text-lg text-gray-900 pb-3 border-b border-gray-100">
            Order Summary ({items.length} {items.length === 1 ? "Item" : "Items"})
          </h2>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/70 border border-gray-100">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                  <Image
                    src={item.finalImageUrl || item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.name}</h4>
                  <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                  <span className="text-xs font-extrabold text-[#670D1F]">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice())}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Pan-India Delivery</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Payable</span>
              <span className="text-[#670D1F]">{formatPrice(totalPrice())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
