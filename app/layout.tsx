import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreLayoutWrapper from "@/components/layout/StoreLayoutWrapper";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cluster Studio — Personalized Gifts Made with Love",
  description: "Personalized gifts made with love for every moment. Custom mugs, magic mugs, bottles, t-shirts, hoodies, frames & keychains.",
  keywords: "custom print, personalized gifts, magic mug, photo frame, bottle, t-shirt, anniversary gifts, birthday gifts",
  openGraph: {
    title: "Cluster Studio — Personalized Gifts Made with Love",
    description: "Premium personalized gifts. For every moment, for every emotion.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col font-sans`}>
        <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: "12px", fontFamily: "var(--font-geist-sans)" },
            success: { style: { background: "#670D1F", color: "#fff" } },
            error: { style: { background: "#991b1b", color: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
