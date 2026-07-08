/**
 * URL helpers for the SEO system.
 *
 * Pure, dependency-free functions that produce and validate the absolute,
 * canonical https URLs used across structured data, metadata, robots, and
 * the sitemap. These helpers have no dependency on Next.js so they can be
 * unit- and property-tested in isolation.
 */

/**
 * Returns `true` when `url` begins with the `https://` scheme and contains a
 * non-empty host.
 *
 * The host is the segment after `https://` up to the first path (`/`), query
 * (`?`), or fragment (`#`) delimiter. A URL such as `https://` (no host) or
 * any non-https scheme returns `false`.
 *
 * @param url - The URL to inspect.
 * @returns `true` if the URL is an absolute https URL with a host.
 */
export function isAbsoluteHttps(url: string): boolean {
  const scheme = "https://";
  if (!url.startsWith(scheme)) {
    return false;
  }

  const afterScheme = url.slice(scheme.length);
  const delimiterIndex = afterScheme.search(/[/?#]/);
  const host =
    delimiterIndex === -1 ? afterScheme : afterScheme.slice(0, delimiterIndex);

  return host.length > 0;
}

/**
 * Joins `base` and `path` into a single absolute URL, guaranteeing exactly one
 * slash at the boundary (never a double slash, never a missing slash).
 *
 * If `path` is already an absolute https URL it is returned unchanged. A `path`
 * that is empty or resolves to the site root yields the trailing-slash-trimmed
 * `base`.
 *
 * @param path - A path (with or without a leading slash) or an absolute URL.
 * @param base - The base URL (for example `https://theclientpilot.store`).
 * @returns The joined absolute URL with no double slash at the boundary.
 */
export function absoluteUrl(path: string, base: string): string {
  if (isAbsoluteHttps(path)) {
    return path;
  }

  const trimmedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  return normalizedPath.length > 0
    ? `${trimmedBase}/${normalizedPath}`
    : trimmedBase;
}

/**
 * Returns `base` with any trailing slash beyond the domain root removed, giving
 * the canonical home-page URL form (for example
 * `https://theclientpilot.store/` becomes `https://theclientpilot.store`).
 *
 * @param base - The base URL, possibly with one or more trailing slashes.
 * @returns The canonical base URL with no trailing slash.
 */
export function canonicalHome(base: string): string {
  return base.replace(/\/+$/, "");
}
