import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.goindigo.in",
        pathname: "/akamfailoverpage/**",
      },
    ],
  },
};

export default nextConfig;
