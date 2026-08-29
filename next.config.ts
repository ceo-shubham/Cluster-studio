import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.backblazeb2.com" },
      { protocol: "https", hostname: "**.us-east-005.backblazeb2.com" },
      { protocol: "https", hostname: "f005.backblazeb2.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },

};

export default nextConfig;
