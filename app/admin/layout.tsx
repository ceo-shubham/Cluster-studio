import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Cluster Studio",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="admin-root" className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased">
      {children}
    </div>
  );
}
