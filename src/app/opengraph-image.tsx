import { ImageResponse } from "next/og";

import { seoConfig } from "@/lib/seo";

/**
 * OpenGraph / social-sharing image route (`/opengraph-image`).
 *
 * Next.js renders the default-exported function to a raster PNG at the size
 * declared by the `size` export and serves it with the `contentType` below.
 * The generated card is a branded 1200x630 image (Req 4.1) that intentionally
 * does NOT reproduce the site's visible page copy verbatim — it uses the
 * agency name, a short tagline, and the brand palette so that the social card
 * is recognizable without duplicating on-page content.
 *
 * `ImageResponse` output is a lightweight PNG well under the 5MB ceiling
 * (Req 4.1). If rendering throws, Next.js serves an HTTP error status (>=400)
 * rather than image content (Req 4.6) — the error path is handled by the
 * framework, so this function never returns non-image error payloads typed as
 * `image/png`.
 */

// Route segment config consumed by Next.js.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Non-empty description of TheClientPilot used as the image `alt` text.
 * Sourced from the single SEO config so it stays consistent with metadata.
 */
export const alt = seoConfig.ogImageAlt;

// Brand palette (mirrors the tokens in src/app/globals.css).
const BRAND = {
  orange: "rgb(252, 81, 0)",
  white: "rgb(244, 239, 233)",
  black: "rgb(0, 0, 0)",
} as const;

export default function OpengraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BRAND.white,
          color: BRAND.black,
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: BRAND.orange,
              marginRight: 20,
            }}
          />
          {seoConfig.siteName}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 108,
              fontWeight: 800,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
            }}
          >
            AI Agency
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 500,
              marginTop: 28,
              color: BRAND.orange,
            }}
          >
            Guwahati · Assam · Northeast India
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 500,
            color: "rgb(70, 70, 69)",
          }}
        >
          AI agents, AI ads & high-converting websites
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
