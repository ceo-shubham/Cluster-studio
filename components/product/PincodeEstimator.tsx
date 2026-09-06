"use client";
import { useState } from "react";
import { MapPin, Truck, Check, Clock } from "lucide-react";

export default function PincodeEstimator() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<{ city: string; date: string; cod: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) return;

    setLoading(true);
    setTimeout(() => {
      // Calculate delivery date 3-4 days ahead
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 3);
      const dateStr = targetDate.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      let detectedCity = "your location";
      if (pincode.startsWith("11") || pincode.startsWith("20")) detectedCity = "Delhi NCR";
      else if (pincode.startsWith("40") || pincode.startsWith("41")) detectedCity = "Mumbai / Pune";
      else if (pincode.startsWith("56")) detectedCity = "Bangalore";
      else if (pincode.startsWith("70")) detectedCity = "Kolkata";
      else if (pincode.startsWith("60")) detectedCity = "Chennai";
      else if (pincode.startsWith("50")) detectedCity = "Hyderabad";
      else if (pincode.startsWith("30")) detectedCity = "Jaipur";
      else detectedCity = "Metro & Tier-2 Hubs";

      setResult({
        city: detectedCity,
        date: dateStr,
        cod: true,
      });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="bg-[#FAF7F2] rounded-2xl border border-[#EFE7DC] p-3.5 space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#221518]">
        <MapPin size={14} className="text-[#5E1224]" />
        <span>Check Estimated Delivery Date</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          className="flex-1 bg-white text-xs text-[#221518] rounded-xl px-3 py-2 outline-none border border-[#EFE7DC] focus:border-[#5E1224]"
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="bg-[#5E1224] hover:bg-[#470A18] disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {result && (
        <div className="pt-2 border-t border-[#EFE7DC] text-xs space-y-1 text-[#4A3B3E] animate-in fade-in duration-200">
          <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <Check size={13} />
            <span>Delivery available to <strong>{result.city}</strong> ({pincode})</span>
          </p>
          <p className="flex items-center gap-1.5 text-[#221518]">
            <Truck size={13} className="text-[#5E1224]" />
            <span>Estimated delivery by <strong>{result.date}</strong></span>
          </p>
          <p className="text-[11px] text-[#736B6D]">
            💵 Cash on Delivery &amp; Express Air Shipping available.
          </p>
        </div>
      )}
    </div>
  );
}
