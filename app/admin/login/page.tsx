"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff } from "lucide-react";

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
    <div className="flex items-center justify-center px-4" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-800 border-2 border-amber-400 flex items-center justify-center mx-auto mb-2">
            <Lock size={20} className="text-amber-400" />
          </div>
          <h1 className="text-xl font-bold text-white">
            Cluster <span className="text-amber-400">Studio</span>
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#2a1208] rounded-2xl p-6 shadow-2xl border border-amber-900">
          <h2 className="text-white font-bold text-base mb-4">Sign In</h2>

          <div className="mb-3">
            <label className="text-xs text-gray-300 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1a0a03] border border-amber-900 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="admin@clusterstudio.in"
            />
          </div>

          <div className="mb-4 relative">
            <label className="text-xs text-gray-300 block mb-1">Password</label>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1a0a03] border border-amber-900 text-white rounded-xl px-3 py-2 pr-10 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-7 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
