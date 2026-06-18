import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
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
