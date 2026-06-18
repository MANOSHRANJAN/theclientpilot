import type { Metadata } from "next";
import { Bebas_Neue, Mulish } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Copula Agency powered by Degordian",
  description:
    "We bring strategy, creativity, and agile approach together to help brands connect with people, and turn that connection into real results.",
  icons: {
    icon: "/seo/favicon.ico",
  },
  openGraph: {
    title: "Copula Agency powered by Degordian",
    description:
      "We bring strategy, creativity, and agile approach together to help brands connect with people, and turn that connection into real results.",
    url: "https://copula.agency/",
    siteName: "Copula",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bebas.variable} ${mulish.variable}`}>
      <body className="font-body bg-copula-white text-text-black">
        {children}
      </body>
    </html>
  );
}
