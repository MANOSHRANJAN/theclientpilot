/**
 * Structured-data validation and GBP-readiness utilities.
 *
 * Pure, dependency-free validators that inspect JSON-LD blocks and the SEO
 * config and return structured, typed error objects. Nothing here renders,
 * fetches, or mutates: every function is a pure mapping from input to a list
 * of findings (or, for {@link gbpReadiness}, a readiness result), so the whole
 * module is unit- and property-testable in isolation.
 *
 * Requirements covered:
 * - 6.3  Missing schema.org-required property → error identifying entity + property.
 * - 6.6  Inconsistent NAP across Organization/LocalBusiness → error identifying
 *        the property and both conflicting values.
 * - 7.2  Duplicate/differing canonical declaration → flag as non-compliant.
 * - 7.8  Duplicate Google site-verification token → flag as non-compliant.
 * - 12.2 GBP-readiness → exact set of missing fields among business name,
 *        postal address, telephone, and non-empty `sameAs`.
 */

import type { SeoConfig } from "./seo";

/** A JSON-LD structured-data block, treated as an untyped property bag. */
export type JsonLd = Record<string, unknown>;

// -- Error shapes ------------------------------------------------------------

/** A schema.org-required property is missing (or empty) from a block. */
export interface MissingRequiredPropertyError {
  kind: "missing-required-property";
  /** The declared entity type the property was expected on. */
  entityType: string;
  /** The name of the required property that is absent or empty. */
  property: string;
  message: string;
}

/** A NAP value differs between the Organization and LocalBusiness blocks. */
export interface InconsistentNapError {
  kind: "inconsistent-nap";
  /** The (possibly dotted, e.g. `address.postalCode`) property path. */
  property: string;
  /** The value emitted in the Organization block (undefined if absent). */
  organizationValue: string | undefined;
  /** The value emitted in the LocalBusiness block (undefined if absent). */
  localBusinessValue: string | undefined;
  message: string;
}

/** The canonical declaration is duplicated, differing, or missing. */
export interface CanonicalComplianceError {
  kind: "canonical-non-compliant";
  reason: "missing" | "duplicate" | "differing";
  /** Every canonical URL that was declared. */
  declared: string[];
  /** The single canonical URL that should have been declared. */
  expected: string;
  message: string;
}

/** More than one Google site-verification token is declared. */
export interface VerificationComplianceError {
  kind: "verification-non-compliant";
  reason: "duplicate";
  /** Every verification token that was declared. */
  tokens: string[];
  message: string;
}

/** Union of every structured-data / metadata compliance finding. */
export type SeoValidationError =
  | MissingRequiredPropertyError
  | InconsistentNapError
  | CanonicalComplianceError
  | VerificationComplianceError;

// -- GBP readiness -----------------------------------------------------------

/** The GBP-association fields tracked by {@link gbpReadiness}. */
export type GbpField =
  | "businessName"
  | "postalAddress"
  | "telephone"
  | "sameAs";

/** The outcome of a GBP-readiness check. */
export interface GbpReadinessResult {
  /** True only when no fields are missing. */
  ready: boolean;
  /** The exact set of missing fields, in a stable order. */
  missing: GbpField[];
}

// -- Internal helpers --------------------------------------------------------

/**
 * Returns the trimmed string value at `key` on `block`, or `undefined` when the
 * value is absent, not a string, or blank after trimming.
 */
function readString(block: JsonLd, key: string): string | undefined {
  const value = block[key];
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Returns the nested `address` object of a block, or `undefined`. */
function readAddress(block: JsonLd): JsonLd | undefined {
  const address = block["address"];
  if (address && typeof address === "object" && !Array.isArray(address)) {
    return address as JsonLd;
  }
  return undefined;
}

/**
 * Returns `true` when the property at `key` is present and non-empty, treating
 * empty strings, empty arrays, and `null`/`undefined` as absent.
 */
function isPresent(block: JsonLd, key: string): boolean {
  const value = block[key];
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value as object).length > 0;
  }
  return true;
}

/** The postal-address subfields compared for NAP consistency. */
const NAP_ADDRESS_FIELDS = [
  "streetAddress",
  "addressLocality",
  "addressRegion",
  "postalCode",
  "addressCountry",
] as const;

// -- Validators --------------------------------------------------------------

/**
 * Validates that `block` contains every schema.org-required property for its
 * declared `entityType`. A property counts as missing when it is absent or
 * empty (empty string, empty array, or empty object).
 *
 * @param entityType - The declared schema.org type, used in the error message.
 * @param block - The JSON-LD block to inspect.
 * @param requiredProperties - The properties schema.org marks required.
 * @returns One {@link MissingRequiredPropertyError} per missing property.
 */
export function validateRequiredProperties(
  entityType: string,
  block: JsonLd,
  requiredProperties: readonly string[],
): MissingRequiredPropertyError[] {
  const errors: MissingRequiredPropertyError[] = [];
  for (const property of requiredProperties) {
    if (!isPresent(block, property)) {
      errors.push({
        kind: "missing-required-property",
        entityType,
        property,
        message: `${entityType} is missing required property "${property}".`,
      });
    }
  }
  return errors;
}

