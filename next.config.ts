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
  // `/card` is the digital business card that the printed QR code and the NFC
  // tags point at. It is served from its own deployment (the `tapcard`
  // project) and proxied in here rather than copied, so re-exporting the card
  // never needs a release of this site. A rewrite rather than a redirect keeps
  // the address bar on theclientpilot.store, which is the whole point of
  // putting it on this domain.
  async rewrites() {
    return [
      {
        source: "/card",
        destination: "https://tapcard-three-livid.vercel.app/card",
      },
      // The page loads `/card/contact.vcf` beside itself — a real file rather
      // than a generated blob, because that is what makes iOS Safari offer
      // "Add to Contacts" instead of dropping a download into Files. Without
      // this second rule the page proxies but its vCard 404s.
      {
        source: "/card/:path*",
        destination: "https://tapcard-three-livid.vercel.app/card/:path*",
      },
    ];
  },
};

export default nextConfig;
