import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [62, 70, 72, 75],
  },
  async headers() {
    return [
      {
        // Quiz/product art is content-hashed by path and never mutated in place,
        // so let the browser cache it aggressively — no reload on back/forward.
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
