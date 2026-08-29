import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Cluster Studio",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="admin-root"
      style={{
        position: "absolute",
        top: "64px",        // below the sticky Navbar (h-16 = 64px)
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: "calc(100vh - 64px)",
        background: "#1a0a03",
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
}
