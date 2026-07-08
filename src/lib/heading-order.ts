/**
 * Heading-order checker for the SEO semantic-markup audit.
 *
 * A pure, dependency-free utility that validates a sequence of heading levels
 * (`1`–`6`, corresponding to `<h1>`–`<h6>`) taken in document order.
 *
 * The rule (Req 8.3, Correctness Property 9): reading the levels in document
 * order, no heading may be more than one level deeper than the nearest
 * preceding heading. Descending (going to a shallower level) is allowed by any
 * amount; only jumping deeper by more than one level is invalid.
 */

/** A heading level, corresponding to `<h1>`–`<h6>`. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * The result of checking a heading-level sequence.
 *
 * When `valid` is `false`, `offendingIndex` identifies the position of the
 * first heading that skips more than one level deeper than the heading that
 * precedes it.
 */
export interface HeadingOrderResult {
  /** `true` iff the sequence never skips more than one level deeper. */
  valid: boolean;
  /**
   * The index of the first offending heading, or `undefined` when the sequence
   * is valid.
   */
  offendingIndex?: number;
}

const MIN_LEVEL = 1;
const MAX_LEVEL = 6;

function isHeadingLevel(value: number): value is HeadingLevel {
  return Number.isInteger(value) && value >= MIN_LEVEL && value <= MAX_LEVEL;
}

/**
 * Checks whether a sequence of heading levels observes correct heading order.
 *
 * The sequence is valid if and only if, in document order, no heading is more
 * than one level deeper than the nearest preceding heading. The first heading
 * (if any) is always accepted because it has no preceding heading. An empty
 * sequence is valid.
 *
 * @param levels - Heading levels in document order. Each value must be an
 *   integer in the range `1`–`6`.
 * @returns A {@link HeadingOrderResult} indicating validity and, when invalid,
 *   the index of the first offending heading.
 * @throws RangeError if any entry is not an integer heading level `1`–`6`.
 */
export function checkHeadingOrder(
  levels: readonly number[]
): HeadingOrderResult {
  for (let i = 0; i < levels.length; i += 1) {
    const level = levels[i];
    if (!isHeadingLevel(level)) {
      throw new RangeError(
        `Invalid heading level at index ${i}: expected an integer 1-6, received ${level}`
      );
    }
  }

  for (let i = 1; i < levels.length; i += 1) {
    // A heading may go shallower by any amount, stay the same, or go deeper by
    // exactly one level relative to the nearest preceding heading. Going deeper
    // by more than one level is invalid.
    if (levels[i] - levels[i - 1] > 1) {
      return { valid: false, offendingIndex: i };
    }
  }

  return { valid: true };
}
