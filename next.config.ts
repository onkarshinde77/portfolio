import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "github-contributions-api.jogruber.de" }
    ]
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"]
};

export default nextConfig;
