/**
 * SEO audit classification (pure logic).
 *
 * A pure, dependency-free module used by the SEO audit tooling to turn raw
 * audit measurements into pass/fail classifications:
 *
 * - **Structured-data validity** is classified as valid if and only if the
 *   reported structured-data error list is empty (Req 11.3, Correctness
 *   Property 10).
 * - An **SEO score** in the range 0–100 is classified as meeting the target if
 *   and only if it is at least {@link SEO_SCORE_TARGET} (95) (Req 11.8,
 *   Correctness Property 10).
 *
 * These functions perform no measurement and have no side effects; they only
 * classify values the audit already produced.
 */

/** The minimum SEO score (inclusive) that meets the optimization target. */
export const SEO_SCORE_TARGET = 95;

/** The lowest valid SEO score. */
export const SEO_SCORE_MIN = 0;

/** The highest valid SEO score. */
export const SEO_SCORE_MAX = 100;

/** The result of classifying a structured-data error list. */
export interface StructuredDataClassification {
  /** `true` iff the error list is empty. */
  valid: boolean;
  /** The number of structured-data errors observed. */
  errorCount: number;
}

/** The result of classifying an SEO score against the target. */
export interface ScoreClassification {
  /** The score that was classified. */
  score: number;
  /** `true` iff `score` is at least {@link SEO_SCORE_TARGET}. */
  meetsTarget: boolean;
}

/**
 * Classifies structured-data validity from a list of reported errors.
 *
 * Validity holds if and only if the error list is empty; any error at all
 * makes the structured data invalid.
 *
 * @param errors - The structured-data errors reported for a page. The element
 *   type is irrelevant to the classification — only whether the list is empty.
 * @returns A {@link StructuredDataClassification} with `valid` and the observed
 *   `errorCount`.
 */
export function classifyStructuredData(
  errors: readonly unknown[]
): StructuredDataClassification {
  const errorCount = errors.length;
  return {
    valid: errorCount === 0,
    errorCount,
  };
}

/**
 * Classifies an SEO score against the optimization target.
 *
 * The score meets the target if and only if it is greater than or equal to
 * {@link SEO_SCORE_TARGET} (95).
 *
 * @param score - The SEO score to classify. Must be a finite number in the
 *   range [{@link SEO_SCORE_MIN}, {@link SEO_SCORE_MAX}].
 * @returns A {@link ScoreClassification} with the `score` and whether it
 *   `meetsTarget`.
 * @throws RangeError if `score` is not a finite number within 0–100.
 */
export function classifyScore(score: number): ScoreClassification {
  if (
    typeof score !== "number" ||
    !Number.isFinite(score) ||
    score < SEO_SCORE_MIN ||
    score > SEO_SCORE_MAX
  ) {
    throw new RangeError(
      `Invalid SEO score: expected a finite number in [${SEO_SCORE_MIN}, ${SEO_SCORE_MAX}], received ${score}`
    );
  }

  return {
    score,
    meetsTarget: score >= SEO_SCORE_TARGET,
  };
}
