import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import ClearLegacyCart from "@/components/layout/ClearLegacyCart";
import FloatingContact from "@/components/layout/FloatingContact";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cluster Studio — Custom Prints",
  description: "Premium custom prints on mugs, bottles, t-shirts, hoodies & more. Your imagination, our craft.",
  keywords: "custom print, mug, t-shirt, hoodie, bottle, personalized gifts",
  openGraph: {
    title: "Cluster Studio",
    description: "Premium custom prints. Order online.",
    type: "website",
  },
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkConfigured =
  clerkKey.startsWith("pk_test_") || clerkKey.startsWith("pk_live_");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <>
      <ClearLegacyCart />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: "12px", fontFamily: "var(--font-geist-sans)" },
          success: { style: { background: "#166534", color: "#fff" } },
          error: { style: { background: "#991b1b", color: "#fff" } },
        }}
      />
    </>
  );

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {clerkConfigured ? (
          <ClerkProvider>
            {body}
          </ClerkProvider>
        ) : (
          body
        )}
      </body>
    </html>
  );
}
