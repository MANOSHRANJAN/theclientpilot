import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // `remotePatterns` previously allowlisted `www.goindigo.in` — a leftover
    // from the site this codebase was originally cloned from. No component
    // loads a remote image, so the entry granted the optimizer access to an
    // unrelated third-party host for nothing. Every image is local to
    // `public/images`, which needs no allowlist entry.
    //
    // AVIF is offered ahead of WebP: it is materially smaller at equivalent
    // quality, and image weight is the dominant Largest Contentful Paint cost
    // on this site. Browsers that do not support it fall back to WebP.
    formats: ["image/avif", "image/webp"],
    // Local images are content-hashed by the build, so a long immutable cache
    // is safe and avoids re-optimizing the same asset on every deploy.
    minimumCacheTTL: 31_536_000,
  },
};

export default nextConfig;
