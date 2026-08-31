"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { IS_CLERK_CONFIGURED, noAuthState, type SafeAuthState } from "@/lib/useClerkAuth";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Lock, MapPin, User } from "lucide-react";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh",
  "Ladakh","Jammu and Kashmir","Puducherry",
];

function CheckoutWithClerk() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const auth: SafeAuthState = {
    isLoaded: !!isLoaded,
    isSignedIn: !!isSignedIn,
    userId: userId ?? null,
    userEmail: user?.emailAddresses?.[0]?.emailAddress ?? null,
    userName: user?.fullName ?? null,
    openSignIn: () => openSignIn({ fallbackRedirectUrl: window.location.href }),
    signOut: () => {},
  };

  return <CheckoutInner auth={auth} />;
}

interface ShippingForm {
  name: string; phone: string; line1: string;
  line2: string; city: string; state: string; pincode: string;
}

function CheckoutInner({ auth }: { auth: SafeAuthState }) {
  const { isLoaded, isSignedIn, userId, userEmail, userName, openSignIn } = auth;
  const router = useRouter();
  const { items, totalPrice, clearCartForUser } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    name: userName || "", phone: "", line1: "",
    line2: "", city: "", state: "", pincode: "",
  });

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  if (!isLoaded) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-[#3b1c0c] mb-2">Sign in to Checkout</h2>
          <p className="text-gray-500 text-sm mb-6">
            Please sign in to place your order. Your cart items are saved.
          </p>
          <button
            onClick={openSignIn}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            <User size={18} /> Sign In / Create Account
          </button>
          <p className="text-xs text-gray-400 mt-4">
            Browse and add to cart without signing in. Login only needed to place an order.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill all required fields"); return;
    }
    if (!/^\d{10}$/.test(form.phone)) { toast.error("Enter a valid 10-digit phone number"); return; }
    if (!/^\d{6}$/.test(form.pincode)) { toast.error("Enter a valid 6-digit pincode"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || "guest",
          userEmail: userEmail || "",
          userName: userName || form.name,
          items: items.map((i) => ({
            productId: i.product.id, productName: i.product.name,
            productImage: i.product.image, quantity: i.quantity,
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
      clearCartForUser(userId || "guest");
      toast.success("Order placed successfully!");
      router.push(`/orders/${data.orderId}`);
    } catch (err) {
      toast.error((err as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Lock size={24} className="text-[#670D1F]" /> Secure Checkout
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-amber-100/80 p-6">
            <h2 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-[#670D1F]" /> Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "name",    label: "Full Name *",       placeholder: "Your full name",           span: false },
                { name: "phone",   label: "Phone Number *",    placeholder: "10-digit mobile",          span: false, max: 10 },
                { name: "line1",   label: "Address Line 1 *",  placeholder: "House / Flat / Street",    span: true },
                { name: "line2",   label: "Address Line 2",    placeholder: "Area / Landmark (optional)", span: true, optional: true },
                { name: "city",    label: "City *",            placeholder: "City",                     span: false },
                { name: "pincode", label: "Pincode *",         placeholder: "6-digit pincode",          span: false, max: 6 },
              ].map((f) => (
                <div key={f.name} className={f.span ? "md:col-span-2" : ""}>
                  <label className="text-xs font-bold text-gray-700 block mb-1">{f.label}</label>
                  <input
                    name={f.name}
                    value={form[f.name as keyof ShippingForm]}
                    onChange={handleChange}
                    required={!f.optional}
                    maxLength={f.max}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#670D1F] bg-[#FAF7F2]/50"
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">State *</label>
                <select name="state" value={form.state} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#670D1F] bg-[#FAF7F2]/50">
                  <option value="">Select State</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6 bg-rose-50/70 border border-rose-200/70 rounded-xl p-4 text-xs text-[#670D1F] leading-relaxed">
              <strong>Payment:</strong> Cash on Delivery (COD) &amp; Express Delivery. Our artisan team will confirm your customization before dispatch.
            </div>
            <button type="submit" disabled={loading}
              className="mt-6 w-full bg-[#670D1F] hover:bg-[#520817] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all shadow-md text-sm uppercase tracking-wider">
              {loading ? "Placing Order..." : "Confirm & Place Order →"}
            </button>
          </form>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100/80 p-5 sticky top-28">
            <h2 className="font-bold text-gray-900 mb-4 font-serif">Order Summary</h2>
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs">
                  <span className="text-gray-600 truncate flex-1">{item.product.name} × {item.quantity}</span>
                  <span className="font-bold text-gray-900 ml-2">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500"><span>Subtotal</span><span className="font-semibold text-gray-800">{formatPrice(totalPrice())}</span></div>
              <div className="flex justify-between text-xs"><span className="text-gray-500">Shipping</span><span className="text-emerald-600 font-bold">FREE</span></div>
              <div className="flex justify-between font-bold text-[#670D1F] text-base pt-2 border-t border-gray-100"><span className="font-serif">Total</span><span>{formatPrice(totalPrice())}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  if (IS_CLERK_CONFIGURED) return <CheckoutWithClerk />;
  return <CheckoutInner auth={noAuthState} />;
}
