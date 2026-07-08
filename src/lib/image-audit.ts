/**
 * Image alt-attribute audit (dev/test utility).
 *
 * A pure, dependency-free classifier for image accessibility. Given a set of
 * image descriptors it decides, per image, whether the `alt` attribute
 * satisfies the accessibility rules:
 *
 * - A **content** image (one that conveys information) is compliant only when
 *   its `alt` is a non-empty string of 1–125 characters (Req 9.1).
 * - A **decorative** image (one that conveys no information and exists only for
 *   visual styling) is compliant only when its `alt` is the empty string `""`
 *   so assistive technology skips it (Req 9.2).
 * - Any content image with a missing or empty `alt` is flagged as
 *   non-compliant with an indication identifying the affected image (Req 9.4).
 *
 * This module performs no rendering and has no side effects: it inspects the
 * descriptors it is given and returns a report. Callers use the report to drive
 * attribute-only fixes elsewhere; the audit itself never mutates anything.
 */

/** Minimum length for a compliant content-image `alt` (inclusive). */
export const CONTENT_ALT_MIN = 1;

/** Maximum length for a compliant content-image `alt` (inclusive). */
export const CONTENT_ALT_MAX = 125;

/**
 * A description of a single rendered image to audit.
 *
 * `alt` is optional to model the "missing attribute" case (`undefined`) as
 * distinct from an explicitly empty attribute (`""`).
 */
export interface ImageDescriptor {
  /** The image source (used only to identify the image in the report). */
  src: string;
  /** The `alt` attribute value, or `undefined` when the attribute is absent. */
  alt?: string;
  /**
   * `true` when the image is decorative (conveys no information). Defaults to
   * content (`false`) when omitted.
   */
  decorative?: boolean;
}

/** The reason a specific image failed the audit. */
export type FlagReason =
  /** Content image whose `alt` is missing or empty. */
  | "content-missing-alt"
  /** Content image whose `alt` exceeds the 125-character limit. */
  | "content-alt-too-long"
  /** Decorative image whose `alt` is not the empty string. */
  | "decorative-non-empty-alt";

/** A single non-compliant image identified by the audit. */
export interface FlaggedImage {
  /** The `src` of the offending image. */
  src: string;
  /** Whether the offending image was classified as decorative. */
  decorative: boolean;
  /** The specific reason the image was flagged. */
  reason: FlagReason;
}

/** The result of auditing a set of image descriptors. */
export interface ImageAuditReport {
  /** `true` when every audited image is compliant (no flags). */
  compliant: boolean;
  /** The list of non-compliant images; empty when `compliant` is `true`. */
  flagged: FlaggedImage[];
}

/**
 * Returns `true` when a content image's `alt` value is compliant, i.e. it is a
 * defined string whose length is within [CONTENT_ALT_MIN, CONTENT_ALT_MAX].
 */
function isCompliantContentAlt(alt: string | undefined): boolean {
  return (
    typeof alt === "string" &&
    alt.length >= CONTENT_ALT_MIN &&
    alt.length <= CONTENT_ALT_MAX
  );
}

/**
 * Audits a set of image descriptors against the alt-attribute rules and returns
 * a report listing every non-compliant image.
 *
 * Classification:
 * - Decorative images are compliant only when `alt === ""`. A missing `alt`
 *   (`undefined`) or any non-empty `alt` is flagged `decorative-non-empty-alt`.
 * - Content images are compliant only when `alt` is 1–125 characters. A missing
 *   or empty `alt` is flagged `content-missing-alt`; an over-long `alt` is
 *   flagged `content-alt-too-long`.
 *
 * @param images - The image descriptors to audit.
 * @returns A report with `compliant` and the list of `flagged` images.
 */
export function auditImages(images: readonly ImageDescriptor[]): ImageAuditReport {
  const flagged: FlaggedImage[] = [];

  for (const image of images) {
    const decorative = image.decorative === true;

    if (decorative) {
      // Decorative images must carry an explicitly empty alt.
      if (image.alt !== "") {
        flagged.push({
          src: image.src,
          decorative: true,
          reason: "decorative-non-empty-alt",
        });
      }
      continue;
    }

    // Content image: require a 1–125 char descriptive alt.
    if (!isCompliantContentAlt(image.alt)) {
      const reason: FlagReason =
        typeof image.alt === "string" && image.alt.length > CONTENT_ALT_MAX
          ? "content-alt-too-long"
          : "content-missing-alt";

      flagged.push({
        src: image.src,
        decorative: false,
        reason,
      });
    }
  }

  return {
    compliant: flagged.length === 0,
    flagged,
  };
}
