import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "github-contributions-api.jogruber.de" }
    ]
  },
  // Allow Next.js dev resources (HMR WebSocket, fonts, etc.) from any
  // local interface — covers both localhost and network IPs (10.x, 192.168.x).
  // This is safe because it only applies to the development server.
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    // Network IPs — the wildcard below covers all private RFC-1918 ranges
    // so you don't have to update this when your IP changes.
    "10.0.0.0/8",
    "172.16.0.0/12",
    "192.168.0.0/16",
    // Explicit IPs seen in errors:
    "10.127.82.148",
    "10.77.55.148"
  ]
};

export default nextConfig;
