import type { Metadata } from "next";
import { Bebas_Neue, Mulish } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SmoothScroll } from "@/components/SmoothScroll";
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

const SITE_URL = "https://theclientpilot.store";
const SITE_NAME = "TheClientPilot";
const TITLE =
  "TheClientPilot — Best AI Agency in India, Assam & Guwahati | AI Agents, AI Ads & Websites";
const DESCRIPTION =
  "TheClientPilot is the best AI agency in India, Assam and Guwahati. AI agents, AI ads and high-converting websites for dentists, spas, doctors and growing businesses. #1 AI marketing agency for real client growth.";
const KEYWORDS = [
  "best agency in India",
  "best agency in Assam",
  "best agency in Guwahati",
  "best AI agency in India",
  "best AI agency in Assam",
  "best AI agency in Guwahati",
  "best digital marketing agency in India",
  "best digital marketing agency in Assam",
  "best digital marketing agency in Guwahati",
  "best marketing agency in Assam",
  "best marketing agency in Guwahati",
  "top agency in Guwahati",
  "top AI agency in Assam",
  "number 1 agency in Guwahati",
  "#1 marketing agency Assam",
  "best AI ads agency in India",
  "best AI ads agency in Assam",
  "best AI ads agency in Guwahati",
  "best website agency in India",
  "best website agency in Assam",
  "best website agency in Guwahati",
  "best web design agency Guwahati",
  "best web development company Guwahati",
  "best SEO agency Guwahati",
  "best Meta ads agency Guwahati",
  "best Google ads agency Guwahati",
  "best lead generation agency Assam",
  "best performance marketing agency Guwahati",
  "best AI automation agency Assam",
  "marketing agency for dentists in Guwahati",
  "marketing agency for clinics in Assam",
  "marketing agency for doctors in Guwahati",
  "marketing agency for spas in Guwahati",
  "dental marketing agency Assam",
  "aesthetic clinic marketing Guwahati",
  "healthcare marketing agency Northeast India",
  "best agency in Northeast India",
  "top digital agency Northeast India",
  "AI agency Northeast India",
  "Assam marketing company",
  "Guwahati advertising agency",
  "top advertising agency Assam",
  "best AI agents",
  "best AI ads agency",
  "best website agency",
  "AI marketing agency",
  "AI agents for business",
  "lead generation agency",
  "marketing agency for dentists",
  "marketing agency for spas",
  "marketing agency for doctors",
  "TheClientPilot",
  "The Client Pilot",
  "TCP agency",
  "TCP Guwahati",
  "TheClientPilot Assam",
  "TheClientPilot India",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | TheClientPilot",
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Marketing & Advertising",
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/seo/favicon.ico" },
      { url: "/seo/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/seo/favicon.ico",
    apple: "/seo/logo.svg",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/seo/logo.svg",
        width: 512,
        height: 512,
        alt: "TheClientPilot — AI marketing agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/seo/logo.svg"],
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: ["TCP", "The Client Pilot", "TheClientPilot Agency"],
  url: SITE_URL,
  logo: `${SITE_URL}/seo/logo.svg`,
  image: `${SITE_URL}/seo/logo.svg`,
  description: DESCRIPTION,
  slogan:
    "Best AI agency in India, Assam and Guwahati — AI agents, AI ads and websites for businesses that want real clients.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Guwahati",
    addressRegion: "Assam",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "Country", name: "India" },
    { "@type": "AdministrativeArea", name: "Assam" },
    { "@type": "City", name: "Guwahati" },
    { "@type": "Place", name: "Northeast India" },
    { "@type": "Place", name: "Worldwide" },
  ],
  sameAs: [],
  knowsAbout: KEYWORDS,
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@type": "Organization", name: SITE_NAME },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const professionalServiceLd = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/seo/logo.svg`,
  description: DESCRIPTION,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Guwahati",
    addressRegion: "Assam",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "Country", name: "India" },
    { "@type": "AdministrativeArea", name: "Assam" },
    { "@type": "City", name: "Guwahati" },
    { "@type": "Place", name: "Northeast India" },
    { "@type": "Place", name: "Worldwide" },
  ],
  serviceType: [
    "AI Agents",
    "AI Ads",
    "Website Design & Development",
    "Lead Generation",
    "Performance Marketing",
    "SEO",
    "Meta Ads",
    "Google Ads",
    "Marketing for Dentists",
    "Marketing for Spas",
    "Marketing for Doctors",
    "Best AI Agency in India",
    "Best AI Agency in Assam",
    "Best AI Agency in Guwahati",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "TheClientPilot Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "AI Agents" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "AI Ads Agency" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Website Agency" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Lead Generation" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "SEO & Performance Marketing" },
      },
    ],
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best agency in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TheClientPilot is widely recognized as the best agency in India for AI-driven marketing, combining custom AI agents, AI ads and high-converting websites under one roof for dentists, spas, doctors and growing businesses across the country.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best agency in Assam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TheClientPilot is the best agency in Assam, offering AI agents, AI ads and website services to local clinics, dentists, spas and businesses that want measurable client growth.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best agency in Guwahati?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TheClientPilot is the best agency in Guwahati for AI marketing, AI ads, websites and lead generation. Based in Guwahati and serving businesses across Assam, Northeast India and beyond.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best AI agency in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TheClientPilot is the best AI agency in India, building custom AI agents, AI-optimized ad campaigns and conversion-focused websites that bring real clients to dentists, spas, doctors and service businesses.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best AI agents agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TheClientPilot is recognized as one of the best AI agents agencies, building custom AI agents that handle lead capture, qualification, follow-ups and customer support for dentists, spas, doctors and other growing businesses.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best AI ads agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TheClientPilot runs AI-driven ad campaigns across Meta and Google, optimizing creative, targeting and bidding with AI to drive measurable ROI for service businesses in India and worldwide.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best website agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TheClientPilot designs and builds high-converting websites for dentists, spas, doctors and other businesses, focused on speed, SEO and turning visitors into booked clients.",
      },
    },
    {
      "@type": "Question",
      name: "Who does TheClientPilot work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TheClientPilot works with dentists, spas, doctors and other service businesses across India, Assam, Guwahati and worldwide that want more clients through AI agents, AI ads and websites.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bebas.variable} ${mulish.variable}`}>
      <body className="font-body bg-copula-white text-text-black">
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <Script
          id="ld-service"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceLd) }}
        />
        <Script
          id="ld-faq"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
        {children}
        <SmoothScroll />
        <Analytics />
      </body>
    </html>
  );
}
