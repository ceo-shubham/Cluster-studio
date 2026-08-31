"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClearLegacyCart from "@/components/layout/ClearLegacyCart";
import FloatingContact from "@/components/layout/FloatingContact";
import WishlistDrawer from "@/components/wishlist/WishlistDrawer";
import GiftFinderModal from "@/components/gift-finder/GiftFinderModal";

export default function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen w-full flex-1 flex flex-col">{children}</main>;
  }

  return (
    <>
      <ClearLegacyCart />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
      <WishlistDrawer />
      <GiftFinderModal />
    </>
  );
}
