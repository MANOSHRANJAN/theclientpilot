import type { Metadata } from "next";
import { Bebas_Neue, Mulish } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SmoothScroll } from "@/components/SmoothScroll";
import { seoConfig } from "@/lib/seo";
import { buildMetadata } from "@/lib/metadata";
import { buildAllStructuredData } from "@/lib/structured-data";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas",
});

const mulish = Mulish({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mulish",
});

export const metadata: Metadata = buildMetadata(seoConfig);

/**
 * JSON-LD blocks, pre-serialized at module scope.
 *
 * These are rendered as native `<script type="application/ld+json">` tags —
 * NOT via `next/script`. `next/script` defers even `beforeInteractive` inline
 * scripts through the client-side `self.__next_s` queue, so the JSON-LD would
 * only exist in the DOM after hydration. Crawlers that do not execute
 * JavaScript (and Googlebot's first indexing wave) would then see no structured
 * data at all, which is why rich results appeared intermittently. A native
 * `<script>` tag puts the payload in the server-rendered HTML every time.
 *
 * `<` is escaped to `\u003c` so a stray HTML tag inside any string value can
 * never break out of the script element (XSS hardening, per the Next.js JSON-LD
 * guide).
 */
const structuredData = buildAllStructuredData(seoConfig).map((block) =>
  JSON.stringify(block).replace(/</g, "\\u003c"),
);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bebas.variable} ${mulish.variable}`}>
      <head>
        {structuredData.map((json, index) => (
          <script
            key={`ld-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
          />
        ))}
      </head>
      <body className="font-body bg-copula-white text-text-black">
        {children}
        <SmoothScroll />
        <Analytics />
      </body>
    </html>
  );
}