/**
 * Validates that the business name, postal-address fields, and telephone are
 * character-identical (after trimming) between the Organization and
 * LocalBusiness/ProfessionalService blocks.
 *
 * @param organization - The Organization JSON-LD block.
 * @param localBusiness - The LocalBusiness/ProfessionalService JSON-LD block.
 * @returns One {@link InconsistentNapError} per differing property, each
 *   naming the property and both conflicting values.
 */
export function validateNapConsistency(
  organization: JsonLd,
  localBusiness: JsonLd,
): InconsistentNapError[] {
  const errors: InconsistentNapError[] = [];

  const compare = (
    property: string,
    orgValue: string | undefined,
    lbValue: string | undefined,
  ): void => {
    if (orgValue !== lbValue) {
      errors.push({
        kind: "inconsistent-nap",
        property,
        organizationValue: orgValue,
        localBusinessValue: lbValue,
        message:
          `Inconsistent NAP for "${property}": ` +
          `Organization="${orgValue ?? ""}" vs ` +
          `LocalBusiness="${lbValue ?? ""}".`,
      });
    }
  };

  compare("name", readString(organization, "name"), readString(localBusiness, "name"));
  compare(
    "telephone",
    readString(organization, "telephone"),
    readString(localBusiness, "telephone"),
  );

  const orgAddress = readAddress(organization);
  const lbAddress = readAddress(localBusiness);
  for (const field of NAP_ADDRESS_FIELDS) {
    compare(
      `address.${field}`,
      orgAddress ? readString(orgAddress, field) : undefined,
      lbAddress ? readString(lbAddress, field) : undefined,
    );
  }

  return errors;
}

/**
 * Validates that exactly one canonical URL is declared and equals `expected`.
 * A missing, duplicated, or differing declaration is flagged as non-compliant.
 *
 * @param declaredCanonicals - Every canonical URL declared for the page.
 * @param expected - The single canonical URL that should be declared.
 * @returns A single-element array with the {@link CanonicalComplianceError}
 *   when non-compliant, otherwise an empty array.
 */
export function validateCanonical(
  declaredCanonicals: readonly string[],
  expected: string,
): CanonicalComplianceError[] {
  const declared = [...declaredCanonicals];

  if (declared.length === 0) {
    return [
      {
        kind: "canonical-non-compliant",
        reason: "missing",
        declared,
        expected,
        message: `No canonical URL declared; expected exactly one "${expected}".`,
      },
    ];
  }

  if (declared.length > 1) {
    return [
      {
        kind: "canonical-non-compliant",
        reason: "duplicate",
        declared,
        expected,
        message:
          `Expected exactly one canonical URL but found ${declared.length}: ` +
          `${declared.join(", ")}.`,
      },
    ];
  }

  if (declared[0] !== expected) {
    return [
      {
        kind: "canonical-non-compliant",
        reason: "differing",
        declared,
        expected,
        message: `Canonical URL "${declared[0]}" differs from expected "${expected}".`,
      },
    ];
  }

  return [];
}

/**
 * Validates that at most one Google site-verification token is declared. More
 * than one is flagged as a duplicate; zero or one is compliant.
 *
 * @param tokens - Every Google site-verification token declared for the page.
 * @returns A single-element array with the {@link VerificationComplianceError}
 *   when duplicated, otherwise an empty array.
 */
export function validateGoogleVerification(
  tokens: readonly string[],
): VerificationComplianceError[] {
  if (tokens.length > 1) {
    return [
      {
        kind: "verification-non-compliant",
        reason: "duplicate",
        tokens: [...tokens],
        message:
          `Expected at most one Google verification token but found ` +
          `${tokens.length}: ${tokens.join(", ")}.`,
      },
    ];
  }
  return [];
}

/**
 * Reports GBP-association readiness for the given config.
 *
 * Readiness requires all of: a business name, a postal address (both the
 * owner-provided `streetAddress` and `postalCode` present, since locality,
 * region, and country are always configured), a telephone, and a non-empty
 * `sameAs` list. When any are missing, the exact set of missing fields is
 * returned in a stable order.
 *
 * @param config - The single-source SEO config.
 * @returns A {@link GbpReadinessResult}: `ready` is true only when `missing`
 *   is empty.
 */
export function gbpReadiness(config: SeoConfig): GbpReadinessResult {
  const missing: GbpField[] = [];

  if (config.siteName.trim().length === 0) {
    missing.push("businessName");
  }

  const hasStreet =
    typeof config.streetAddress === "string" &&
    config.streetAddress.trim().length > 0;
  const hasPostalCode =
    typeof config.postalCode === "string" &&
    config.postalCode.trim().length > 0;
  if (!hasStreet || !hasPostalCode) {
    missing.push("postalAddress");
  }

  const hasTelephone =
    typeof config.telephone === "string" &&
    config.telephone.trim().length > 0;
  if (!hasTelephone) {
    missing.push("telephone");
  }

  const hasSameAs =
    Array.isArray(config.sameAs) &&
    config.sameAs.some(
      (entry) => typeof entry === "string" && entry.trim().length > 0,
    );
  if (!hasSameAs) {
    missing.push("sameAs");
  }

  return { ready: missing.length === 0, missing };
}
