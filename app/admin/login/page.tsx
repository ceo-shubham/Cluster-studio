"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials");
      sessionStorage.setItem("adminAuth", "true");
      sessionStorage.setItem("adminKey", data.token);
      toast.success("Welcome back, Admin!");
      router.push("/admin");
    } catch (err) {
      toast.error((err as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#350710] to-slate-950 flex flex-col items-center justify-center p-4">
      
      {/* Return to Store Link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-200 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Store</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        
        {/* Main Glass Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
          
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="relative w-14 h-14 rounded-2xl bg-[#670D1F] text-white flex items-center justify-center mx-auto mb-3 shadow-lg border border-amber-300/40">
              <ShieldCheck size={28} className="text-amber-300" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Cluster Studio Order & Fulfillment Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#670D1F] focus:bg-white transition-all"
                placeholder="admin@clusterstudio.in"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#670D1F] focus:bg-white transition-all"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#670D1F] hover:bg-[#520817] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-sm uppercase tracking-wider shadow-md hover:shadow-lg mt-2"
            >
              {loading ? "Verifying Credentials..." : "Sign In to Admin Panel"}
            </button>

          </form>

        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-rose-200/60 mt-4">
          Authorized personnel only • Cluster Studio Security
        </p>

      </div>
    </div>
  );
}

