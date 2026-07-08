import type { Metadata } from "next";
import { Bebas_Neue, Mulish } from "next/font/google";
import Script from "next/script";
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

const structuredData = buildAllStructuredData(seoConfig);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bebas.variable} ${mulish.variable}`}>
      <body className="font-body bg-copula-white text-text-black">
        {structuredData.map((block, index) => (
          <Script
            key={`ld-${index}`}
            id={`ld-${index}`}
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
          />
        ))}
        {children}
        <SmoothScroll />
        <Analytics />
      </body>
    </html>
  );
}
