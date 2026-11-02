import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Zugriff auf den Dev-Server über Tailscale erlauben; eigene Hosts/IPs per DEV_ORIGINS in .env.local
  allowedDevOrigins: ["*.ts.net", "**.ts.net", ...(process.env.DEV_ORIGINS?.split(",") ?? [])],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
