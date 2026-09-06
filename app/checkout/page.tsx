"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Check, CheckCircle2, ShieldCheck, Truck, ArrowLeft, 
  CreditCard, Smartphone, Building2, Banknote, ShoppingBag, 
  MapPin, Sparkles, ChevronRight, Lock
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const STATES_IN = [
  "Delhi", "Maharashtra", "Karnataka", "Uttar Pradesh", "Tamil Nadu",
  "Gujarat", "Rajasthan", "West Bengal", "Telangana", "Madhya Pradesh",
  "Haryana", "Bihar", "Punjab", "Kerala", "Andhra Pradesh", "Odisha",
  "Assam", "Jharkhand", "Chhattisgarh", "Uttarakhand", "Goa", "Himachal Pradesh"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  // Stepper State: 1 = Address, 2 = Payment, 3 = Review, 4 = Success
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>("");

  // Address Form State
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    email: "",
    line1: "",
    line2: "",
    city: "",
    pincode: "",
    state: "Delhi",
    saveAddress: true,
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");

  // Calculations
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>("LOVE10");
  const subtotal = totalPrice();
  const shippingFee = subtotal > 499 ? 0 : 60;
  let discount = 0;
  if (appliedCoupon === "LOVE10") discount = Math.round(subtotal * 0.10);
  else if (appliedCoupon === "FIRST50") discount = Math.min(50, subtotal);
  else if (appliedCoupon === "FREESHIP") discount = shippingFee;
  const finalTotal = Math.max(0, subtotal + shippingFee - discount);

  // Validate Address Step
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!shippingAddress.line1.trim()) {
      toast.error("Please enter your street address / house number");
      return;
    }
    if (!shippingAddress.city.trim()) {
      toast.error("Please enter your city");
      return;
    }
    if (!shippingAddress.pincode.trim() || shippingAddress.pincode.length < 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    setCurrentStep(2);
  };

  // Validate Payment Step
  const handlePaymentSubmit = () => {
    setCurrentStep(3);
  };

  // Final Place Order
  const handlePlaceOrder = async () => {
    setSubmitting(true);
    const generatedId = "CS-" + Math.floor(100000 + Math.random() * 900000);

    const isOnlinePayment = paymentMethod !== "cod";
    const paymentStatusVal = isOnlinePayment ? "in_progress" : "pending";

    const orderPayload = {
      orderId: generatedId,
      userName: shippingAddress.name,
      userEmail: shippingAddress.email || "customer@clusterstudio.in",
      totalAmount: finalTotal,
      status: "pending",
      paymentStatus: paymentStatusVal,
      paymentMethod: isOnlinePayment ? "ONLINE" : "COD",
      createdAt: new Date().toISOString(),
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2,
        city: shippingAddress.city,
        pincode: shippingAddress.pincode,
        state: shippingAddress.state,
      },
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.image,
        quantity: i.quantity,
        price: i.product.price,
        customImageUrl: i.customImageUrl || "",
        finalImageUrl: i.finalImageUrl || "",
      })),
    };

    try {
      // 1. Send to backend / edge worker
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json().catch(() => ({}));
      const actualId = data.orderId || generatedId;

      // 2. Persist in localStorage so it's immediately listed in My Orders & Admin
      const localSaved = JSON.parse(localStorage.getItem("cluster_studio_orders") || "[]");
      localSaved.unshift({ ...orderPayload, orderId: actualId });
      localStorage.setItem("cluster_studio_orders", JSON.stringify(localSaved));
      sessionStorage.setItem(`currentAdminOrder_${actualId}`, JSON.stringify({ ...orderPayload, orderId: actualId }));

      setConfirmedOrderId(actualId);
      clearCart();
      setCurrentStep(4);
      toast.success("🎉 Order placed successfully!");
    } catch (err) {
      console.error("Order error:", err);
      // Fallback local save
      const localSaved = JSON.parse(localStorage.getItem("cluster_studio_orders") || "[]");
      localSaved.unshift(orderPayload);
      localStorage.setItem("cluster_studio_orders", JSON.stringify(localSaved));
      sessionStorage.setItem(`currentAdminOrder_${generatedId}`, JSON.stringify(orderPayload));
      setConfirmedOrderId(generatedId);
      clearCart();
      setCurrentStep(4);
      toast.success("🎉 Order placed successfully!");
    } finally {
      setSubmitting(false);
    }
  };

  // If cart is empty and not on success screen
  if (items.length === 0 && currentStep !== 4) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#221518]">Your Cart is Empty</h2>
        <p className="text-xs text-[#736B6D]">Add items to your cart before proceeding to checkout.</p>
        <Link
          href="/"
          className="inline-block bg-[#5E1224] text-white text-xs font-bold px-6 py-3 rounded-xl shadow"
        >
          Browse Gifts &amp; Fashion
        </Link>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // ── SCREEN 9: ORDER SUCCESS (Thank You & WhatsApp Share Screen) ─────────
  // ════════════════════════════════════════════════════════════════════════
  if (currentStep === 4) {
    const isOnline = paymentMethod !== "cod";
    const adminWhatsAppNumber = "918380808435";
    
    // Construct WhatsApp prefilled message to Admin
    const itemsText = items.length > 0 
      ? items.map((i, idx) => `${idx + 1}. [Product ID: ${i.product.id}] ${i.product.name} (Qty: ${i.quantity}) - ₹${i.product.price * i.quantity}`).join("\n")
      : `1. Order items details`;

    const whatsAppMessage = `🛍️ *NEW ONLINE ORDER - CLUSTER STUDIO*
━━━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* #${confirmedOrderId}
👤 *Customer Name:* ${shippingAddress.name}
📞 *Customer Phone:* ${shippingAddress.phone}
📍 *Delivery Address:* ${shippingAddress.line1}${shippingAddress.line2 ? ", " + shippingAddress.line2 : ""}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}

📦 *ORDERED ITEMS:*
${itemsText}

💰 *TOTAL AMOUNT:* ₹${finalTotal}
💳 *Payment Mode:* ${isOnline ? "Online Payment (In Progress ⏳)" : "Cash on Delivery"}
━━━━━━━━━━━━━━━━━━━━
⚠️ *Action Required:* ${isOnline ? "Please share the UPI QR code with me to complete the payment!" : "Order placed with Cash on Delivery."}`;

    const adminWhatsAppUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(whatsAppMessage)}`;

    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Celebration Checkmark Icon */}
        <div className="relative w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 shadow-md">
          <Check size={32} strokeWidth={2.5} />
          <div className="absolute -top-1 -right-1 text-amber-500 animate-bounce">
            ✨
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#221518]">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-[#5C4F52]">
            {isOnline 
              ? "Your order has been recorded. Complete payment via WhatsApp QR code below."
              : "Your Cash on Delivery order is confirmed and will be processed soon."}
          </p>
        </div>

        {/* Order ID & Payment Status Card */}
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#EFE7DC] p-4 text-center space-y-2 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#736B6D] block">
            Order Confirmation
          </span>
          <p className="font-mono font-extrabold text-lg text-[#5E1224]">
            Order ID: #{confirmedOrderId}
          </p>
          
          <div className="pt-1 flex items-center justify-center gap-2">
            <span className="text-xs text-[#5C4F52]">Payment Status:</span>
            {isOnline ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                Online (In Progress ⏳)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                Cash on Delivery
              </span>
            )}
          </div>
        </div>

        {/* ── WhatsApp QR Code Request Call-To-Action (For Online Orders) ── */}
        {isOnline && (
          <div className="bg-emerald-50/90 border-2 border-emerald-500/60 rounded-2xl p-4 sm:p-5 text-left space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <span className="text-lg">📲</span>
              <span>Send Order to Admin &amp; Get QR Code</span>
            </div>
            
            <p className="text-xs text-emerald-800 leading-relaxed">
              To complete your payment, click the button below to share your order details with our Admin on WhatsApp. Admin will immediately send you the <strong>UPI Payment QR Code</strong>.
            </p>

            <a
              href={adminWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>📲</span>
              <span>Send Order to Admin WhatsApp</span>
            </a>

            <div className="text-[11px] text-emerald-700 font-medium bg-emerald-100/60 p-2.5 rounded-lg border border-emerald-200">
              💡 <strong>Note:</strong> Your payment status will show <strong>In Progress ⏳</strong> until Admin verifies your UPI payment from the admin panel.
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-1 space-y-2.5">
          <Link
            href={`/orders/view?id=${confirmedOrderId}`}
            className="w-full block bg-[#5E1224] hover:bg-[#470A18] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-transform active:scale-98"
          >
            Track Order Status →
          </Link>

          <Link
            href="/"
            className="w-full block border border-[#EFE7DC] hover:bg-[#FAF7F2] text-[#221518] font-bold text-xs uppercase tracking-wider py-3 rounded-2xl transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* ── STEPPER HEADER (1) Address ── (2) Payment ── (3) Review ── */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 bg-[#FAF7F2] rounded-2xl border border-[#EFE7DC]">
        {/* Step 1: Address */}
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep > 1
                ? "bg-emerald-600 text-white"
                : currentStep === 1
                ? "bg-[#5E1224] text-white shadow-xs"
                : "bg-white border border-[#EFE7DC] text-[#736B6D]"
            }`}
          >
            {currentStep > 1 ? <Check size={12} /> : "1"}
          </div>
          <span className={`text-xs font-bold ${currentStep === 1 ? "text-[#5E1224]" : "text-[#736B6D]"}`}>
            Address
          </span>
        </div>

        <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-[#EFE7DC]" />

        {/* Step 2: Payment */}
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep > 2
                ? "bg-emerald-600 text-white"
                : currentStep === 2
                ? "bg-[#5E1224] text-white shadow-xs"
                : "bg-white border border-[#EFE7DC] text-[#736B6D]"
            }`}
          >
            {currentStep > 2 ? <Check size={12} /> : "2"}
          </div>
          <span className={`text-xs font-bold ${currentStep === 2 ? "text-[#5E1224]" : "text-[#736B6D]"}`}>
            Payment
          </span>
        </div>

        <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-[#EFE7DC]" />

        {/* Step 3: Review */}
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 3
                ? "bg-[#5E1224] text-white shadow-xs"
                : "bg-white border border-[#EFE7DC] text-[#736B6D]"
            }`}
          >
            3
          </div>
          <span className={`text-xs font-bold ${currentStep === 3 ? "text-[#5E1224]" : "text-[#736B6D]"}`}>
            Review
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ── SCREEN 6: STEP 1 - SHIPPING ADDRESS ──────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {currentStep === 1 && (
        <form onSubmit={handleAddressSubmit} className="bg-white rounded-3xl border border-[#EFE7DC] p-5 sm:p-7 space-y-4 shadow-2xs animate-in fade-in duration-150">
          <div className="pb-3 border-b border-[#EFE7DC]">
            <h2 className="text-xl font-serif font-bold text-[#221518]">
              Shipping Address
            </h2>
            <p className="text-xs text-[#736B6D] mt-0.5">
              Enter the delivery details for your personalized parcel.
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Full Name */}
            <div>
              <label className="font-bold text-[#221518] block mb-1">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                className="w-full bg-[#FAF7F2] rounded-xl px-3.5 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224] text-[#221518]"
              />
            </div>

            {/* Mobile & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#221518] block mb-1">
                  Mobile Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="w-full bg-[#FAF7F2] rounded-xl px-3.5 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224] text-[#221518]"
                />
              </div>

              <div>
                <label className="font-bold text-[#221518] block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                  className="w-full bg-[#FAF7F2] rounded-xl px-3.5 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224] text-[#221518]"
                />
              </div>
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="font-bold text-[#221518] block mb-1">
                Address Line 1 <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="House no., Building, Street"
                value={shippingAddress.line1}
                onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                className="w-full bg-[#FAF7F2] rounded-xl px-3.5 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224] text-[#221518]"
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="font-bold text-[#221518] block mb-1">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                placeholder="Area, Landmark"
                value={shippingAddress.line2}
                onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
                className="w-full bg-[#FAF7F2] rounded-xl px-3.5 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224] text-[#221518]"
              />
            </div>

            {/* City & Pincode */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#221518] block mb-1">
                  City <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full bg-[#FAF7F2] rounded-xl px-3.5 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224] text-[#221518]"
                />
              </div>

              <div>
                <label className="font-bold text-[#221518] block mb-1">
                  Pincode <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter pincode"
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  className="w-full bg-[#FAF7F2] rounded-xl px-3.5 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224] text-[#221518]"
                />
              </div>
            </div>

            {/* State Dropdown */}
            <div>
              <label className="font-bold text-[#221518] block mb-1">
                State <span className="text-rose-600">*</span>
              </label>
              <select
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                className="w-full bg-[#FAF7F2] rounded-xl px-3.5 py-3 outline-none border border-[#EFE7DC] focus:border-[#5E1224] text-[#221518]"
              >
                {STATES_IN.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Save Address Checkbox */}
            <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={shippingAddress.saveAddress}
                onChange={(e) => setShippingAddress({ ...shippingAddress, saveAddress: e.target.checked })}
                className="accent-[#5E1224] w-4 h-4 rounded"
              />
              <span className="text-xs text-[#5C4F52]">Save this address for future orders</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5E1224] hover:bg-[#470A18] text-white font-bold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-md transition-transform active:scale-98 mt-4 cursor-pointer"
          >
            CONTINUE TO PAYMENT
          </button>
        </form>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ── SCREEN 7: STEP 2 - PAYMENT METHOD ────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 sm:p-7 space-y-5 shadow-2xs animate-in fade-in duration-150">
          <div className="pb-3 border-b border-[#EFE7DC]">
            <h2 className="text-xl font-serif font-bold text-[#221518]">
              Payment Method
            </h2>
            <p className="text-xs text-[#736B6D] mt-0.5">
              Select your preferred secure payment option.
            </p>
          </div>

          {/* Radio Payment Options */}
          <div className="space-y-3">
            
            {/* 1. UPI / QR */}
            <label
              className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === "upi"
                  ? "border-[#5E1224] bg-rose-50/40"
                  : "border-[#EFE7DC] hover:border-[#5E1224]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="accent-[#5E1224] w-4 h-4"
                />
                <div className="flex items-center gap-2">
                  <Smartphone size={18} className="text-[#5E1224]" />
                  <span className="text-xs font-bold text-[#221518]">UPI / QR (GPay, PhonePe, Paytm)</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Instant
              </span>
            </label>

            {/* 2. Cards */}
            <label
              className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === "card"
                  ? "border-[#5E1224] bg-rose-50/40"
                  : "border-[#EFE7DC] hover:border-[#5E1224]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="accent-[#5E1224] w-4 h-4"
                />
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-[#5E1224]" />
                  <span className="text-xs font-bold text-[#221518]">Cards (Visa, MasterCard, RuPay)</span>
                </div>
              </div>
            </label>

            {/* 3. Net Banking */}
            <label
              className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === "netbanking"
                  ? "border-[#5E1224] bg-rose-50/40"
                  : "border-[#EFE7DC] hover:border-[#5E1224]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "netbanking"}
                  onChange={() => setPaymentMethod("netbanking")}
                  className="accent-[#5E1224] w-4 h-4"
                />
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-[#5E1224]" />
                  <span className="text-xs font-bold text-[#221518]">Net Banking</span>
                </div>
              </div>
            </label>

            {/* 4. Cash on Delivery (COD) */}
            <label
              className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === "cod"
                  ? "border-[#5E1224] bg-rose-50/40"
                  : "border-[#EFE7DC] hover:border-[#5E1224]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-[#5E1224] w-4 h-4"
                />
                <div className="flex items-center gap-2">
                  <Banknote size={18} className="text-[#5E1224]" />
                  <span className="text-xs font-bold text-[#221518]">Cash on Delivery (COD)</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Pay on Delivery
              </span>
            </label>

          </div>

          {/* 100% Secure Payments Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#736B6D] pt-2">
            <Lock size={14} className="text-[#5E1224]" />
            <span>100% Secure Payments (256-Bit SSL Encryption)</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 border border-[#EFE7DC] text-[#221518] hover:bg-[#FAF7F2] font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handlePaymentSubmit}
              className="flex-2 bg-[#5E1224] hover:bg-[#470A18] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-transform active:scale-98 cursor-pointer"
            >
              REVIEW ORDER
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ── SCREEN 8: STEP 3 - ORDER REVIEW & SUMMARY ────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Order Summary Box */}
          <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 sm:p-6 space-y-4 shadow-2xs">
            <h2 className="text-lg font-serif font-bold text-[#221518] pb-2 border-b border-[#EFE7DC]">
              Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
            </h2>

            <div className="space-y-3 divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 pt-3 first:pt-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EFE7DC] shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.finalImageUrl || item.product.image || item.product.cardImage}
                      alt={item.product.name}
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#221518] truncate">{item.product.name}</p>
                    <p className="text-[11px] text-[#736B6D]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-xs text-[#221518]">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 sm:p-6 space-y-2 text-xs text-[#5C4F52] shadow-2xs">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#221518] pb-1">
              PRICE DETAILS
            </h3>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-[#221518]">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className={`font-bold ${shippingFee === 0 ? "text-emerald-700" : "text-[#221518]"}`}>
                {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="font-bold text-emerald-700">-₹{discount}</span>
            </div>
            <div className="pt-2 border-t border-[#EFE7DC] flex justify-between text-base font-extrabold text-[#221518]">
              <span className="font-serif">Total</span>
              <span className="text-[#5E1224]">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Delivery & Payment Method Summary */}
          <div className="bg-white rounded-3xl border border-[#EFE7DC] p-5 sm:p-6 space-y-3 text-xs shadow-2xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-[#736B6D] block mb-1 text-[10px]">
                Payment Method
              </span>
              <p className="font-bold text-[#221518] uppercase">
                {paymentMethod === "upi"
                  ? "UPI / QR Code"
                  : paymentMethod === "card"
                  ? "Credit / Debit Card"
                  : paymentMethod === "netbanking"
                  ? "Net Banking"
                  : "Cash on Delivery (COD)"}
              </p>
            </div>

            <div className="pt-2 border-t border-[#EFE7DC]">
              <span className="font-bold uppercase tracking-wider text-[#736B6D] block mb-1 text-[10px]">
                Shipping Address
              </span>
              <p className="font-bold text-[#221518]">{shippingAddress.name}</p>
              <p className="text-[#5C4F52]">{shippingAddress.line1}, {shippingAddress.line2}</p>
              <p className="text-[#5C4F52]">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
              <p className="text-[#5C4F52]">📞 {shippingAddress.phone}</p>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1 border border-[#EFE7DC] text-[#221518] hover:bg-[#FAF7F2] font-bold text-xs uppercase tracking-wider py-4 rounded-2xl transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handlePlaceOrder}
              className="flex-2 bg-[#5E1224] hover:bg-[#470A18] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>PLACE ORDER ({formatPrice(finalTotal)})</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
